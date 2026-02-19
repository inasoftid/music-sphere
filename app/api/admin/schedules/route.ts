import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List semua jadwal dari CourseSchedule + ScheduleEnrollment
export async function GET() {
  try {
    const schedules = await prisma.courseSchedule.findMany({
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' },
      ],
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        mentor: {
          select: {
            id: true,
            name: true,
            expertise: true,
          },
        },
        enrollments: {
          where: { status: 'enrolled' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule.id,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status,
      course: {
        id: schedule.course.id,
        title: schedule.course.title,
      },
      mentor: {
        id: schedule.mentor.id,
        name: schedule.mentor.name,
        expertise: schedule.mentor.expertise,
      },
      student: schedule.enrollments.length > 0
        ? {
            id: schedule.enrollments[0].user.id,
            name: schedule.enrollments[0].user.name,
            email: schedule.enrollments[0].user.email,
          }
        : null,
    }));

    return NextResponse.json(formattedSchedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}
