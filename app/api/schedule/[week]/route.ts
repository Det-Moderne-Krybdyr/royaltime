import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  context: { params: { week: string } }
) {
  const { week } = await context.params; // Await params before accessing its properties

  // Validate the week parameter
  if (!week || isNaN(Number(week))) {
    return NextResponse.json({ error: 'Invalid week parameter' }, { status: 400 });
  }

  // Fetch week data
  const weekData = await prisma.week.findUnique({
    where: { weekNumber: parseInt(week) }, // Ensure `weekNumber` is unique in Prisma schema
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
}
