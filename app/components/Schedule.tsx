"use client";

import React, { useEffect, useState } from "react";
import ShiftModal from "./ShiftModal";
import { Week, Shift, User, ShiftType } from "@/types"; // Import ShiftType
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(47); // Default to week 47
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [userRecords, setUserRecords] = useState<User[]>([]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data: User[] = await response.json();
      setUserRecords(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch week data based on the current week index
  const fetchWeekData = async (weekNumber: number) => {
    try {
      const response = await fetch(`/api/schedule/${weekNumber}`);
      if (!response.ok) throw new Error("Failed to fetch week data");
      const data: Week = await response.json();

      setCurrentWeek({
        id: data.id ?? 0,
        weekNumber: data.weekNumber ?? weekNumber, // Fallback to current week index
        days: data.days,
      });
    } catch (error) {
      console.error("Error fetching week data:", error);
      setCurrentWeek(null); // Clear current week on failure
    }
  };

  // Handle pagination (Previous/Next week)
  const handlePreviousWeek = () => {
    if (currentWeekIndex > 1) {
      const newWeekIndex = currentWeekIndex - 1;
      setCurrentWeekIndex(newWeekIndex);
      fetchWeekData(newWeekIndex);
    }
  };

  const handleNextWeek = () => {
    const newWeekIndex = currentWeekIndex + 1;
    setCurrentWeekIndex(newWeekIndex);
    fetchWeekData(newWeekIndex);
  };

  // Save shift to API
  const saveShift = async (updatedShift: Shift) => {
    try {
      const response = await fetch(`/api/shifts/${updatedShift.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedShift),
      });
      if (!response.ok) throw new Error("Failed to save shift");

      // Update shifts locally
      const updatedDays = currentWeek?.days.map((day) => ({
        ...day,
        shifts: day.shifts.map((shift) =>
          shift.id === updatedShift.id ? updatedShift : shift
        ),
      }));

      if (updatedDays) setCurrentWeek({ ...currentWeek, days: updatedDays });
    } catch (error) {
      console.error("Error saving shift:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWeekData(currentWeekIndex);
  }, []);

  if (!currentWeek) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Uge {currentWeek.weekNumber}</h1>

      {/* Pagination Controls */}
      <div className="flex justify-between mb-4">
        <Button
          onClick={handlePreviousWeek}
          variant={currentWeekIndex === 1 ? "ghost" : "default"}
          disabled={currentWeekIndex === 1}
        >
          Previous Week
        </Button>
        <Button onClick={handleNextWeek} variant="default">
          Next Week
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {currentWeek.days.map((day) => {
          // Sort shifts by type using ShiftType enum
          const order = {
            [ShiftType.AT_WORK]: 1,
            [ShiftType.SICK_LEAVE]: 2,
            [ShiftType.DAY_OFF]: 3,
          };
          const sortedShifts = [...day.shifts].sort((a, b) => order[a.type] - order[b.type]);

          const absentees = sortedShifts.filter(
            (shift) => shift.type === ShiftType.SICK_LEAVE || shift.type === ShiftType.DAY_OFF
          ).length;

          return (
            <Card key={day.id} className="bg-white">
              <CardHeader>
                <CardTitle>{day.name}</CardTitle>
                <p className="text-sm text-gray-500">
                  {new Date(day.date).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <Separator className="my-2" />
                <Badge variant="destructive" className="mb-2">
                  {absentees} Absent
                </Badge>
                <div className="mt-2">
                  {sortedShifts.map((shift) => (
                    <Card
                      key={shift.id}
                      className={`p-2 mb-2 rounded cursor-pointer shadow ${
                        shift.type === ShiftType.SICK_LEAVE
                          ? "bg-yellow-200"
                          : shift.type === ShiftType.DAY_OFF
                          ? "bg-gray-300"
                          : "bg-green-200"
                      }`}
                      onClick={() => setSelectedShift(shift)}
                    >
                      <CardContent className="text-center">
                        <p className="font-semibold">{shift.user.name}</p>
                        {shift.type !== ShiftType.DAY_OFF && (
                          <p className="text-sm">
                            {new Date(shift.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(shift.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                        <p className="text-sm italic">
                          {shift.type === ShiftType.AT_WORK
                            ? "At work"
                            : shift.type === ShiftType.SICK_LEAVE
                            ? "Sick leave"
                            : "Day off"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedShift && (
        <ShiftModal
          shift={selectedShift}
          users={userRecords}
          onClose={() => setSelectedShift(null)}
          onSave={(updatedShift) => {
            saveShift(updatedShift);
            setSelectedShift(null);
          }}
        />
      )}
    </div>
  );
};

export default Schedule;
