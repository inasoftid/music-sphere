import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Try to select the verificationCode field
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        verificationCode: true, 
      }
    });
    console.log('Schema verification success: verificationCode field exists.');
  } catch (error) {
    console.error('Schema verification failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
