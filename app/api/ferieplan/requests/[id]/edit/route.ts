import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing request ID" }, { status: 400 });
    }

    const { startDate, endDate, reason } = await req.json();

    // Validate input
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    // Update the holiday request
    const updatedRequest = await prisma.holidayRequest.update({
      where: { id: parseInt(id, 10) },
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason || null,
        status: "pending", // Reset status to pending after user edits
      },
    });

    return NextResponse.json({
      message: "Holiday request updated successfully",
      updatedRequest,
    });
  } catch (error) {
    console.error("Error editing holiday request:", error);
    return NextResponse.json(
      { error: "Failed to edit holiday request" },
      { status: 500 }
    );
  }
}
