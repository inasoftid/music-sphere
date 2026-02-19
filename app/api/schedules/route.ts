import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mapping hari Indonesia ke JS day number (0=Sunday, 1=Monday, ...)
const DAY_MAP: Record<string, number> = {
  'Minggu': 0,
  'Senin': 1,
  'Selasa': 2,
  'Rabu': 3,
  'Kamis': 4,
  'Jumat': 5,
  'Sabtu': 6,
};

function getNextSessionDate(dayName: string): string {
  const targetDay = DAY_MAP[dayName];
  if (targetDay === undefined) return new Date().toISOString().split('T')[0];

  const today = new Date();
  const currentDay = today.getDay();
  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) daysUntil += 7;

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);
  return nextDate.toISOString().split('T')[0];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'User ID required' }, { status: 400 });
  }

  try {
    // Query dari ScheduleEnrollment -> CourseSchedule -> Course
    const scheduleEnrollments = await prisma.scheduleEnrollment.findMany({
      where: {
        userId,
        status: { in: ['enrolled', 'pending_change'] },
      },
      include: {
        schedule: {
          include: {
            course: {
              select: { title: true },
            },
          },
        },
      },
    });

    const formattedSchedules = scheduleEnrollments.map((se) => ({
      id: se.id,
      courseName: se.schedule.course.title,
      dayOfWeek: se.schedule.day,
      startTime: se.schedule.startTime,
      endTime: se.schedule.endTime,
      time: `${se.schedule.startTime} - ${se.schedule.endTime}`,
      status: se.status === 'pending_change'
        ? 'pending_change'
        : se.schedule.status === 'active'
          ? 'active'
          : 'cancelled',
      nextSessionDate: getNextSessionDate(se.schedule.day),
      requestedDay: se.requestedDay || null,
      requestedTime: se.requestedTime || null,
      courseId: se.schedule.courseId,
    }));

    return NextResponse.json(formattedSchedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { scheduleId, status, requestedDay, requestedTime } = body;

    if (!scheduleId) {
      return NextResponse.json({ message: 'Schedule ID required' }, { status: 400 });
    }

    // Simpan permintaan perubahan jadwal (requestedDay, requestedTime) dan status
    const updated = await prisma.scheduleEnrollment.update({
      where: { id: scheduleId },
      data: {
        status: status || 'enrolled',
        requestedDay: requestedDay || null,
        requestedTime: requestedTime || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
