import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    // Ambil semua kursus untuk dropdown
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        mentor: { select: { name: true } },
      },
      orderBy: { title: 'asc' },
    });

    if (!courseId) {
      return NextResponse.json({ courses, students: [] });
    }

    // Ambil data kursus yang dipilih
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        mentor: { select: { name: true, expertise: true } },
      },
    });

    if (!course) {
      return NextResponse.json({ message: 'Kursus tidak ditemukan' }, { status: 404 });
    }

    // Ambil siswa yang terdaftar di kursus ini
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            profile: { select: { instrument: true, dateOfBirth: true, address: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'asc' },
    });

    const students = enrollments.map((enrollment, index) => ({
      no: index + 1,
      id: enrollment.user.id,
      name: enrollment.user.name,
      email: enrollment.user.email,
      instrument: enrollment.user.profile?.instrument || '-',
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt.toISOString().split('T')[0],
      completedSessions: enrollment.completedSessions,
      totalSessions: enrollment.totalSessions,
    }));

    return NextResponse.json({ courses, course, students });
  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
