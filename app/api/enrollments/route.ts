import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch student enrollments
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'userId is required' }, { status: 400 });
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            image: true,
            registrationFee: true,
            monthlyFee: true,
            mentor: {
              select: { name: true, expertise: true },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const formatted = enrollments.map((e) => ({
      id: e.id,
      status: e.status,
      totalSessions: e.totalSessions,
      completedSessions: e.completedSessions,
      scheduleId: e.scheduleId,
      enrolledAt: e.enrolledAt,
      course: {
        id: e.course.id,
        title: e.course.title,
        image: e.course.image,
        mentorName: e.course.mentor?.name || '-',
        expertise: e.course.mentor?.expertise || '-',
      },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

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

const VALID_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const ROOMS = ['Studio 1', 'Studio 2', 'Studio 3'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, courseId, day, startTime } = body;

    if (!userId || !courseId || !day || !startTime) {
      return NextResponse.json(
        { message: 'userId, courseId, day, dan startTime wajib diisi' },
        { status: 400 }
      );
    }

    // Validasi day dan startTime
    if (!VALID_DAYS.includes(day)) {
      return NextResponse.json(
        { message: 'Hari tidak valid. Pilih Senin-Sabtu.' },
        { status: 400 }
      );
    }

    const endTime = TIME_SLOT_MAP[startTime];
    if (!endTime) {
      return NextResponse.json(
        { message: 'Waktu tidak valid. Pilih dari jam 11:00 - 17:00' },
        { status: 400 }
      );
    }

    // Cek apakah student sudah enrolled di course ini
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: { in: ['active', 'pending_payment'] },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { message: 'Anda sudah terdaftar di kursus ini' },
        { status: 400 }
      );
    }

    // Ambil course + mentor
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { mentor: true },
    });

    if (!course) {
      return NextResponse.json(
        { message: 'Kursus tidak ditemukan' },
        { status: 404 }
      );
    }

    if (!course.mentorId || !course.mentor) {
      return NextResponse.json(
        { message: 'Kursus belum memiliki mentor' },
        { status: 400 }
      );
    }

    // Cek apakah mentor sudah di-booking di slot tersebut
    const mentorBusy = await prisma.courseSchedule.findFirst({
      where: {
        mentorId: course.mentorId,
        day,
        startTime,
        status: 'active',
        enrollments: {
          some: { status: 'enrolled' },
        },
      },
    });

    if (mentorBusy) {
      return NextResponse.json(
        { message: 'Mentor sudah memiliki jadwal di waktu tersebut. Silakan pilih waktu lain.' },
        { status: 400 }
      );
    }

    // Cek apakah student sudah punya jadwal lain di day+startTime yang sama
    const studentBusy = await prisma.scheduleEnrollment.findFirst({
      where: {
        userId,
        status: 'enrolled',
        schedule: {
          day,
          startTime,
          status: 'active',
        },
      },
    });

    if (studentBusy) {
      return NextResponse.json(
        { message: 'Anda sudah memiliki jadwal di waktu tersebut. Silakan pilih waktu lain.' },
        { status: 400 }
      );
    }

    // Cari ruangan yang tersedia di slot tersebut
    const busyRooms = await prisma.courseSchedule.findMany({
      where: {
        day,
        startTime,
        status: 'active',
        enrollments: {
          some: { status: 'enrolled' },
        },
      },
      select: { room: true },
    });

    const usedRooms = new Set(busyRooms.map((s) => s.room));
    const availableRoom = ROOMS.find((r) => !usedRooms.has(r));

    if (!availableRoom) {
      return NextResponse.json(
        { message: 'Semua ruangan sudah penuh di waktu tersebut. Silakan pilih waktu lain.' },
        { status: 400 }
      );
    }

    // Buat CourseSchedule baru
    const schedule = await prisma.courseSchedule.create({
      data: {
        courseId,
        mentorId: course.mentorId,
        day,
        startTime,
        endTime,
        room: availableRoom,
        maxStudents: 1,
        status: 'active',
      },
    });

    // Buat ScheduleEnrollment
    await prisma.scheduleEnrollment.create({
      data: {
        scheduleId: schedule.id,
        userId,
        status: 'enrolled',
      },
    });

    // Buat Enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'pending_payment',
        totalSessions: 24,
        completedSessions: 0,
        scheduleId: schedule.id,
      },
    });

    // Buat Bill pertama (biaya pendaftaran)
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 7);

    const bill = await prisma.bill.create({
      data: {
        userId,
        courseId,
        type: 'registration',
        amount: course.registrationFee,
        lateFee: 0,
        month: now.toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
        dueDate,
        status: 'unpaid',
      },
    });

    return NextResponse.json(
      {
        enrollment: {
          id: enrollment.id,
          status: enrollment.status,
          scheduleId: schedule.id,
        },
        schedule: {
          id: schedule.id,
          day: schedule.day,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          room: schedule.room,
        },
        billId: bill.id,
        amount: bill.amount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
