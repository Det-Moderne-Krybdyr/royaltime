"use client";

import React, { useEffect, useState } from "react";
import { Week } from "@/types"; // Ensure this type is imported and correctly structured
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getISOWeek } from "date-fns";

const HolidayPlan = () => {
  const [state, setState] = useState({
    week: getISOWeek(new Date()),
    year: new Date().getFullYear(),
  });
  const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
  const [nextWeekAvailable, setNextWeekAvailable] = useState(true);
  const [previousWeekAvailable, setPreviousWeekAvailable] = useState(true);

  // Check if a week exists in the database
  const checkWeekExists = async (week: number, year: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/schedule/${year}/${week}`);
      return response.ok; // Return true if the week exists
    } catch (error) {
      console.error("Error checking week availability:", error);
      return false;
    }
  };

  // Fetch week data
  const fetchWeekData = async (weekNumber: number, year: number) => {
    try {
      const response = await fetch(`/api/schedule/${year}/${weekNumber}`);
      if (!response.ok) throw new Error("Failed to fetch week data");

      const data: Week = await response.json();
      setCurrentWeek({
        id: data.id ?? 0,
        weekNumber: data.weekNumber ?? weekNumber,
        days: data.days.map((day) => ({
          ...day,
          shifts: day.shifts.filter((shift) => shift.type === "day-off"),
        })),
      });

      // Check availability of next/previous weeks
      const nextWeek = weekNumber === 52 ? 1 : weekNumber + 1;
      const nextYear = weekNumber === 52 ? year + 1 : year;
      const prevWeek = weekNumber === 1 ? 52 : weekNumber - 1;
      const prevYear = weekNumber === 1 ? year - 1 : year;

      setNextWeekAvailable(await checkWeekExists(nextWeek, nextYear));
      setPreviousWeekAvailable(await checkWeekExists(prevWeek, prevYear));
    } catch (error) {
      console.error("Error fetching week data:", error);
      setCurrentWeek(null);
    }
  };

  // Pagination handlers
  const handlePreviousWeek = async () => {
    const prevWeek = state.week === 1 ? 52 : state.week - 1;
    const prevYear = state.week === 1 ? state.year - 1 : state.year;

    if (await checkWeekExists(prevWeek, prevYear)) {
      setState({ week: prevWeek, year: prevYear });
    }
  };

  const handleNextWeek = async () => {
    const nextWeek = state.week === 52 ? 1 : state.week + 1;
    const nextYear = state.week === 52 ? state.year + 1 : state.year;

    if (await checkWeekExists(nextWeek, nextYear)) {
      setState({ week: nextWeek, year: nextYear });
    }
  };

  // Fetch week data whenever the state changes
  useEffect(() => {
    fetchWeekData(state.week, state.year);
  }, [state]);

  if (!currentWeek) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Ferieplan - Uge {currentWeek.weekNumber}, {state.year}
      </h1>

      {/* Pagination Controls */}
      <div className="flex justify-between mb-4">
        <Button
          onClick={handlePreviousWeek}
          variant={previousWeekAvailable ? "default" : "ghost"}
          disabled={!previousWeekAvailable}
        >
          Previous Week
        </Button>
        <Button
          onClick={handleNextWeek}
          variant={nextWeekAvailable ? "default" : "ghost"}
          disabled={!nextWeekAvailable}
        >
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
                          <p className="font-semibold">
                            {shift.user?.name || "Unknown User"}
                          </p>
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
