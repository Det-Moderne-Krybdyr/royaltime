"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Shift } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ShiftEditModal from "./ShiftEditModal"; // Import the ShiftEditModal

const AccountPage = () => {
  const { data: session, status } = useSession();
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [pastShifts, setPastShifts] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null); // State for editing
  const [isEditing, setIsEditing] = useState(false); // Modal visibility

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

  // Use effect to fetch data on load
  useEffect(() => {
    if (status === "authenticated") {
      fetchUserShifts();
    }
  }, [status, fetchUserShifts]);

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setIsEditing(true);
  };

  const handleSaveShift = async (updatedShift: Shift) => {
    try {
      const response = await fetch(`/api/shifts/${updatedShift.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedShift),
      });

      if (!response.ok) throw new Error("Failed to update shift");

      // Update local state
      const updatedShifts = (shifts: Shift[]) =>
        shifts.map((shift) =>
          shift.id === updatedShift.id ? updatedShift : shift
        );

      setUpcomingShifts(updatedShifts);
      setPastShifts(updatedShifts);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating shift:", error);
    }
  };

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
        </CardHeader>
      </Card>

      <Separator className="mb-6" />

      {/* Shifts */}
      {[
        { title: "Dine kommende vagter", shifts: upcomingShifts },
        { title: "Dine tidligere vagter", shifts: pastShifts },
      ].map(({ title, shifts }) => (
        <div className="mb-6" key={title}>
          <h2 className="text-lg font-bold mb-4">{title}</h2>
          <div className="grid grid-cols-2 gap-4">
            {shifts.length > 0 ? (
              shifts.map((shift) => (
                <Card key={shift.id} onClick={() => handleEditShift(shift)} className="cursor-pointer">
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
                    <Badge variant="outline" className="mt-2">
                      {shift.break} min pause
                    </Badge>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">Ingen vagter.</p>
            )}
          </div>
        </div>
      ))}

      {/* Shift Edit Modal */}
      {isEditing && selectedShift && (
        <ShiftEditModal
          shift={selectedShift}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveShift}
        />
      )}
    </div>
  );
};

export default AccountPage;
