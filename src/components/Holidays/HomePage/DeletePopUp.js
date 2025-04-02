import React from "react";

export default function DeletePopup({ isVisible, onClose, onDelete, holidayName }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
      <div className="bg-[#F2F2F2] p-6 rounded-lg shadow-lg w-1/3">
        <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this holiday?</h3>
        <p className="mb-4"><strong>{holidayName}</strong></p>
        <div className="flex gap-4 justify-center">
          <button
            className="bg-[#73DAFF] px-6 py-2 rounded-md"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            <strong>
            Yes
            </strong>
          </button>
          <button
            className="bg-[#73DAFF] px-6 py-2 rounded-md"
            onClick={onClose}
          >
           <strong>
            No
            </strong>
          </button>
        </div>
      </div>
    </div>
  );
}
