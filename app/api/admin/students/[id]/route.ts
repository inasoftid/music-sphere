import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, instrument } = body;

    // Validation
    if (!name || !email || !phone || !instrument) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== id) {
      return NextResponse.json(
        { message: 'Email is already in use' },
        { status: 400 }
      );
    }

    // Update user and profile
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        profile: {
          upsert: {
            create: {
              instrument,
            },
            update: {
              instrument,
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone,
      instrument: updatedUser.profile?.instrument || '-',
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if student exists
    const student = await prisma.user.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }

    // Delete the student (cascade will handle related records)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: student.id,
      name: student.name,
      email: student.email,
      phone: '-',
      instrument: student.profile?.instrument || '-',
      status: 'Active',
      joinDate: student.createdAt.toISOString().split('T')[0],
      enrolledCourses: student._count.enrollments,
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
