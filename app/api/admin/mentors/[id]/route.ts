import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET - Get single mentor
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        courseSchedules: {
          include: {
            course: true,
            _count: {
              select: {
                enrollments: true,
              },
            },
          },
        },
      },
    });

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mentor);
  } catch (error) {
    console.error('Error fetching mentor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentor' },
      { status: 500 }
    );
  }
}

// PUT - Update mentor
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, expertise, photo, bio, status } = body;

    // Check if mentor exists
    const existingMentor = await prisma.mentor.findUnique({
      where: { id },
    });

    if (!existingMentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingMentor.email) {
      const emailTaken = await prisma.mentor.findUnique({
        where: { email },
      });

      if (emailTaken) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    const mentor = await prisma.mentor.update({
      where: { id },
      data: {
        name: name || existingMentor.name,
        email: email || existingMentor.email,
        phone: phone !== undefined ? phone : existingMentor.phone,
        expertise: expertise || existingMentor.expertise,
        photo: photo !== undefined ? photo : existingMentor.photo,
        bio: bio !== undefined ? bio : existingMentor.bio,
        status: status || existingMentor.status,
      },
    });

    return NextResponse.json(mentor);
  } catch (error) {
    console.error('Error updating mentor:', error);
    return NextResponse.json(
      { error: 'Failed to update mentor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete mentor
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if mentor has active schedules
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        courseSchedules: {
          where: {
            status: 'active',
          },
        },
      },
    });

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    if (mentor.courseSchedules.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete mentor with active schedules' },
        { status: 400 }
      );
    }

    await prisma.mentor.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Mentor deleted successfully' });
  } catch (error) {
    console.error('Error deleting mentor:', error);
    return NextResponse.json(
      { error: 'Failed to delete mentor' },
      { status: 500 }
    );
  }
}
