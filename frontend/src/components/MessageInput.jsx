import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { BsEmojiSmile, BsCamera } from "react-icons/bs";
import { IoAttach, IoCloseOutline } from "react-icons/io5";
import {
  IoImageOutline,
  IoDocumentOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { HiOutlineMicrophone } from "react-icons/hi2";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachmentsRef = useRef(null);
  const { sendMessage } = useChat();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        attachmentsRef.current &&
        !attachmentsRef.current.contains(event.target) &&
        !event.target.closest("button[data-attachment-toggle]")
      ) {
        setShowAttachments(false);
      }
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageSelect = () => {
    fileInputRef.current?.click();
    setShowAttachments(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    sendMessage(
      {
        text: text.trim(),
        image: imagePreview,
      },
      {
        onSuccess: () => {
          setText("");
          setImagePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      }
    );
  };

  return (
    <div className="relative bg-transparent">
      {imagePreview && (
        <div className="mb-2">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-16 w-16 object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1 -right-1 size-4 rounded-full bg-base-300 flex items-center justify-center text-base-100"
              type="button"
            >
              <IoCloseOutline className="size-4 text-base-content" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center">
        <div className="flex-1 flex items-center">
          <div className="flex items-center gap-2 px-1">
            <button
              type="button"
              className="transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <BsEmojiSmile className="size-5 opacity-70" />
            </button>
            <button
              type="button"
              data-attachment-toggle
              className=" transition-colors"
              onClick={() => setShowAttachments((current) => !current)}
            >
              <IoAttach className="size-6 opacity-70" />
            </button>
          </div>

          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-1 py-2 text-sm placeholder:text-base-content/50"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            type="submit"
            className={`pr-2 ${
              text.trim() || imagePreview
                ? "text-[#00a884]"
                : "transition-colors"
            }`}
            disabled={!text.trim() && !imagePreview}
          >
            <MdSend className="size-6" />
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </form>

      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            width={300}
            height={400}
            theme="dark"
            searchDisabled={false}
            skinTonesDisabled
            previewConfig={{
              showPreview: false,
            }}
          />
        </div>
      )}

      {showAttachments && (
        <div
          ref={attachmentsRef}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-base-100 rounded-lg shadow-lg p-4 min-w-[280px] grid grid-cols-3 gap-4"
        >
          <button
            className="flex flex-col items-center gap-2 p-3"
            onClick={handleImageSelect}
          >
            <div className="bg-[#BF59CF] p-3 rounded-full">
              <IoImageOutline className="size-6 text-white" />
            </div>
            <span className="text-sm">Gallery</span>
          </button>
          <button
            className="flex flex-col items-center gap-2 p-3"
            onClick={handleImageSelect}
          >
            <div className="bg-[#D3396D] p-3 rounded-full">
              <BsCamera className="size-6 text-white" />
            </div>
            <span className="text-sm">Camera</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3">
            <div className="bg-[#5157AE] p-3 rounded-full">
              <IoDocumentOutline className="size-6 text-white" />
            </div>
            <span className="text-sm">Document</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3">
            <div className="bg-[#D3396D] p-3 rounded-full">
              <HiOutlineMicrophone className="size-6 text-white" />
            </div>
            <span className="text-sm">Audio</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3">
            <div className="bg-[#5157AE] p-3 rounded-full">
              <IoLocationOutline className="size-6 text-white" />
            </div>
            <span className="text-sm">Location</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
