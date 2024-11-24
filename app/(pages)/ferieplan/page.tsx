"use client";

import React, { useEffect, useState } from "react";
import { Week } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

const HolidayPlan = () => {
  const { data: session, status } = useSession();
  const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(47); // Default to week 47
  const [holidayRequest, setHolidayRequest] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Fetch week data based on the current week index
  const fetchWeekData = async (weekNumber: number) => {
    try {
      const response = await fetch(`/api/schedule/${weekNumber}`);
      if (!response.ok) throw new Error("Failed to fetch week data");
      const data: Week = await response.json();

      // Filter for only "day-off" and "holiday-leave" shifts
      const filteredDays = data.days.map((day) => ({
        ...day,
        shifts: day.shifts.filter(
          (shift) => shift.type === "day-off"
        ),
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

  const submitHolidayRequest = async () => {
    if (!holidayRequest.startDate || !holidayRequest.endDate) {
      alert("Please fill in both start and end dates.");
      return;
    }
  
    const startDate = new Date(holidayRequest.startDate);
    const endDate = new Date(holidayRequest.endDate);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Invalid date format.");
      return;
    }
  
    try {
      const response = await fetch("/api/ferieplan/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...holidayRequest,
          email: session?.user?.email, // Use email from the session
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit holiday request");
      }
  
      alert("Holiday request submitted successfully!");
      setHolidayRequest({ startDate: "", endDate: "", reason: "" });
    } catch (error) {
      console.error("Error submitting holiday request:", error);
    }
  };

  // Fetch week data whenever the currentWeekIndex changes
  useEffect(() => {
    fetchWeekData(currentWeekIndex);
  }, [currentWeekIndex]);

  // Early returns for loading and unauthenticated states
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please log in.</div>;

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

      {/* Holiday Request Form */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-bold mb-2">Søg om Ferie</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start dato</Label>
            <Input
              type="date"
              id="startDate"
              value={holidayRequest.startDate}
              onChange={(e) =>
                setHolidayRequest({ ...holidayRequest, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="endDate">Slut dato</Label>
            <Input
              type="date"
              id="endDate"
              value={holidayRequest.endDate}
              onChange={(e) =>
                setHolidayRequest({ ...holidayRequest, endDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="reason">Årsag (valgfri)</Label>
          <Textarea
            id="reason"
            value={holidayRequest.reason}
            onChange={(e) =>
              setHolidayRequest({ ...holidayRequest, reason: e.target.value })
            }
          />
        </div>
        <Button className="mt-4" onClick={submitHolidayRequest}>
          Send anmodning
        </Button>
      </div>

      {/* Display Shifts */}
      <div className="grid grid-cols-7 gap-4">
        {currentWeek.days.map((day) => (
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
                {day.shifts.map((shift) => (
                  <Card
                    key={shift.id}
                    className="p-2 mb-2 rounded cursor-pointer shadow bg-gray-300"
                  >
                    <CardContent className="text-center">
                      <p className="font-semibold">{shift.user.name}</p>
                      <p className="text-sm italic">
                        {shift.type === "day-off" ? "Day Off" : "Holiday Leave"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HolidayPlan;
