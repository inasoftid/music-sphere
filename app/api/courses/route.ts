import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { enrollments: true },
        },
        mentor: {
          select: { id: true, name: true, expertise: true },
        },
      },
    });

    const formatted = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.image,
      registrationFee: course.registrationFee,
      monthlyFee: course.monthlyFee,
      activeStudents: course._count.enrollments,
      mentorId: course.mentorId,
      mentorName: course.mentor?.name || null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
