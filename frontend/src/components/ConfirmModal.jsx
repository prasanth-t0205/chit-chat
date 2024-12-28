import React from "react";
import {
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  const icons = {
    warning: <FaExclamationTriangle className="text-4xl text-warning" />,
    success: <FaCheck className="text-4xl text-success" />,
    error: <FaTimes className="text-4xl text-error" />,
    info: <FaInfoCircle className="text-4xl text-info" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-base-300/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-base-100 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="p-6">
          {/* Icon & Title */}
          <div className="flex flex-col items-center mb-6">
            {icons[type]}
            <h3 className="mt-4 text-2xl font-bold text-center">{title}</h3>
          </div>

          {/* Message */}
          <p className="text-center text-base-content/70 mb-8">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <button onClick={onClose} className="btn btn-ghost rounded-xl px-6">
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`btn rounded-xl px-6 ${
                type === "warning"
                  ? "btn-warning"
                  : type === "success"
                  ? "btn-success"
                  : type === "error"
                  ? "btn-error"
                  : "btn-primary"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
