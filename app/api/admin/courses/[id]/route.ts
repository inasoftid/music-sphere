import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single course by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('[API] Fetching course with ID:', id);
    
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: { enrollments: true }
        },
        mentor: {
          select: { id: true, name: true, expertise: true }
        }
      }
    });

    console.log('[API] Raw course from database:', course);

    if (!course) {
      console.log('[API] Course not found');
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    const formattedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.image,
      activeStudents: course._count.enrollments,
      registrationFee: course.registrationFee,
      monthlyFee: course.monthlyFee,
      mentorId: course.mentorId,
      mentor: course.mentor,
      status: 'Active'
    };

    console.log('[API] Formatted course response:', formattedCourse);

    return NextResponse.json(formattedCourse);
  } catch (error) {
    console.error('[API] Error fetching course:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update course by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, price, image } = body;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        image: image || null,
        registrationFee: parseInt(body.registrationFee || 0),
        monthlyFee: parseInt(body.monthlyFee || 0),
        mentorId: body.mentorId || null
      }
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { message: 'Error updating course' },
      { status: 500 }
    );
  }
}

// DELETE course by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.course.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { message: 'Error deleting course' },
      { status: 500 }
    );
  }
}
