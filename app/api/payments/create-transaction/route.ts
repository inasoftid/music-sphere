import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { snap } from '@/lib/midtrans';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { billId } = body;

    if (!billId) {
      return NextResponse.json(
        { message: 'Bill ID is required' },
        { status: 400 }
      );
    }

    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    });

    if (!bill) {
      return NextResponse.json(
        { message: 'Bill not found' },
        { status: 404 }
      );
    }

    if (bill.status === 'paid') {
      return NextResponse.json(
        { message: 'Bill already paid' },
        { status: 400 }
      );
    }

    // If snap token already exists and bill is still unpaid, return existing token
    if (bill.snapToken) {
      return NextResponse.json({
        token: bill.snapToken,
        orderId: bill.midtransOrderId,
      });
    }

    // Use bill ID directly as order ID for easy reconciliation
    const orderId = bill.id;

    const transactionDetails = {
      transaction_details: {
        order_id: orderId,
        gross_amount: bill.amount,
      },
      customer_details: {
        first_name: bill.user.name,
        email: bill.user.email,
      },
      item_details: [
        {
          id: bill.courseId || 'general',
          price: bill.amount,
          quantity: 1,
          name: bill.course?.title || 'Biaya Kursus Musik',
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/payment/success`,
      },
    };

    const transaction = await snap.createTransaction(transactionDetails);

    // Save snap token and order ID to bill
    await prisma.bill.update({
      where: { id: billId },
      data: {
        snapToken: transaction.token,
        midtransOrderId: orderId,
      },
    });

    return NextResponse.json({
      token: transaction.token,
      orderId,
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { message: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
