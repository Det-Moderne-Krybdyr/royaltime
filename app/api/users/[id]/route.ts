import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure this points to your Prisma client setup

// GET: Fetch a user by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // Correctly typed as a Promise
) {
  const { id } = await context.params; // Await `params`
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

// PUT: Update a user by ID
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } // Correctly typed as a Promise
) {
  const { id } = await context.params; // Extract `id` from context.params
  try {
    const {
      name,
      email,
      phone,
      employment_date,
      primary_position,
      secoundary_position,
      prio_list,
      salary_number,
      hourly_wage,
      sick_hourly_wage,
      role,
    } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        employment_date: employment_date
          ? new Date(employment_date)
          : undefined,
        primary_position,
        secoundary_position,
        prio_list,
        salary_number,
        hourly_wage,
        sick_hourly_wage,
        role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a user by ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // Correctly typed as a Promise
) {
  const { id } = await context.params; // Await `params`
  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
