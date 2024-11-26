import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.shift.deleteMany();
  await prisma.day.deleteMany();
  await prisma.week.deleteMany();
  await prisma.holidayRequest.deleteMany();
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
  const userRecords = await prisma.user.findMany();

  // Helper function to get random user
  const getRandomUser = (usedUserIds) => {
    const availableUsers = userRecords.filter(
      (user) => !usedUserIds.has(user.id)
    );
    return availableUsers[
      Math.floor(Math.random() * availableUsers.length)
    ];
  };

  // Function to create weeks
  const seedWeeks = async (year, startWeek, endWeek) => {
    for (let weekNum = startWeek; weekNum <= endWeek; weekNum++) {
      const days = [];
      const dayNames = [
        "Mandag",
        "Tirsdag",
        "Onsdag",
        "Torsdag",
        "Fredag",
        "Lørdag",
        "Søndag",
      ];
      const baseDate = new Date(year, 0, 1 + (weekNum - 1) * 7); // Approximate start of the week

      for (let i = 0; i < 7; i++) {
        const shifts = [];
        const isWeekend = i >= 5;
        const usedUserIds = new Set();

        for (let j = 0; j < 5; j++) {
          const randomUser = getRandomUser(usedUserIds);
          if (!randomUser) break; // Stop if no users are left

          const shiftType = isWeekend
            ? "Fridag"
            : Math.random() < 0.1
            ? "Syg"
            : "På arbejde";

          shifts.push({
            startTime:
              shiftType === "På arbejde"
                ? new Date(
                    baseDate.getFullYear(),
                    baseDate.getMonth(),
                    baseDate.getDate() + i,
                    8,
                    0
                  )
                : null,
            endTime:
              shiftType === "På arbejde"
                ? new Date(
                    baseDate.getFullYear(),
                    baseDate.getMonth(),
                    baseDate.getDate() + i,
                    16,
                    0
                  )
                : null,
            type: shiftType,
            status: shiftType === "På arbejde" ? "default" : "updated",
            userId: randomUser.id,
          });

          usedUserIds.add(randomUser.id);
        }

        days.push({
          name: dayNames[i],
          date: new Date(
            baseDate.getFullYear(),
            baseDate.getMonth(),
            baseDate.getDate() + i
          ),
          absences: shifts.filter((shift) => shift.type !== "På arbejde").length,
          shifts: {
            create: shifts,
          },
        });
      }

      await prisma.week.create({
        data: {
          weekNumber: weekNum,
          year: year, // Add year to the week
          days: {
            create: days,
          },
        },
      });
    }
  };

  // Seed weeks for 2024 (47-52)
  await seedWeeks(2024, 47, 52);

  // Seed weeks for 2025 (1-5)
  await seedWeeks(2025, 1, 5);

  console.log("Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error("Error during seeding:", error);
    prisma.$disconnect();
    process.exit(1);
  });
