const DeleteModal = ({ isOpen, onClose, onConfirm, projectName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Delete Project
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{projectName}</span>?
          <br />
          This will also delete the PDF.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;