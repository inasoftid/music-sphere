
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userScheduleCount = await prisma.userSchedule.count();
    const courseScheduleCount = await prisma.courseSchedule.count();
    console.log(`UserSchedule count: ${userScheduleCount}`);
    console.log(`CourseScheduleCount count: ${courseScheduleCount}`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
