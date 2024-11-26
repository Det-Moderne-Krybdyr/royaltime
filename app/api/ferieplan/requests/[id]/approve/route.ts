import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ShiftType } from "@/types"; // Importing the centralized enum

// Helper functions for start and end of the day
const startOfDay = (date: string) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const endOfDay = (date: string) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
};

// PUT method
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, reason, shiftAction, startDate, endDate, userId } = body;

    // Validate shiftAction using the local ShiftType enum
    if (!Object.values(ShiftType).includes(shiftAction)) {
      return NextResponse.json(
        { error: "Invalid shift action" },
        { status: 400 }
      );
    }

    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    // Update the holiday request
    const updatedRequest = await prisma.holidayRequest.update({
      where: { id: parseInt(id, 10) },
      data: {
        status,
        reason: reason || null,
      },
    });

    // Update the shifts associated with the holiday request
    const updatedShifts = await prisma.shift.updateMany({
      where: {
        userId,
        day: {
          date: {
            gte: start,
            lte: end,
          },
        },
      },
      data: {
        type: shiftAction, // Using the ShiftType enum value
        status: "updated",
      },
    });

    return NextResponse.json({
      message: "Holiday request and shifts updated successfully",
      updatedRequest,
      updatedShifts,
    });
  } catch (error) {
    console.error("Error updating holiday request and shifts:", error);
    return NextResponse.json(
      { error: "Failed to update holiday request and shifts" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // Correctly typed as Promise
) {
  try {
    // Await params as required in the app directory
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const holidayRequest = await prisma.holidayRequest.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!holidayRequest) {
      return NextResponse.json(
        { error: "Holiday request not found" },
        { status: 404 }
      );
    }

    // Delete the holiday request
    await prisma.holidayRequest.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: "Holiday request deleted successfully" });
  } catch (error) {
    console.error("Error deleting holiday request:", error);
    return NextResponse.json(
      { error: "Failed to delete holiday request" },
      { status: 500 }
    );
  }
}
