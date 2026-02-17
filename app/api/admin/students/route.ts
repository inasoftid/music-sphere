import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'student' },
      include: {
        profile: true,
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedStudents = students.map((student: any) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      phone: '-', // Phone is not in User or Profile yet, maybe add to Profile?
      instrument: student.profile?.instrument || '-',
      status: 'Active', // Mock status for now
      joinDate: student.createdAt.toISOString().split('T')[0],
      enrolledCourses: student._count.enrollments
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
