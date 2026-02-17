import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Verify Midtrans signature
function verifySignature(orderId: string, statusCode: string, grossAmount: string, serverKey: string, signatureKey: string): boolean {
  const payload = orderId + statusCode + grossAmount + serverKey;
  const hash = crypto.createHash('sha512').update(payload).digest('hex');
  return hash === signatureKey;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_id,
    } = body;

    // Verify signature from Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const isValid = verifySignature(order_id, status_code, gross_amount, serverKey, signature_key);

    if (!isValid) {
      console.error('Invalid Midtrans signature');
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 403 }
      );
    }

    // Find bill by midtrans order ID
    const bill = await prisma.bill.findUnique({
      where: { midtransOrderId: order_id },
    });

    if (!bill) {
      console.error('Bill not found for order:', order_id);
      return NextResponse.json(
        { message: 'Bill not found' },
        { status: 404 }
      );
    }

    // Determine payment status based on Midtrans transaction_status
    let billStatus = bill.status;
    let paymentDate: Date | null = null;

    if (transaction_status === 'capture') {
      // For credit card: check fraud_status
      if (fraud_status === 'accept') {
        billStatus = 'paid';
        paymentDate = new Date();
      }
    } else if (transaction_status === 'settlement') {
      billStatus = 'paid';
      paymentDate = new Date();
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      billStatus = 'unpaid';
      // Clear snap token so user can create new transaction
    } else if (transaction_status === 'pending') {
      billStatus = 'unpaid';
    }

    // Update bill
    await prisma.bill.update({
      where: { id: bill.id },
      data: {
        status: billStatus,
        paymentDate,
        paymentMethod: payment_type,
        midtransTransactionId: transaction_id,
        // Clear snap token if payment failed/expired so new one can be generated
        ...((['cancel', 'deny', 'expire'].includes(transaction_status)) && {
          snapToken: null,
          midtransOrderId: null,
        }),
      },
    });

    // If paid, also update enrollment status to active
    if (billStatus === 'paid') {
      await prisma.enrollment.updateMany({
        where: {
          userId: bill.userId,
          courseId: bill.courseId || undefined,
          status: 'pending_payment',
        },
        data: {
          status: 'active',
        },
      });
    }

    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    console.error('Notification handler error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
