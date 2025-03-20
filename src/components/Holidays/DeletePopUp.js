import React from "react";

export default function DeletePopup({ isVisible, onClose, onDelete, holidayName }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
      <div className="bg-[#D3E7FF] p-6 rounded-lg shadow-lg w-1/3">
        <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this holiday?</h3>
        <p className="mb-4"><strong>{holidayName}</strong></p>
        <div className="flex gap-4 justify-center">
          <button
            className="bg-[#D3E7FF] px-6 py-2 rounded-md"
            onClick={() => {
              onDelete(holidayName);
              onClose();
            }}
          >
            Yes
          </button>
          <button
            className="bg-[#D3E7FF] px-6 py-2 rounded-md"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
