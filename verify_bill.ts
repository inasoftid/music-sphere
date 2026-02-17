
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const billId = '029C5AB0-AA52-4288-A723-EAA95824E2DE'; 

  const bill = await prisma.bill.findFirst({
    where: {
      id: {
        equals: '029c5ab0-aa52-4288-a723-eaa95824e2de'
      }
    }
  });

  console.log(JSON.stringify(bill, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
