import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Time slots tetap: jam buka 11:00 - 18:00, per sesi 45 menit + 15 menit jeda
const TIME_SLOTS = [
  { startTime: '11:00', endTime: '11:45' },
  { startTime: '12:00', endTime: '12:45' },
  { startTime: '13:00', endTime: '13:45' },
  { startTime: '14:00', endTime: '14:45' },
  { startTime: '15:00', endTime: '15:45' },
  { startTime: '16:00', endTime: '16:45' },
  { startTime: '17:00', endTime: '17:45' },
];

// Senin - Sabtu (tidak termasuk Minggu)
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  if (!courseId) {
    return NextResponse.json(
      { message: 'courseId is required' },
      { status: 400 }
    );
  }

  try {
    // Ambil course beserta mentor
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        mentor: { select: { id: true, name: true } },
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    if (!course.mentorId || !course.mentor) {
      return NextResponse.json(
        { message: 'Course does not have a mentor assigned' },
        { status: 400 }
      );
    }

    const mentorId = course.mentorId;
    const mentorName = course.mentor.name;

    // Ambil semua slot yang sudah di-booking oleh mentor ini
    const mentorBookedSchedules = await prisma.courseSchedule.findMany({
      where: {
        mentorId,
        status: 'active',
        enrollments: {
          some: { status: 'enrolled' },
        },
      },
      select: {
        day: true,
        startTime: true,
      },
    });

    // Buat set dari slot mentor yang sudah di-booking
    const mentorBookedKeys = new Set(
      mentorBookedSchedules.map((s) => `${s.day}-${s.startTime}`)
    );

    // Ambil semua slot yang sudah terpakai untuk cek ketersediaan ruangan
    const allBookedSchedules = await prisma.courseSchedule.findMany({
      where: {
        status: 'active',
        enrollments: {
          some: { status: 'enrolled' },
        },
      },
      select: {
        day: true,
        startTime: true,
        room: true,
      },
    });

    // Hitung jumlah ruangan terpakai per slot
    const TOTAL_ROOMS = 3; // Studio 1, 2, 3
    const roomCountPerSlot = new Map<string, number>();
    for (const sched of allBookedSchedules) {
      const key = `${sched.day}-${sched.startTime}`;
      roomCountPerSlot.set(key, (roomCountPerSlot.get(key) || 0) + 1);
    }

    // Generate semua slot dan tandai mana yang available
    const allSlots = DAYS.flatMap((day) =>
      TIME_SLOTS.map((slot) => {
        const key = `${day}-${slot.startTime}`;
        const mentorBusy = mentorBookedKeys.has(key);
        const roomsFull = (roomCountPerSlot.get(key) || 0) >= TOTAL_ROOMS;

        return {
          day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: !mentorBusy && !roomsFull,
          mentorName,
        };
      })
    );

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        registrationFee: course.registrationFee,
        monthlyFee: course.monthlyFee,
        mentorName,
      },
      slots: allSlots,
    });
  } catch (error) {
    console.error('Error fetching available schedules:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
