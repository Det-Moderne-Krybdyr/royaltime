import React, { useState } from "react";
import { Shift, User } from "@/types";

interface ShiftModalProps {
  shift: Shift;
  users: User[];
  onClose: () => void;
  onSave: (updatedShift: Shift) => void;
}

const ShiftModal: React.FC<ShiftModalProps> = ({
  shift,
  users,
  onClose,
  onSave,
}) => {
  const [updatedShift, setUpdatedShift] = useState<Shift>(shift);
  const [userSearch, setUserSearch] = useState<string>("");

  const filteredUsers = userSearch
    ? users.filter((user) =>
        user.name.toLowerCase().includes(userSearch.toLowerCase())
      )
    : [];

  const formatTime = (time: string) =>
    new Date(time).toISOString().split("T")[1].substring(0, 5);

  const parseTime = (date: string, time: string) =>
    new Date(`${date}T${time}`).toISOString();

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Rediger vagt</h2>

        {/* User Search Field */}
        <label className="block mb-2">
          Name:
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search user..."
            className="border border-gray-300 rounded p-2 w-full"
          />
          {filteredUsers.length > 0 && (
            <ul className="border border-gray-300 rounded mt-2 max-h-40 overflow-y-auto">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => {
                    setUpdatedShift({ ...updatedShift, user });
                    setUserSearch(user.name);
                  }}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}
        </label>

        {/* Start Time */}
        <label className="block mb-2">
          Start tid:
          <input
            type="time"
            value={formatTime(updatedShift.startTime)}
            onChange={(e) =>
              setUpdatedShift({
                ...updatedShift,
                startTime: parseTime(
                  updatedShift.startTime.split("T")[0],
                  e.target.value
                ),
              })
            }
            className="border border-gray-300 rounded p-2 w-full"
          />
        </label>

        {/* End Time */}
        <label className="block mb-2">
          Slut tid:
          <input
            type="time"
            value={formatTime(updatedShift.endTime)}
            onChange={(e) =>
              setUpdatedShift({
                ...updatedShift,
                endTime: parseTime(
                  updatedShift.endTime.split("T")[0],
                  e.target.value
                ),
              })
            }
            className="border border-gray-300 rounded p-2 w-full"
          />
        </label>

        {/* Break Duration */}
        <label className="block mb-4">
          Pause (minutes):
          <input
            type="number"
            value={updatedShift.break || 0}
            onChange={(e) =>
              setUpdatedShift({
                ...updatedShift,
                break: parseInt(e.target.value),
              })
            }
            className="border border-gray-300 rounded p-2 w-full"
            min="0"
          />
        </label>

        {/* Shift Type */}
        <label className="block mb-4">
          Type:
          <select
            value={updatedShift.type}
            onChange={(e) =>
              setUpdatedShift({
                ...updatedShift,
                type: e.target.value as Shift["type"],
              })
            }
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="at-work">På arbejde</option>
            <option value="sick-leave">Syg</option>
            <option value="day-off">Ferie</option>
          </select>
        </label>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Tilbage
          </button>
          <button
            onClick={() => onSave(updatedShift)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={!updatedShift.user.name}
          >
            Gem
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;
