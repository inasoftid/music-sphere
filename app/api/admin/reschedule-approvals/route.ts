import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mapping endTime dari startTime (45 menit per sesi)
const TIME_SLOT_MAP: Record<string, string> = {
  '11:00': '11:45',
  '12:00': '12:45',
  '13:00': '13:45',
  '14:00': '14:45',
  '15:00': '15:45',
  '16:00': '16:45',
  '17:00': '17:45',
};

const ROOMS = ['Studio 1', 'Studio 2', 'Studio 3'];

// GET: Ambil semua permintaan perubahan jadwal yang pending
export async function GET() {
  try {
    const pendingRequests = await prisma.scheduleEnrollment.findMany({
      where: {
        status: 'pending_change',
        requestedDay: { not: null },
        requestedTime: { not: null },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        schedule: {
          include: {
            course: { select: { id: true, title: true } },
            mentor: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const formatted = pendingRequests.map((req) => ({
      id: req.id,
      student: req.user,
      courseName: req.schedule.course.title,
      mentorName: req.schedule.mentor.name,
      // Jadwal saat ini
      currentDay: req.schedule.day,
      currentStartTime: req.schedule.startTime,
      currentEndTime: req.schedule.endTime,
      // Jadwal yang diminta
      requestedDay: req.requestedDay,
      requestedTime: req.requestedTime,
      enrolledAt: req.enrolledAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching reschedule requests:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Approve atau Reject permintaan
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { enrollmentId, action } = body;
    // action: 'approve' | 'reject'

    if (!enrollmentId || !action) {
      return NextResponse.json({ message: 'enrollmentId dan action diperlukan' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ message: 'action harus approve atau reject' }, { status: 400 });
    }

    const enrollment = await prisma.scheduleEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        schedule: {
          include: {
            course: true,
            mentor: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ message: 'Enrollment tidak ditemukan' }, { status: 404 });
    }

    if (action === 'reject') {
      // Tolak: kembalikan status ke enrolled, hapus requested fields
      await prisma.scheduleEnrollment.update({
        where: { id: enrollmentId },
        data: {
          status: 'enrolled',
          requestedDay: null,
          requestedTime: null,
        },
      });

      return NextResponse.json({ message: 'Permintaan perubahan jadwal ditolak.' });
    }

    // Approve: buat CourseSchedule baru untuk jadwal yang diminta
    if (!enrollment.requestedDay || !enrollment.requestedTime) {
      return NextResponse.json({ message: 'Tidak ada data permintaan jadwal' }, { status: 400 });
    }

    const requestedDay = enrollment.requestedDay;
    const requestedTime = enrollment.requestedTime;
    const endTime = TIME_SLOT_MAP[requestedTime];

    if (!endTime) {
      return NextResponse.json(
        { message: 'Waktu yang diminta tidak valid.' },
        { status: 400 }
      );
    }

    const courseId = enrollment.schedule.courseId;
    const mentorId = enrollment.schedule.mentorId;

    // Cek apakah mentor sudah di-booking di slot baru
    const mentorBusy = await prisma.courseSchedule.findFirst({
      where: {
        mentorId,
        day: requestedDay,
        startTime: requestedTime,
        status: 'active',
        enrollments: {
          some: { status: 'enrolled' },
        },
      },
    });

    if (mentorBusy) {
      return NextResponse.json(
        { message: 'Mentor sudah memiliki jadwal di waktu tersebut. Tidak dapat menyetujui.' },
        { status: 400 }
      );
    }

    // Auto-assign ruangan (siswa tidak memilih room)
    const busyRooms = await prisma.courseSchedule.findMany({
      where: {
        day: requestedDay,
        startTime: requestedTime,
        status: 'active',
        enrollments: {
          some: { status: 'enrolled' },
        },
      },
      select: { room: true },
    });

    const usedRooms = new Set(busyRooms.map((s) => s.room));
    const assignedRoom = ROOMS.find((r) => !usedRooms.has(r)) || ROOMS[0];

    // Buat CourseSchedule baru
    const newSchedule = await prisma.courseSchedule.create({
      data: {
        courseId,
        mentorId,
        day: requestedDay,
        startTime: requestedTime,
        endTime,
        room: assignedRoom,
        maxStudents: 1,
        status: 'active',
      },
    });

    const oldScheduleId = enrollment.scheduleId;

    // Pindahkan enrollment ke schedule baru
    await prisma.scheduleEnrollment.update({
      where: { id: enrollmentId },
      data: {
        scheduleId: newSchedule.id,
        status: 'enrolled',
        requestedDay: null,
        requestedTime: null,
      },
    });

    // Update Enrollment record jika ada
    await prisma.enrollment.updateMany({
      where: {
        userId: enrollment.userId,
        courseId,
        scheduleId: oldScheduleId,
      },
      data: {
        scheduleId: newSchedule.id,
      },
    });

    // Bersihkan schedule lama jika tidak ada enrollment lain
    const remainingEnrollments = await prisma.scheduleEnrollment.count({
      where: { scheduleId: oldScheduleId },
    });

    if (remainingEnrollments === 0) {
      await prisma.courseSchedule.update({
        where: { id: oldScheduleId },
        data: { status: 'cancelled' },
      });
    }

    return NextResponse.json({ message: 'Jadwal berhasil diperbarui.' });
  } catch (error) {
    console.error('Error processing reschedule approval:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
