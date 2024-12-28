import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../hooks/useAuth";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { ChevronDown } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import MessageDropdown from "./MessageDropdown";
import DeleteDialog from "./DeleteDialog";
import ImagePreview from "./ImagePreview";
import SearchModal from "./SearchModal";

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useChat();
  const { authUser } = useAuth();
  const messageEndRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchHighlight, setSearchHighlight] = useState("");
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      const response = await axiosInstance.delete(`/messages/${messageId}`);
      return response.data;
    },
    onSuccess: (_, messageId) => {
      queryClient.setQueryData(
        ["messages", selectedUser._id],
        (oldMessages = []) => {
          return oldMessages.filter((msg) => msg._id !== messageId);
        }
      );
      setShowDeleteDialog(false);
      setMessageToDelete(null);
    },
  });

  const shouldShowDropdownAbove = (messageElement) => {
    if (!chatContainerRef.current || !messageElement) return false;

    const containerRect = chatContainerRef.current.getBoundingClientRect();
    const messageRect = messageElement.getBoundingClientRect();
    const distanceFromBottom = containerRect.bottom - messageRect.bottom;
    const distanceFromTop = messageRect.top - containerRect.top;

    if (distanceFromBottom < 180) {
      return distanceFromTop > 180;
    }

    return false;
  };

  const scrollToMessage = (messageId, query) => {
    if (query) {
      setSearchHighlight(query);
    }
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    setShowDropdown(false);
    setActiveMessageId(null);
  };

  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setShowDeleteDialog(true);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (messageEndRef.current && messages?.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, selectedUser]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
    setShowScrollBottom(bottom > 100);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader onSearchClick={() => setShowSearch(true)} />
      <SearchModal
        isOpen={showSearch}
        onClose={() => {
          setShowSearch(false);
          setSearchHighlight("");
        }}
        selectedUserId={selectedUser?._id}
        onNavigateMessage={scrollToMessage}
      />
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full px-3 xs:px-4 sm:px-4 md:px-6 lg:px-8 py-2"
      >
        {messages.map((message, idx) => {
          const isCurrentUserMessage = message.senderId === authUser._id;
          const isLastMessage = idx === messages.length - 1;
          const isConsecutiveMessage =
            idx > 0 && messages[idx - 1].senderId === message.senderId;

          return (
            <div
              id={message._id}
              key={message._id}
              className={`flex ${
                isCurrentUserMessage ? "justify-end" : "justify-start"
              } ${isConsecutiveMessage ? "mt-[2px]" : "mt-3"}`}
              ref={isLastMessage ? messageEndRef : null}
            >
              <div className="flex flex-col w-fit max-w-[75%] xs:max-w-[70%] sm:max-w-[65%] md:max-w-[60%] lg:max-w-[50%] relative group">
                <div
                  className={`relative px-1.5 xs:px-2 pt-[6px] pb-[18px] break-all ${
                    isCurrentUserMessage
                      ? "bg-primary text-primary-content ml-auto"
                      : "bg-base-200"
                  } rounded-[3px]`}
                  style={{ boxShadow: "0 1px 0.5px rgba(0, 0, 0, 0.13)" }}
                  onMouseEnter={() => setActiveMessageId(message._id)}
                  onMouseLeave={() => setActiveMessageId(null)}
                >
                  <div
                    className={`absolute top-0 ${
                      isCurrentUserMessage ? "left-0 -ml-8" : "right-0 -mr-8"
                    } w-8 h-8`}
                  >
                    {(activeMessageId === message._id ||
                      showDropdown === message._id) && (
                      <button
                        onClick={(e) => {
                          const messageElement =
                            e.currentTarget.parentElement.parentElement
                              .parentElement;
                          const shouldShowAbove =
                            shouldShowDropdownAbove(messageElement);
                          setDropdownPosition(shouldShowAbove);
                          setShowDropdown((currentId) =>
                            currentId === message._id ? false : message._id
                          );
                          setActiveMessageId((currentId) =>
                            currentId === message._id ? null : message._id
                          );
                        }}
                        className="btn btn-ghost btn-xs btn-circle"
                      >
                        <ChevronDown className={`w-4 h-4`} />
                      </button>
                    )}

                    {showDropdown === message._id && (
                      <MessageDropdown
                        message={message}
                        authUser={authUser}
                        dropdownRef={dropdownRef}
                        onCopyMessage={handleCopyMessage}
                        onDeleteClick={handleDeleteClick}
                        shouldShowDropdownAbove={dropdownPosition}
                      />
                    )}
                  </div>
                  {message.image && (
                    <>
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-full w-auto xs:max-w-[180px] sm:max-w-[200px] rounded-[3px] mb-1 cursor-pointer"
                        onClick={() => setPreviewImage(message.image)}
                      />

                      {previewImage && (
                        <ImagePreview
                          image={previewImage}
                          onClose={() => setPreviewImage(null)}
                        />
                      )}
                    </>
                  )}
                  <p
                    className={`text-[12px] xs:text-[13px] sm:text-[14px] leading-[18px] pr-[35px] xs:pr-[40px] break-all whitespace-pre-wrap ${
                      isCurrentUserMessage
                        ? "text-primary-content"
                        : "text-base-content"
                    }`}
                  >
                    {searchHighlight
                      ? message.text
                          .split(new RegExp(`(${searchHighlight})`, "gi"))
                          .map((part, i) =>
                            part.toLowerCase() ===
                            searchHighlight.toLowerCase() ? (
                              <span
                                key={i}
                                className={`${
                                  isCurrentUserMessage
                                    ? "bg-primary-content/20"
                                    : "bg-primary/20"
                                }`}
                              >
                                {part}
                              </span>
                            ) : (
                              part
                            )
                          )
                      : message.text}
                  </p>

                  <span
                    className={`text-[10px] inline-block min-w-[50px] text-right absolute bottom-[5px] right-2 mr-[2px] ${
                      isCurrentUserMessage
                        ? "text-primary-content/70"
                        : "text-base-content/70"
                    }`}
                  >
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-8 p-2 bg-primary text-primary-content rounded-full shadow-lg hover:bg-primary/90 transition-all"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      )}
      <div className="px-3 xs:px-4 sm:px-4 md:px-6 lg:px-8 py-2  border-t border-base-300">
        <MessageInput />
      </div>

      {showDeleteDialog && (
        <DeleteDialog
          onClose={() => setShowDeleteDialog(false)}
          onDelete={() => deleteMessageMutation.mutate(messageToDelete._id)}
          isPending={deleteMessageMutation.isPending}
        />
      )}
    </div>
  );
};

export default ChatContainer;
