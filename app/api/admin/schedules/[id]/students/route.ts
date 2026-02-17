import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get all students enrolled in a schedule
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const enrollments = await prisma.scheduleEnrollment.findMany({
      where: {
        scheduleId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

// POST - Enroll a student to a schedule
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if schedule exists
    const schedule = await prisma.courseSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    // Check if schedule is full
    if (schedule._count.enrollments >= schedule.maxStudents) {
      return NextResponse.json(
        { error: 'Schedule is full' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.scheduleEnrollment.findUnique({
      where: {
        scheduleId_userId: {
          scheduleId,
          userId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'User is already enrolled in this schedule' },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.scheduleEnrollment.create({
      data: {
        scheduleId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to enroll student' },
      { status: 500 }
    );
  }
}
