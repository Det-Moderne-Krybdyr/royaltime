import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // Correct type for params
) {
  try {
    // Await `params` because it is asynchronous in the `app` directory
    const { id } = await context.params;
    const shiftId = parseInt(id, 10);

    if (isNaN(shiftId)) {
      return NextResponse.json({ error: "Invalid shift ID" }, { status: 400 });
    }

    const body = await req.json();

    // Update shift in the database
    const updatedShift = await prisma.shift.update({
      where: { id: shiftId },
      data: {
        startTime: body.startTime,
        endTime: body.endTime,
        type: body.type,
        userId: body.user.id,
      },
      include: { user: true },
    });

    return NextResponse.json(updatedShift);
  } catch (error) {
    console.error("Failed to update shift:", error);
    return NextResponse.json(
      { error: "Failed to update shift" },
      { status: 500 }
    );
  }
}
