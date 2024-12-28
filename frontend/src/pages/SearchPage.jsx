import React, { useState } from "react";
import {
  FaSearch,
  FaUserFriends,
  FaUserPlus,
  FaUserClock,
  FaChevronLeft,
  FaTimes,
  FaCheck,
  FaUserMinus,
} from "react-icons/fa";
import { useSearch } from "../hooks/useSearch";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const {
    searchQuery: searchUsers,
    friendRequestsMutation,
    cancelRequestMutation,
    acceptRequestMutation,
    rejectRequestMutation,
    friendRequestsQuery,
    friendsQuery,
    unfriendMutation,
  } = useSearch();

  const { data: searchResults = [] } = searchUsers(searchQuery);
  const { data: friends = [] } = friendsQuery;
  const { data: requests = { receivedRequests: [], sentRequests: [] } } =
    friendRequestsQuery;

  const tabs = [
    { id: "search", label: "Search", icon: <FaSearch />, count: null },
    {
      id: "requested",
      label: "Requests",
      icon: <FaUserClock />,
      count: requests.receivedRequests.length,
    },
    {
      id: "sent",
      label: "Sent",
      icon: <FaUserPlus />,
      count: requests.sentRequests.length,
    },
    {
      id: "friends",
      label: "Friends",
      icon: <FaUserFriends />,
      count: friends.length,
    },
  ];

  const handleConnect = (userId) => {
    friendRequestsMutation.mutate(userId);
  };

  const handleAccept = (userId) => {
    acceptRequestMutation.mutate(userId);
  };

  const handleReject = (userId) => {
    rejectRequestMutation.mutate(userId);
  };

  const handleCancel = (userId) => {
    cancelRequestMutation.mutate(userId);
  };

  const handleUnfriendClick = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleConfirmUnfriend = () => {
    if (selectedUserId) {
      unfriendMutation.mutate(selectedUserId);
    }
  };

  const renderUserCard = (user, type) => (
    <div
      key={user._id}
      className="group relative overflow-hidden bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.1)] border border-base-300"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex flex-col sm:flex-row items-center gap-4">
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-base-100 p-0.5 rounded-xl transform group-hover:scale-105 transition-transform duration-500">
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.fullName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left transform group-hover:translate-x-2 transition-transform duration-500">
          <h3 className="text-base sm:text-lg font-bold tracking-tight truncate mb-0.5 group-hover:text-primary transition-colors">
            {user.fullName}
          </h3>
          <p className="text-sm text-base-content/60 truncate group-hover:text-base-content/80 transition-colors">
            {user.email}
          </p>
        </div>

        <div className="shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
          {type === "search" &&
            (requests.sentRequests.some(
              (request) => request._id === user._id
            ) ? (
              <button
                onClick={() => handleCancel(user._id)}
                className="w-full sm:w-auto btn bg-base-300 hover:bg-base-300/80 btn-sm rounded-xl gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <FaTimes className="text-base" />
                <span>Unsend Request</span>
              </button>
            ) : (
              <button
                onClick={() => handleConnect(user._id)}
                className="w-full sm:w-auto btn btn-primary btn-sm rounded-xl px-4 gap-2 font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <FaUserPlus className="text-base" />
                <span>Connect</span>
              </button>
            ))}

          {type === "requested" && (
            <div className="flex gap-2 justify-center sm:justify-end">
              <button
                onClick={() => handleAccept(user._id)}
                className="btn btn-success btn-sm rounded-xl gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <FaCheck className="text-base" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => handleReject(user._id)}
                className="btn btn-error btn-sm rounded-xl gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <FaTimes className="text-base" />
                <span>Decline</span>
              </button>
            </div>
          )}

          {type === "sent" && (
            <button
              onClick={() => handleCancel(user._id)}
              className="w-full sm:w-auto btn bg-base-300 hover:bg-base-300/80 btn-sm rounded-xl gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              <FaTimes className="text-base" />
              <span>Cancel</span>
            </button>
          )}

          {type === "friends" && (
            <button
              onClick={() => handleUnfriendClick(user._id)}
              className="w-full sm:w-auto btn btn-error btn-sm rounded-xl gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              <FaUserMinus className="text-base" />
              <span>Unfriend</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="h-screen bg-base-200">
        <div className="h-full md:p-4 p-0">
          <div className="bg-base-100 rounded-lg shadow-xl w-full h-full overflow-hidden">
            <div className="flex h-full">
              <div
                className={`${
                  isSidebarOpen ? "w-72" : "w-20"
                } bg-base-300 transition-all duration-300 hidden md:block`}
              >
                <div className="p-4">
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-base-200 mb-6"
                  >
                    <FaChevronLeft
                      className={`transform transition-transform duration-300 ${
                        !isSidebarOpen && "rotate-180"
                      }`}
                    />
                  </button>
                  <div className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                          activeTab === tab.id
                            ? "text-primary"
                            : "text-base-content hover:bg-base-200"
                        }`}
                      >
                        <div className="flex items-center gap-4 relative z-0">
                          <span
                            className={`text-xl ${
                              activeTab === tab.id
                                ? "text-primary"
                                : "text-base-content"
                            }`}
                          >
                            {tab.icon}
                          </span>
                          {isSidebarOpen && (
                            <span
                              className={`font-medium ${
                                activeTab === tab.id
                                  ? "text-primary"
                                  : "text-base-content"
                              }`}
                            >
                              {tab.label}
                            </span>
                          )}
                        </div>
                        {isSidebarOpen && tab.count !== null && (
                          <span className="bg-secondary text-secondary-content px-2 py-1 rounded-full text-xs relative z-0">
                            {tab.count}
                          </span>
                        )}
                        {activeTab === tab.id && (
                          <div className="absolute inset-0 bg-base-200 opacity-90 -z-10" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-fit">
                <div className="bg-base-100/90 backdrop-blur-xl rounded-xl p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-base-200">
                  <div className="flex items-center gap-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-all duration-300 ${
                          activeTab === tab.id
                            ? "bg-primary/10 text-primary"
                            : "text-base-content/60 hover:text-base-content hover:bg-base-200"
                        }`}
                      >
                        <div className="relative">
                          <span className="text-lg">{tab.icon}</span>
                          {tab.count !== null && tab.count > 0 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-secondary text-[9px] font-bold text-secondary-content rounded-full flex items-center justify-center">
                              {tab.count}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[9px] font-medium mt-0.5 transition-all duration-300 ${
                            activeTab === tab.id ? "opacity-100" : "opacity-60"
                          }`}
                        >
                          {tab.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="h-full flex flex-col p-4 md:p-6">
                  {activeTab === "search" && (
                    <div className="relative mb-6">
                      <input
                        type="text"
                        placeholder="Search by name or username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 md:py-4 rounded-2xl bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 text-sm md:text-base"
                      />
                      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-16 md:pb-0">
                      {activeTab === "search" &&
                        searchQuery &&
                        searchResults.map((user) =>
                          renderUserCard(user, "search")
                        )}

                      {activeTab === "requested" &&
                      requests.receivedRequests.length > 0
                        ? requests.receivedRequests.map((user) =>
                            renderUserCard(user, "requested")
                          )
                        : activeTab === "requested" && (
                            <div className="col-span-full h-full">
                              <EmptyState type="requests" />
                            </div>
                          )}

                      {activeTab === "sent" && requests.sentRequests.length > 0
                        ? requests.sentRequests.map((user) =>
                            renderUserCard(user, "sent")
                          )
                        : activeTab === "sent" && (
                            <div className="col-span-full h-full">
                              <EmptyState type="sent" />
                            </div>
                          )}

                      {activeTab === "friends" && friends.length > 0
                        ? friends.map((user) => renderUserCard(user, "friends"))
                        : activeTab === "friends" && (
                            <div className="col-span-full h-full">
                              <EmptyState type="friends" />
                            </div>
                          )}

                      {activeTab === "search" && !searchQuery && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                          Start typing to search for users...
                        </div>
                      )}

                      {activeTab === "search" &&
                        searchQuery &&
                        searchResults.length === 0 && (
                          <div className="col-span-full text-center py-8 text-gray-500">
                            No users found matching your search.
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUnfriend}
        title="Unfriend User"
        message="Are you sure you want to unfriend this user? All chat messages will be deleted."
        type="warning"
        confirmText="Unfriend"
        cancelText="Cancel"
      />
    </>
  );
};

export default SearchPage;
