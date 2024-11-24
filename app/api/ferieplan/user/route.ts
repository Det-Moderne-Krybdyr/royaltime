import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client

export async function GET(req: NextRequest) {
  try {
    // Get the user's email from the query parameters or headers
    const email = req.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    // Find the user by email and include their holiday requests
    const user = await prisma.user.findUnique({
      where: { email },
      include: { holidayRequests: true }, // Adjust if your relation is named differently
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the holiday requests
    return NextResponse.json({ ferieplan: user.holidayRequests });
  } catch (error) {
    console.error("Error fetching ferieplan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
