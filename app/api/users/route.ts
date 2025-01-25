import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming you have a global Prisma client

// GET: Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST: Add a new user
export async function POST(req: Request) {
  try {
    const { name, email, role } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: { name, email, role },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}
