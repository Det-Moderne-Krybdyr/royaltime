"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Shift, HolidayRequest } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const AccountPage = () => {
  const { data: session, status } = useSession();
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [pastShifts, setPastShifts] = useState<Shift[]>([]);
  const [ferieplan, setFerieplan] = useState<HolidayRequest[]>([]);

  // Fetch user shifts
  const fetchUserShifts = useCallback(async () => {
    try {
      if (!session?.user?.email) {
        throw new Error("User email not available");
      }

      const response = await fetch(`/api/users/${session.user.email}`);
      if (!response.ok) throw new Error("Failed to fetch shifts");

      const user = await response.json();
      const now = new Date();

      setUpcomingShifts(
        user.shifts.filter((shift: Shift) => new Date(shift.startTime) >= now)
      );
      setPastShifts(
        user.shifts.filter((shift: Shift) => new Date(shift.startTime) < now)
      );
    } catch (error) {
      console.error(error);
    }
  }, [session?.user?.email]);

  // Fetch ferieplan
  const fetchFerieplan = useCallback(async () => {
    try {
      if (!session?.user?.email) {
        throw new Error("User email not available");
      }

      const response = await fetch(`/api/ferieplan/user`, {
        method: "GET",
        headers: {
          "x-user-email": session.user.email,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch ferieplan");

      const ferieData = await response.json();
      setFerieplan(ferieData.ferieplan);
    } catch (error) {
      console.error("Error fetching ferieplan:", error);
    }
  }, [session?.user?.email]);

  // Use effect to fetch data on load
  useEffect(() => {
    if (status === "authenticated") {
      fetchUserShifts();
      fetchFerieplan();
    }
  }, [status, fetchUserShifts, fetchFerieplan]);

  if (status === "loading") {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div>
      {/* User Header */}
      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
              {session?.user?.name?.charAt(0)}
            </div>
            <div>
              <CardTitle>{session?.user?.name}</CardTitle>
              <p className="text-sm text-gray-500">Email: {session?.user?.email}</p>
            </div>
          </div>
          <Badge>Stempelkode: 0812</Badge>
        </CardHeader>
      </Card>

      <Separator className="mb-6" />

      {/* Upcoming Shifts */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Dine kommende vagter</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {upcomingShifts.length > 0 ? (
            upcomingShifts.map((shift) => (
              <Card key={shift.id} className="flex-shrink-0 w-56">
                <CardContent className="text-center">
                  <p className="text-lg font-semibold">
                    {new Date(shift.startTime).toLocaleDateString(undefined, {
                      weekday: "long",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(shift.startTime).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "long",
                    })}
                  </p>
                  <p className="text-sm mt-2">
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
                  <Badge variant="outline" className="mt-2">
                    {shift.type}
                  </Badge>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">Ingen kommende vagter.</p>
          )}
        </div>
      </div>

      {/* Ferieplan */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Dine ferieplaner</h2>
        <div className="grid grid-cols-2 gap-4">
          {ferieplan.length > 0 ? (
            ferieplan.map((ferie) => (
              <Card key={ferie.id}>
                <CardContent className="text-center">
                  <p className="text-lg font-semibold">
                    {new Date(ferie.startDate).toLocaleDateString(undefined, {
                      weekday: "long",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(ferie.startDate).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "long",
                    })}{" "}
                    -{" "}
                    {new Date(ferie.endDate).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "long",
                    })}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {ferie.status}
                  </Badge>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">Ingen registrerede ferieplaner.</p>
          )}
        </div>
      </div>

      {/* Past Shifts */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Dine tidligere vagter</h2>
        <div className="grid grid-cols-2 gap-4">
          {pastShifts.length > 0 ? (
            pastShifts.map((shift) => (
              <Card key={shift.id}>
                <CardContent className="text-center">
                  <p className="text-lg font-semibold">
                    {new Date(shift.startTime).toLocaleDateString(undefined, {
                      weekday: "long",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(shift.startTime).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "long",
                    })}
                  </p>
                  <p className="text-sm mt-2">
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
                  <Badge variant="outline" className="mt-2">
                    {shift.type}
                  </Badge>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">Ingen tidligere vagter.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
