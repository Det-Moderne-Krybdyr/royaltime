import React, { useState } from "react";
import { Shift } from "@/types";

interface ShiftEditModalProps {
  shift: Shift;
  onClose: () => void;
  onSave: (updatedShift: Shift) => void;
}

const ShiftEditModal: React.FC<ShiftEditModalProps> = ({ shift, onClose, onSave }) => {
  const [startTime, setStartTime] = useState(shift.startTime);
  const [endTime, setEndTime] = useState(shift.endTime);
  const [breakTime, setBreakTime] = useState(shift.break || 0);

  const handleSave = () => {
    onSave({ ...shift, startTime, endTime, break: breakTime });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Shift</h2>
        <label className="block mb-2">
          Start tid:
          <input
            type="datetime-local"
            value={new Date(startTime).toISOString().slice(0, 16)}
            onChange={(e) => setStartTime(new Date(e.target.value).toISOString())}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </label>
        <label className="block mb-4">
          Slut tid:
          <input
            type="datetime-local"
            value={new Date(endTime).toISOString().slice(0, 16)}
            onChange={(e) => setEndTime(new Date(e.target.value).toISOString())}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </label>
        <label className="block mb-4">
          Pause (minutter):
          <input
            type="number"
            value={breakTime}
            onChange={(e) => setBreakTime(parseInt(e.target.value, 10))}
            className="border border-gray-300 rounded p-2 w-full"
            min={0}
          />
        </label>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Tilbage
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Gem
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftEditModal;
