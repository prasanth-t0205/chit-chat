const DeleteDialog = ({ onClose, onDelete, isPending }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4 animate-scale-up">
        <h3 className="text-lg font-bold mb-4">Delete Message</h3>
        <p className="text-base-content/70 mb-6">
          Are you sure you want to delete this message? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={onDelete}
            disabled={isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
