import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const billId = searchParams.get('billId');

  // Fetch single bill by ID
  if (billId) {
    try {
      const bill = await prisma.bill.findUnique({
        where: { id: billId },
        include: {
          course: { select: { title: true } },
          user: { 
            select: { 
              name: true, 
              email: true, 
              profile: { select: { address: true } } 
            } 
          }, 
        },
      });

      if (!bill) {
        return NextResponse.json({ message: 'Bill not found' }, { status: 404 });
      }

      return NextResponse.json({
        id: bill.id,
        courseName: bill.course?.title || 'Biaya Kursus',
        month: bill.month,
        amount: bill.amount,
        status: bill.status,
        dueDate: bill.dueDate.toISOString().split('T')[0],
        paymentDate: bill.paymentDate,
        paymentMethod: bill.paymentMethod,
        studentName: bill.user.name,
        studentEmail: bill.user.email,
        studentAddress: bill.user.profile?.address || '-', 
      });
    } catch (error) {
      console.error('Error fetching bill:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  if (!userId) {
     return NextResponse.json({ message: 'User ID required' }, { status: 400 });
  }

  try {
    const bills = await prisma.bill.findMany({
      where: { userId },
      include: {
        course: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedBills = bills.map((bill: any) => ({
        id: bill.id,
        courseName: bill.course?.title || 'General Tuition',
        month: bill.month,
        amount: bill.amount,
        status: bill.status,
        dueDate: bill.dueDate.toISOString().split('T')[0] // Format YYYY-MM-DD
    }));

    return NextResponse.json(formattedBills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
