import React, { useState } from "react";

import { HolidayRequest } from "@/types";

interface HolidayRequestEditModalProps {
  holidayRequest: HolidayRequest;
  onClose: () => void;
  onSave: (updatedRequest: HolidayRequest) => void;
  onDelete: (requestId: number) => void; // Use number for id
}

const HolidayRequestEditModal: React.FC<HolidayRequestEditModalProps> = ({
  holidayRequest,
  onClose,
  onSave,
  onDelete,
}) => {
  const [startDate, setStartDate] = useState(holidayRequest.startDate);
  const [endDate, setEndDate] = useState(holidayRequest.endDate);
  const [reason, setReason] = useState(holidayRequest.reason || "");

  const handleSave = () => {
    onSave({
      ...holidayRequest,
      startDate,
      endDate,
      reason,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Holiday Request</h2>
        <label className="block mb-2">
          Start Date:
          <input
            type="date"
            value={startDate.split("T")[0]} // Convert ISO to YYYY-MM-DD
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          End Date:
          <input
            type="date"
            value={endDate.split("T")[0]} // Convert ISO to YYYY-MM-DD
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </label>
        <label className="block mb-4">
          Reason (optional):
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </label>
        <div className="flex justify-between">
          <button
            onClick={() => onDelete(holidayRequest.id)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
          <div>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayRequestEditModal;
