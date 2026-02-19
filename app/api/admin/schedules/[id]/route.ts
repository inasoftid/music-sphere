import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get single CourseSchedule with enrollments
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const schedule = await prisma.courseSchedule.findUnique({
      where: { id },
      include: {
        course: {
          include: { mentor: true },
        },
        mentor: true,
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

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: schedule.id,
      courseId: schedule.courseId,
      mentorId: schedule.mentorId,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      maxStudents: schedule.maxStudents,
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
        ? schedule.enrollments[0].user
        : null,
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

// Time slots
const TIME_SLOT_MAP: Record<string, string> = {
  '11:00': '11:45',
  '12:00': '12:45',
  '13:00': '13:45',
  '14:00': '14:45',
  '15:00': '15:45',
  '16:00': '16:45',
  '17:00': '17:45',
};

// PUT - Update jadwal (hari, waktu, ruangan, status) dengan validasi tumpang tindih
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { day, startTime, status } = body;

    const existing = await prisma.courseSchedule.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    const newDay = day || existing.day;
    const newStartTime = startTime || existing.startTime;
    const newEndTime = TIME_SLOT_MAP[newStartTime] || existing.endTime;
    const newStatus = status || existing.status;

    // Validasi tumpang tindih mentor jika hari/waktu berubah
    if (newDay !== existing.day || newStartTime !== existing.startTime) {
      const mentorConflict = await prisma.courseSchedule.findFirst({
        where: {
          id: { not: id },
          mentorId: existing.mentorId,
          day: newDay,
          startTime: newStartTime,
          status: 'active',
          enrollments: { some: { status: 'enrolled' } },
        },
      });

      if (mentorConflict) {
        return NextResponse.json(
          { error: 'Mentor sudah memiliki jadwal di waktu tersebut' },
          { status: 400 }
        );
      }

      // Validasi tumpang tindih siswa
      const enrollment = await prisma.scheduleEnrollment.findFirst({
        where: { scheduleId: id, status: 'enrolled' },
      });

      if (enrollment) {
        const studentConflict = await prisma.scheduleEnrollment.findFirst({
          where: {
            userId: enrollment.userId,
            status: 'enrolled',
            schedule: {
              id: { not: id },
              day: newDay,
              startTime: newStartTime,
              status: 'active',
            },
          },
        });

        if (studentConflict) {
          return NextResponse.json(
            { error: 'Siswa sudah memiliki jadwal di waktu tersebut' },
            { status: 400 }
          );
        }
      }
    }

    const updated = await prisma.courseSchedule.update({
      where: { id },
      data: {
        day: newDay,
        startTime: newStartTime,
        endTime: newEndTime,
        status: newStatus,
      },
      include: {
        course: true,
        mentor: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus jadwal beserta enrollment terkait
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const schedule = await prisma.courseSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    // CourseSchedule has onDelete: Cascade for enrollments, so deleting schedule
    // automatically deletes ScheduleEnrollment entries
    await prisma.courseSchedule.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}
