import { Copy, Forward, Info, Share, Trash2 } from "lucide-react";

const MessageDropdown = ({
  message,
  authUser,
  dropdownRef,
  onCopyMessage,
  onDeleteClick,
  shouldShowDropdownAbove,
}) => {
  return (
    <div
      ref={dropdownRef}
      style={{ opacity: 1 }}
      className={`absolute ${
        message.senderId === authUser._id ? "right-0" : "left-0"
      } ${
        shouldShowDropdownAbove ? "bottom-full mb-1" : "mt-1"
      } w-48 rounded-lg shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5 z-50`}
    >
      {message.senderId === authUser._id && (
        <button
          onClick={() => onDeleteClick(message)}
          className="flex items-center px-4 py-2 text-sm w-full hover:bg-base-200 gap-2 text-error"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      )}
      {message.text && (
        <button
          onClick={() => onCopyMessage(message.text)}
          className="flex items-center px-4 py-2 text-sm w-full hover:bg-base-200 gap-2 text-base-content"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
      )}
      <button className="flex items-center px-4 py-2 text-sm w-full hover:bg-base-200 gap-2 text-base-content">
        <Forward className="w-4 h-4" />
        Forward
      </button>
      <button className="flex items-center px-4 py-2 text-sm w-full hover:bg-base-200 gap-2 text-base-content">
        <Share className="w-4 h-4" />
        Share
      </button>
      <button className="flex items-center px-4 py-2 text-sm w-full hover:bg-base-200 gap-2 text-base-content">
        <Info className="w-4 h-4" />
        Info
      </button>
    </div>
  );
};

export default MessageDropdown;
