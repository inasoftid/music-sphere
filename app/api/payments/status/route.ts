import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { snap } from '@/lib/midtrans';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const billId = searchParams.get('billId');

  if (!billId) {
    return NextResponse.json(
      { message: 'Bill ID is required' },
      { status: 400 }
    );
  }

  try {
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: {
        course: { select: { title: true } },
      },
    });

    if (!bill) {
      return NextResponse.json(
        { message: 'Bill not found' },
        { status: 404 }
      );
    }

    // If bill is already paid, return immediately
    if (bill.status === 'paid') {
      return NextResponse.json({
        status: 'paid',
        paymentMethod: bill.paymentMethod,
        paymentDate: bill.paymentDate,
      });
    }

    // If there's a midtrans order ID, check status with Midtrans
    if (bill.midtransOrderId) {
      try {
        const midtransStatus = await snap.transaction.status(bill.midtransOrderId);

        if (
          midtransStatus.transaction_status === 'settlement' ||
          (midtransStatus.transaction_status === 'capture' && midtransStatus.fraud_status === 'accept')
        ) {
          // Update bill as paid
          await prisma.bill.update({
            where: { id: billId },
            data: {
              status: 'paid',
              paymentDate: new Date(),
              paymentMethod: midtransStatus.payment_type,
              midtransTransactionId: midtransStatus.transaction_id,
            },
          });

          // Update enrollment status
          await prisma.enrollment.updateMany({
            where: {
              userId: bill.userId,
              courseId: bill.courseId || undefined,
              status: 'pending_payment',
            },
            data: { status: 'active' },
          });

          return NextResponse.json({
            status: 'paid',
            paymentMethod: midtransStatus.payment_type,
            paymentDate: new Date(),
          });
        }

        if (['cancel', 'deny', 'expire'].includes(midtransStatus.transaction_status)) {
          // Clear snap token for retry
          await prisma.bill.update({
            where: { id: billId },
            data: {
              snapToken: null,
              midtransOrderId: null,
            },
          });

          return NextResponse.json({
            status: 'expired',
            message: 'Transaksi sudah expired. Silakan buat pembayaran baru.',
          });
        }

        return NextResponse.json({
          status: 'pending',
          transactionStatus: midtransStatus.transaction_status,
        });
      } catch {
        // Midtrans API error - return current DB status
        return NextResponse.json({ status: bill.status });
      }
    }

    return NextResponse.json({ status: bill.status });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
