"use client";

import React, { useEffect, useState, useCallback } from "react";
import ShiftModal from "./ShiftModal";
import { Week, Shift, User, ShiftType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { getISOWeek } from "date-fns";

const Schedule = () => {
  const { data: session } = useSession();
  const [state, setState] = useState({
    week: getISOWeek(new Date()),
    year: new Date().getFullYear(),
  });
  const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [userRecords, setUserRecords] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [nextWeekAvailable, setNextWeekAvailable] = useState(true);
  const [previousWeekAvailable, setPreviousWeekAvailable] = useState(true);

  // Check user role
  const fetchUserRole = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch("/api/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      if (!response.ok) throw new Error("Failed to fetch user role");

      const data = await response.json();
      setIsAdmin(data.role === "admin");
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  }, [session?.user?.email]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data: User[] = await response.json();
      setUserRecords(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

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
  const fetchWeekData = useCallback(async (weekNumber: number, year: number) => {
    try {
      const response = await fetch(`/api/schedule/${year}/${weekNumber}`);
      if (!response.ok) throw new Error("Failed to fetch week data");

      const data: Week = await response.json();
      setCurrentWeek({
        id: data.id ?? 0,
        weekNumber: data.weekNumber ?? weekNumber,
        days: data.days,
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
  }, []);

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

  // Save shift to API
const saveShift = async (updatedShift: Shift) => {
  try {
    const response = await fetch(`/api/shifts/${updatedShift.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedShift),
    });
    if (!response.ok) throw new Error("Failed to save shift");

    const updatedShiftData = await response.json();

    // Update shifts locally
    const updatedDays = currentWeek?.days.map((day) => ({
      ...day,
      shifts: day.shifts.map((shift) =>
        shift.id === updatedShift.id ? updatedShiftData : shift
      ),
    }));

    if (updatedDays) setCurrentWeek({ ...currentWeek, days: updatedDays });
  } catch (error) {
    console.error("Error saving shift:", error);
  }
};


  // Fetch data on component load
  useEffect(() => {
    fetchUsers();
    fetchUserRole();
  }, [fetchUsers, fetchUserRole]);

  useEffect(() => {
    fetchWeekData(state.week, state.year);
  }, [fetchWeekData, state]);

  if (!currentWeek) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Uge {currentWeek.weekNumber}, {state.year}
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

      <div className="grid grid-cols-7 gap-4">
        {currentWeek.days.map((day) => {
          // Sort shifts by type
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
                      onClick={() => isAdmin && setSelectedShift(shift)} // Only allow editing if user is admin
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
                        <p className="text-sm italic">
                          {shift.break} min pause
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

      {selectedShift && isAdmin && (
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
