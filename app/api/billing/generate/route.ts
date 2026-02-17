import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Generate tagihan bulanan (dipanggil setiap tanggal 1 atau manual oleh admin)
export async function POST() {
  try {
    const now = new Date();
    const currentMonth = now.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    // Cari semua enrollment aktif
    const activeEnrollments = await prisma.enrollment.findMany({
      where: {
        status: 'active',
      },
      include: {
        course: true,
        user: { select: { id: true, name: true } },
      },
    });

    let billsCreated = 0;

    for (const enrollment of activeEnrollments) {
      // Logic baru: Jika siswa mendaftar di bulan ini, jangan buat tagihan bulanan
      // Tagihan bulanan baru akan dibuat bulan depan
      const enrollmentDate = new Date(enrollment.enrolledAt);
      if (
        enrollmentDate.getMonth() === now.getMonth() &&
        enrollmentDate.getFullYear() === now.getFullYear()
      ) {
        continue;
      }

      // Cek apakah sudah ada tagihan untuk bulan ini
      const existingBill = await prisma.bill.findFirst({
        where: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          type: 'monthly',
          month: currentMonth,
        },
      });

      if (existingBill) {
        continue; // Tagihan sudah ada, skip
      }

      // Buat tagihan bulanan Rp 350.000
      // Jatuh tempo tanggal 10 bulan ini
      const dueDate = new Date(now.getFullYear(), now.getMonth(), 10);

      await prisma.bill.create({
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          type: 'monthly',
          amount: enrollment.course.monthlyFee,
          lateFee: 0,
          month: currentMonth,
          dueDate,
          status: 'unpaid',
        },
      });

      billsCreated++;
    }

    return NextResponse.json({
      message: `Berhasil membuat ${billsCreated} tagihan bulanan untuk ${currentMonth}`,
      billsCreated,
      month: currentMonth,
    });
  } catch (error) {
    console.error('Error generating monthly bills:', error);
    return NextResponse.json(
      { message: 'Gagal membuat tagihan bulanan' },
      { status: 500 }
    );
  }
}
