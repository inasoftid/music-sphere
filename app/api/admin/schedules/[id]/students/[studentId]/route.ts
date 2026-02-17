import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE - Remove student from schedule
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; studentId: string }> }
) {
  try {
    const { id: scheduleId, studentId } = await params;

    // Find enrollment
    const enrollment = await prisma.scheduleEnrollment.findUnique({
      where: {
        scheduleId_userId: {
          scheduleId,
          userId: studentId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Delete enrollment
    await prisma.scheduleEnrollment.delete({
      where: {
        id: enrollment.id,
      },
    });

    return NextResponse.json({ message: 'Student removed from schedule successfully' });
  } catch (error) {
    console.error('Error removing student:', error);
    return NextResponse.json(
      { error: 'Failed to remove student' },
      { status: 500 }
    );
  }
}
