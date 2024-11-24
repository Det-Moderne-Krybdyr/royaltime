import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  context: { params: Promise<{ week: string }> } // Correctly typed as Promise
) {
  try {
    // Await `params` as required in the app directory
    const { week } = await context.params;

    // Validate the week parameter
    if (!week || isNaN(Number(week))) {
      return NextResponse.json({ error: 'Invalid week parameter' }, { status: 400 });
    }

    // Fetch week data
    const weekData = await prisma.week.findUnique({
      where: { weekNumber: parseInt(week, 10) }, // Convert `week` to a number
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
              },
            },
          },
        },
      },
    });

    // Handle case when week is not found
    if (!weekData) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 });
    }

    // Return the week data
    return NextResponse.json(weekData);
  } catch (error) {
    console.error('Error fetching week data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
