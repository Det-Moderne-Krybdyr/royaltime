"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Week, Shift, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getISOWeek } from "date-fns";

const Schedule = () => {
  const [state, setState] = useState({
    week: getISOWeek(new Date()),
    year: new Date().getFullYear(),
  });
  const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
  const [userRecords, setUserRecords] = useState<User[]>([]);
  const [filter, setFilter] = useState({ user: "", jobType: "" });
  const [nextWeekAvailable, setNextWeekAvailable] = useState(true);
  const [previousWeekAvailable, setPreviousWeekAvailable] = useState(true);;

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
  const checkWeekExists = async (
    week: number,
    year: number
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/schedule/${year}/${week}`);
      return response.ok;
    } catch (error) {
      console.error("Error checking week availability:", error);
      return false;
    }
  };

  // Fetch week data
  const fetchWeekData = useCallback(
    async (weekNumber: number, year: number) => {
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
    },
    []
  );

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchWeekData(state.week, state.year);
  }, [fetchWeekData, state]);

  // Filter and sort shifts to only show those with type "På arbejde"
  const filterAndSortShifts = (shifts: Shift[]) => {
    return shifts
      .filter((shift) => shift.type === "På arbejde")
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  };

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
        <Button onClick={handlePreviousWeek} disabled={!previousWeekAvailable}>
          Tidligere uge
        </Button>
        <Button onClick={handleNextWeek} disabled={!nextWeekAvailable}>
          Næste uge
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <select
          className="border p-2"
          value={filter.user}
          onChange={(e) => setFilter({ ...filter, user: e.target.value })}
        >
          <option value="">Filter by User</option>
          {userRecords.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <select
          className="border p-2"
          value={filter.jobType}
          onChange={(e) => setFilter({ ...filter, jobType: e.target.value })}
        >
          <option value="">Filter by Job Type</option>
          {currentWeek.days
            .flatMap((day) => day.shifts.map((shift) => shift.jobType.name))
            .filter((name, index, arr) => arr.indexOf(name) === index) // Unique job types
            .map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
        </select>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {currentWeek.days.map((day) => (
          <Card key={day.id}>
            <CardHeader>
              <CardTitle>{day.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {new Date(day.date).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <Separator className="my-2" />
              <div>
                {filterAndSortShifts(day.shifts).map((shift) => (
                  <Card
                    key={shift.id}
                    style={{ backgroundColor: shift.jobType.color }}
                    className="p-2 mb-2 rounded cursor-pointer shadow"
                  >
                    <CardContent className="text-center">
                      <p className="font-semibold">{shift.user.name}</p>
                      <p className="text-sm">
                        {new Date(shift.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - {" "}
                        {new Date(shift.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm italic"> {shift.id}</p>
                      <p className="text-sm italic">{shift.jobType.name}</p>
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

export default Schedule;
