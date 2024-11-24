import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ email?: string }> } // Correctly typed as a Promise
) {
  try {
    // Await `params` because it is asynchronous in the app directory
    const { email } = await context.params;

    if (!email) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    // Fetch user details by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        shifts: {
          orderBy: { startTime: "desc" }, // Include shifts sorted by start time
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
