import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();

    const [
      totalStudents,
      activeCourses,
      totalEnrollments,
      revenueResult,
      unpaidBills,
      overdueBills,
      recentEnrollments,
      upcomingSchedules,
      recentPayments,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'student' } }),
      prisma.course.count(),
      prisma.enrollment.count({ where: { status: 'active' } }),
      prisma.bill.aggregate({
        _sum: { amount: true },
        where: { status: 'paid' },
      }),
      prisma.bill.count({ where: { status: 'unpaid' } }),
      prisma.bill.count({ where: { status: 'overdue' } }),
      prisma.enrollment.findMany({
        orderBy: { enrolledAt: 'desc' },
        take: 5,
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
      }),
      prisma.courseSchedule.findMany({
        where: {
          status: 'active',
          enrollments: { some: { status: 'enrolled' } },
        },
        orderBy: { day: 'asc' },
        take: 5,
        include: {
          course: { select: { title: true } },
          mentor: { select: { name: true } },
          enrollments: {
            where: { status: 'enrolled' },
            include: { user: { select: { name: true } } },
          },
        },
      }),
      prisma.bill.findMany({
        where: { status: 'paid' },
        orderBy: { paymentDate: 'desc' },
        take: 5,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount || 0;

    // Format schedules to match dashboard expected shape
    const dayMap: Record<string, number> = {
      'Minggu': 0, 'Senin': 1, 'Selasa': 2, 'Rabu': 3,
      'Kamis': 4, 'Jumat': 5, 'Sabtu': 6,
    };

    const formattedSchedules = upcomingSchedules.map((schedule) => {
      const studentName = schedule.enrollments[0]?.user?.name || 'Belum ada siswa';

      // Calculate next session date based on day of week
      const targetDay = dayMap[schedule.day] ?? 1;
      const today = new Date();
      let daysUntil = targetDay - today.getDay();
      if (daysUntil <= 0) daysUntil += 7;
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysUntil);

      return {
        id: schedule.id,
        dayOfWeek: schedule.day,
        time: schedule.startTime,
        nextSessionDate: nextDate.toISOString(),
        user: { name: studentName },
        course: schedule.course,
      };
    });

    return NextResponse.json({
      totalStudents,
      activeCourses,
      totalEnrollments,
      totalRevenue,
      unpaidBills,
      overdueBills,
      recentEnrollments,
      upcomingSchedules: formattedSchedules,
      recentPayments,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
