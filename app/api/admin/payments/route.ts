import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: { title: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    const formattedBills = bills.map((bill) => ({
      id: bill.id,
      studentName: bill.user.name,
      studentEmail: bill.user.email,
      courseTitle: bill.course?.title || 'Unknown Course',
      type: bill.type,
      amount: bill.amount,
      lateFee: bill.lateFee,
      month: bill.month,
      dueDate: bill.dueDate.toISOString().split('T')[0],
      status: bill.status,
      paymentDate: bill.paymentDate?.toISOString().split('T')[0] || null,
      date: bill.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json(formattedBills);
  } catch (error) {
    console.error('Error fetching admin payments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
