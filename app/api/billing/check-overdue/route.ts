import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LATE_FEE = 5000; // Denda keterlambatan Rp 5.000

// POST - Cek dan update tagihan yang sudah jatuh tempo
export async function POST() {
  try {
    const now = new Date();

    // Cari semua bill unpaid yang sudah melewati jatuh tempo
    const overdueBills = await prisma.bill.findMany({
      where: {
        status: 'unpaid',
        dueDate: {
          lt: now,
        },
        lateFee: 0, // Belum dikenakan denda
      },
    });

    let updatedCount = 0;

    for (const bill of overdueBills) {
      await prisma.bill.update({
        where: { id: bill.id },
        data: {
          status: 'overdue',
          lateFee: LATE_FEE,
          amount: bill.amount + LATE_FEE,
        },
      });
      updatedCount++;
    }

    // Update juga bill yang sudah overdue tapi belum punya denda (edge case)
    const overdueWithoutFee = await prisma.bill.findMany({
      where: {
        status: 'overdue',
        lateFee: 0,
      },
    });

    for (const bill of overdueWithoutFee) {
      await prisma.bill.update({
        where: { id: bill.id },
        data: {
          lateFee: LATE_FEE,
          amount: bill.amount + LATE_FEE,
        },
      });
      updatedCount++;
    }

    return NextResponse.json({
      message: `${updatedCount} tagihan diperbarui menjadi overdue dengan denda Rp ${LATE_FEE.toLocaleString('id-ID')}`,
      updatedCount,
    });
  } catch (error) {
    console.error('Error checking overdue bills:', error);
    return NextResponse.json(
      { message: 'Gagal memeriksa tagihan jatuh tempo' },
      { status: 500 }
    );
  }
}
