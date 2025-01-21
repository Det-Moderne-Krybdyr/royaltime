import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ year: string; week: string }> } // Adjusted type for async params
) {
  try {
    // Await `params` because it is asynchronous
    const { year, week } = await context.params;

    // Validate year and week parameters
    if (!year || isNaN(Number(year)) || !week || isNaN(Number(week))) {
      return NextResponse.json(
        { error: "Invalid year or week parameter" },
        { status: 400 }
      );
    }

    // Fetch week data by year and week number
    const weekData = await prisma.week.findUnique({
      where: {
        weekNumber_year: {
          weekNumber: parseInt(week, 10),
          year: parseInt(year, 10),
        },
      },
      include: {
        days: {
          include: {
            shifts: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                jobType: {
                  select: {
                    id: true,
                    name: true,
                    color: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Handle case when week is not found
    if (!weekData) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }

    return NextResponse.json(weekData);
  } catch (error) {
    console.error("Error fetching week data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
