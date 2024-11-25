"use client";

import React, { useEffect, useState } from "react";
import { Week } from "@/types"; // Ensure this type is imported and correctly structured
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const HolidayPlan = () => {
  const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(47); // Default to week 47

  // Fetch week data based on the current week index
  const fetchWeekData = async (weekNumber: number) => {
    try {
      const response = await fetch(`/api/schedule/${weekNumber}`);
      if (!response.ok) throw new Error("Failed to fetch week data");
      const data: Week = await response.json();

      // Filter for only "day-off" shifts
      const filteredDays = data.days.map((day) => ({
        ...day,
        shifts: day.shifts.filter((shift) => shift.type === "day-off"), // Adjust filtering logic
      }));

      setCurrentWeek({
        id: data.id ?? 0,
        weekNumber: data.weekNumber ?? weekNumber,
        days: filteredDays,
      });
    } catch (error) {
      console.error("Error fetching week data:", error);
      setCurrentWeek(null);
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

  // Fetch week data whenever the currentWeekIndex changes
  useEffect(() => {
    fetchWeekData(currentWeekIndex);
  }, [currentWeekIndex]);

  if (!currentWeek) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ferieplan - Uge {currentWeek.weekNumber}</h1>

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

      {/* Display Shifts */}
      <div className="grid grid-cols-7 gap-4">
        {currentWeek.days.length > 0 ? (
          currentWeek.days.map((day) => (
            <Card key={day.id} className="bg-white">
              <CardHeader>
                <CardTitle>{day.name}</CardTitle>
                <p className="text-sm text-gray-500">
                  {new Date(day.date).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <Separator className="my-2" />
                <div className="mt-2">
                  {day.shifts.length > 0 ? (
                    day.shifts.map((shift) => (
                      <Card
                        key={shift.id}
                        className="p-2 mb-2 rounded cursor-pointer shadow bg-gray-300"
                      >
                        <CardContent className="text-center">
                          <p className="font-semibold">{shift.user?.name || "Unknown User"}</p>
                          <p className="text-sm italic">Day Off</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500">No shifts for this day.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No days available in this week.</p>
        )}
      </div>
    </div>
  );
};

export default HolidayPlan;
