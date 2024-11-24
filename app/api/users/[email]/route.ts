import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { email?: string } }) {
  // Ensure `params.email` is awaited and safely accessed
  const { email } = await params;

  if (!email) {
    return NextResponse.json(
      { error: "User email is required" },
      { status: 400 }
    );
  }

  try {
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
