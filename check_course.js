var {
  PrismaClient
} = require("@prisma/client");
var prisma = new PrismaClient();
async function checkCourse() {
  const course = await prisma.course.findUnique({
    where: {
      id: "course-drum"
    }
  });
  console.log("Course found:", course);
}
checkCourse().catch((e) => console.error(e)).finally(async () => {
  await prisma.$disconnect();
});
