import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  try {
    const where = courseId ? { courseId } : {};

    const contents = await prisma.practiceContent.findMany({
      where,
      include: {
        course: {
          select: { title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = contents.map((c) => ({
      id: c.id,
      title: c.title,
      thumbnailUrl: c.thumbnailUrl,
      videoUrl: c.videoUrl,
      duration: c.duration || '00:00',
      courseId: c.courseId,
      courseName: c.course.title,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching practice content:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
