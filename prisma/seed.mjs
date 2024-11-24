import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Delete existing data
  await prisma.shift.deleteMany();
  await prisma.day.deleteMany();
  await prisma.week.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  const users = [];
  for (let i = 1; i <= 20; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
    });
  }

  await prisma.user.createMany({ data: users });
  console.log('Users created.');

  const userRecords = await prisma.user.findMany();

  // Helper function to get random user
  const getRandomUser = () =>
    userRecords[Math.floor(Math.random() * userRecords.length)];

  // Helper function to generate random shift type
  const getRandomShiftType = () => {
    const types = ['at-work', 'sick-leave', 'day-off'];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Seed weeks and days
  const weeks = [];
  for (let weekNum = 47; weekNum <= 50; weekNum++) {
    const days = [];
    const dayNames = [
      'Mandag',
      'Tirsdag',
      'Onsdag',
      'Torsdag',
      'Fredag',
      'Lørdag',
      'Søndag',
    ];
    const baseDate = new Date(2024, 10, 18 + (weekNum - 47) * 7); // Start date for weeks

    for (let i = 0; i < 7; i++) {
      const shifts = [];
      for (let j = 0; j < 10; j++) {
        const shiftType = getRandomShiftType();
        const randomUser = getRandomUser();

        shifts.push({
          startTime: new Date(
            baseDate.getFullYear(),
            baseDate.getMonth(),
            baseDate.getDate() + i,
            8 + j,
            0
          ), // Shift times vary slightly
          endTime: new Date(
            baseDate.getFullYear(),
            baseDate.getMonth(),
            baseDate.getDate() + i,
            16 + j,
            0
          ),
          type: shiftType,
          userId: randomUser.id,
        });
      }

      days.push({
        name: dayNames[i % dayNames.length],
        date: new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate() + i
        ),
        absences: Math.floor(Math.random() * 5), // Random absences between 0–5
        shifts: {
          create: shifts,
        },
      });
    }

    weeks.push({
      weekNumber: weekNum,
      days: {
        create: days,
      },
    });
  }

  for (const week of weeks) {
    await prisma.week.create({ data: week });
  }

  console.log('Weeks, days, and shifts seeded.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('Error during seeding:', error);
    prisma.$disconnect();
    process.exit(1);
  });
