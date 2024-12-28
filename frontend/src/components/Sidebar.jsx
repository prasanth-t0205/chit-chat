import { useChat } from "../hooks/useChat";
import { useAuth } from "../hooks/useAuth";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { FiEdit } from "react-icons/fi";
import { useFriends } from "../hooks/useFriends";
import { Search, X } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const { friends, isLoading } = useFriends();
  const { onlineUsers } = useAuth();
  const { selectedUser, setSelectedUser } = useChat();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = friends.filter((friend) =>
    friend.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full bg-base-100 border-r border-base-200 flex flex-col w-full md:w-80">
      <div className="p-4 border-b border-base-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Friends</span>
          </div>
          <div className="flex items-center gap-3">
            {showSearch ? (
              <X
                size={27}
                className="text-base-content/60 hover:bg-base-200 p-1 rounded-md cursor-pointer transition-colors duration-200"
                onClick={() => {
                  setShowSearch(false);
                  setSearchTerm("");
                }}
              />
            ) : (
              <Search
                size={27}
                className="text-base-content/60 hover:bg-base-200 p-1 rounded-md cursor-pointer transition-colors duration-200"
                onClick={() => setShowSearch(true)}
              />
            )}
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="p-4 border-b border-base-200">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-base-200 focus:outline-none"
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {(searchTerm ? filteredFriends : friends).map((friend) => (
          <button
            key={friend._id}
            onClick={() => setSelectedUser(friend)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-base-200 transition-all ${
              selectedUser?._id === friend._id ? "bg-base-200" : ""
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={friend.profilePic || "/avatar.png"}
                alt={friend.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              {onlineUsers.includes(friend._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium truncate">{friend.fullName}</div>
              <div
                className={`text-sm ${
                  onlineUsers.includes(friend._id)
                    ? "text-green-500"
                    : "text-base-content/60"
                }`}
              >
                {onlineUsers.includes(friend._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
