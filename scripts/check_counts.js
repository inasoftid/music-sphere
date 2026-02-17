
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userScheduleCount = await prisma.userSchedule.count();
  const courseScheduleCount = await prisma.courseSchedule.count();
  console.log(`UserSchedule count: ${userScheduleCount}`);
  console.log(`CourseSchedule count: ${courseScheduleCount}`);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
