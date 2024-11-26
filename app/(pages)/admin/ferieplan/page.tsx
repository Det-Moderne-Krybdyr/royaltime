"use client";

import React, { useEffect, useState } from "react";
import { HolidayRequest, ShiftType } from "@/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const HolidayAdmin = () => {
  const [holidayRequests, setHolidayRequests] = useState<HolidayRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<HolidayRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [shiftActions, setShiftActions] = useState<string[]>([]);
  const [shiftAction, setShiftAction] = useState<ShiftType>(ShiftType.AT_WORK);

  // Fetch holiday requests
  const fetchHolidayRequests = async () => {
    try {
      const response = await fetch("/api/ferieplan/requests");
      if (!response.ok) throw new Error("Failed to fetch holiday requests");
      const data: HolidayRequest[] = await response.json();
      setHolidayRequests(data);
    } catch (error) {
      console.error("Error fetching holiday requests:", error);
    }
  };

  // Fetch shift actions from ShiftType enum
  const fetchShiftActions = () => {
    const actions = Object.values(ShiftType);
    setShiftActions(actions);
  };

  // Update holiday request and shifts
  const updateHolidayRequest = async (request: HolidayRequest) => {
    try {
      const response = await fetch(`/api/ferieplan/requests/${request.id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: request.status,
          reason: request.reason,
          shiftAction,
          startDate: request.startDate,
          endDate: request.endDate,
          userId: request.user.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to update holiday request");

      alert("Holiday request updated successfully!");
      fetchHolidayRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error updating holiday request:", error);
    }
  };

  // Delete holiday request
  const deleteHolidayRequest = async (id: number) => {
    try {
      const response = await fetch(`/api/ferieplan/requests/${id}/approve`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete holiday request");

      alert("Holiday request deleted successfully!");
      fetchHolidayRequests();
    } catch (error) {
      console.error("Error deleting holiday request:", error);
    }
  };

  useEffect(() => {
    fetchHolidayRequests();
    fetchShiftActions();
  }, []);

  // Filter holiday requests based on status
  const filteredRequests =
    filterStatus === "all"
      ? holidayRequests
      : holidayRequests.filter((request) => request.status === filterStatus);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Ferieplan</h1>

      {/* Filter Controls */}
      <div className="mb-4 flex gap-4">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <Button
            key={status}
            onClick={() => setFilterStatus(status)}
            variant={filterStatus === status ? "default" : "outline"}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Holiday Requests Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.user.name}</TableCell>
              <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
              <TableCell>{request.reason || "N/A"}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => setSelectedRequest(request)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => deleteHolidayRequest(request.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Edit Holiday Request</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={selectedRequest.status}
                    onChange={(e) =>
                      setSelectedRequest({
                        ...selectedRequest,
                        status: e.target.value as HolidayRequest["status"],
                      })
                    }
                    className="border rounded p-2 w-full"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="shiftAction">Shift Action</Label>
                  <select
                    id="shiftAction"
                    value={shiftAction}
                    onChange={(e) => setShiftAction(e.target.value as ShiftType)}
                    className="border rounded p-2 w-full"
                  >
                    {shiftActions.map((action) => (
                      <option key={action} value={action}>
                        {action.replace("-", " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={selectedRequest.reason || ""}
                    onChange={(e) =>
                      setSelectedRequest({ ...selectedRequest, reason: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => updateHolidayRequest(selectedRequest)} className="w-full">
                    Save
                  </Button>
                  <Button variant="ghost" onClick={() => setSelectedRequest(null)} className="w-full">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HolidayAdmin;
