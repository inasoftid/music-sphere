
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const courses = await prisma.course.findMany({
        include: {
            _count: {
                select: { enrollments: true }
            },
            mentor: {
                select: { id: true, name: true, expertise: true }
            }
        }
    });
    console.log('Courses found:', courses.length);
    if (courses.length > 0) {
        console.log(JSON.stringify(courses[0], null, 2));
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
