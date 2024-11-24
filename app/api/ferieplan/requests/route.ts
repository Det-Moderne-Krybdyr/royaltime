import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all holiday requests
export async function GET() {
  try {
    const requests = await prisma.holidayRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("Error fetching holiday requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch holiday requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { startDate, endDate, reason, email } = body;
  
      if (!startDate || !endDate || !email) {
        return NextResponse.json(
          { error: "Start date, end date, and email are required." },
          { status: 400 }
        );
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format for start date or end date." },
          { status: 400 }
        );
      }
  
      if (start > end) {
        return NextResponse.json(
          { error: "Start date cannot be after end date." },
          { status: 400 }
        );
      }
  
      // Fetch the user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        return NextResponse.json(
          { error: "User with this email does not exist." },
          { status: 404 }
        );
      }
  
      // Save the holiday request
      const holidayRequest = await prisma.holidayRequest.create({
        data: {
          startDate: start,
          endDate: end,
          reason: reason || "No reason provided",
          userId: user.id,
        },
      });
  
      return NextResponse.json(holidayRequest, { status: 201 });
    } catch (error) {
      console.error("Error creating holiday request:", error);
      return NextResponse.json(
        { error: "An error occurred while submitting the holiday request." },
        { status: 500 }
      );
    }
  }
  
