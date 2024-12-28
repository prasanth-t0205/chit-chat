import { ArrowLeft, MoreVertical, Search, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "../hooks/useSearch";
import { FaUserMinus } from "react-icons/fa";
import ConfirmModal from "./ConfirmModal";
import { MdBlock } from "react-icons/md";

const ChatHeader = ({ onSearchClick }) => {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { unfriendMutation } = useSearch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteAllMessagesMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(
        `/messages/all/${selectedUser._id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", selectedUser._id]);
      setShowDeleteDialog(false);
    },
  });

  const isUserOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  const handleDeleteMessages = () => {
    deleteAllMessagesMutation.mutate();
  };

  const handleUnfriendClick = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleConfirmUnfriend = () => {
    if (selectedUserId) {
      unfriendMutation.mutate(selectedUserId, {
        onSuccess: () => {
          setSelectedUser(null);
          setIsModalOpen(false);
          queryClient.invalidateQueries(["messages"]);
          queryClient.invalidateQueries(["friends"]);
        },
      });
    }
  };

  if (!selectedUser) return null;

  return (
    <>
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setSelectedUser(null)}
              aria-label="Back to contacts"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium">{selectedUser.fullName}</h3>
              <p className="text-sm text-base-content/70">
                {isUserOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="btn btn-ghost btn-sm btn-square"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onSearchClick();
                      setShowDropdown(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm w-full hover:bg-base-200 gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Search Messages
                  </button>
                  <button
                    onClick={() => handleUnfriendClick(selectedUser._id)}
                    className="flex items-center px-4 py-2 text-sm w-full hover:bg-base-200 gap-2"
                  >
                    <FaUserMinus className="w-4 h-4" />
                    Unfriend
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm w-full hover:bg-base-200 gap-2">
                    <MdBlock className="w-4 h-4" />
                    Block User
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowDeleteDialog(true);
                    }}
                    className="flex items-center px-4 py-2 text-sm w-full hover:bg-base-200 gap-2 text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete All Messages
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4 animate-scale-up">
              <h3 className="text-lg font-bold mb-4">Delete All Messages</h3>
              <p className="text-base-content/70 mb-6">
                Are you sure you want to delete all messages with{" "}
                {selectedUser.fullName}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleDeleteMessages}
                  disabled={deleteAllMessagesMutation.isPending}
                >
                  {deleteAllMessagesMutation.isPending ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Delete All"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
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

export default ChatHeader;
