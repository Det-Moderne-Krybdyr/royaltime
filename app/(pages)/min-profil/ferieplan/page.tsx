"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import HolidayRequestEditModal from "./HolidayRequestEditModal";
import { HolidayRequest } from "@/types";

const FerieplanPage = () => {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<HolidayRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HolidayRequest | null>(
    null
  );
  const [newRequest, setNewRequest] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Fetch user's holiday requests
  const fetchRequests = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);

      const response = await fetch("/api/ferieplan/user", {
        headers: { "x-user-email": session.user.email },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch requests");
      }

      const data = await response.json();
      setRequests(data.ferieplan || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  // Save updated holiday request
  const saveHolidayRequest = async (updatedRequest: HolidayRequest) => {
    try {
      const response = await fetch(`/api/ferieplan/requests/${updatedRequest.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: updatedRequest.startDate,
          endDate: updatedRequest.endDate,
          reason: updatedRequest.reason,
          status: "pending", // Default status
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update holiday request");
      }

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === updatedRequest.id ? { ...req, ...updatedRequest } : req
        )
      );

      setSelectedRequest(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update holiday request");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  // Delete holiday request
  const deleteHolidayRequest = async (requestId: number) => {
    try {
      const response = await fetch(`/api/ferieplan/requests/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete holiday request");
      }

      alert("Holiday request deleted successfully!");
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      setSelectedRequest(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to delete holiday request");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  // Submit new holiday request
  const submitHolidayRequest = async () => {
    if (!newRequest.startDate || !newRequest.endDate) {
      alert("Please fill in both start and end dates.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/ferieplan/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRequest,
          email: session?.user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit holiday request");
      }

      alert("Holiday request submitted successfully!");
      setNewRequest({ startDate: "", endDate: "", reason: "" });
      fetchRequests();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to submit holiday request");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading your holiday requests...</p>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ferieplan</h1>

      {error && (
        <div className="text-red-500 bg-red-100 p-2 rounded mb-4">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="text-sm underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Holiday Request Form */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-bold mb-2">Request a New Holiday</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              value={newRequest.startDate}
              onChange={(e) =>
                setNewRequest({ ...newRequest, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="date"
              id="endDate"
              value={newRequest.endDate}
              onChange={(e) =>
                setNewRequest({ ...newRequest, endDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="reason">Reason (Optional)</Label>
          <Textarea
            id="reason"
            value={newRequest.reason}
            onChange={(e) =>
              setNewRequest({ ...newRequest, reason: e.target.value })
            }
          />
        </div>
        <Button className="mt-4" onClick={submitHolidayRequest} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>

      {/* Display User's Holiday Requests */}
      <h2 className="text-lg font-bold mb-4">Your Holiday Requests</h2>
      {requests.length === 0 ? (
        <p>No holiday requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border p-4 rounded-md bg-gray-50">
              <p>
                <strong>Start:</strong>{" "}
                {new Date(request.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {new Date(request.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {request.status}
              </p>
              {request.reason && (
                <p>
                  <strong>Reason:</strong> {request.reason}
                </p>
              )}
              {request.status === "pending" && (
                <Button className="mt-2" onClick={() => setSelectedRequest(request)}>
                  Edit
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Holiday Request Edit Modal */}
      {selectedRequest && (
        <HolidayRequestEditModal
          holidayRequest={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSave={saveHolidayRequest}
          onDelete={deleteHolidayRequest}
        />
      )}
    </div>
  );
};

export default FerieplanPage;
