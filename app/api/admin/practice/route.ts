import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all practice content (admin)
export async function GET() {
  try {
    const contents = await prisma.practiceContent.findMany({
      include: {
        course: {
          select: { id: true, title: true },
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
      createdAt: c.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching practice content:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new practice content
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, thumbnailUrl, videoUrl, duration, courseId } = body;

    if (!title || !thumbnailUrl || !videoUrl || !courseId) {
      return NextResponse.json(
        { message: 'Title, thumbnail URL, video URL, dan course wajib diisi' },
        { status: 400 }
      );
    }

    // Verify course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ message: 'Kursus tidak ditemukan' }, { status: 404 });
    }

    const content = await prisma.practiceContent.create({
      data: {
        title,
        thumbnailUrl,
        videoUrl,
        duration: duration || '00:00',
        courseId,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating practice content:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete practice content
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'ID wajib diisi' }, { status: 400 });
  }

  try {
    await prisma.practiceContent.delete({ where: { id } });
    return NextResponse.json({ message: 'Berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting practice content:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
