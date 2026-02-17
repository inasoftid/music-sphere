import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        mentor: {
          select: { id: true, name: true, expertise: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ message: 'Kursus tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.image,
      registrationFee: course.registrationFee,
      monthlyFee: course.monthlyFee,
      mentorId: course.mentorId,
      mentor: course.mentor,
      activeStudents: course._count.enrollments,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
