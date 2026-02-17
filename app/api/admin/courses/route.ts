import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { enrollments: true }
        },
        mentor: {
          select: { id: true, name: true, expertise: true }
        }
      }
    });

    const formattedCourses = courses.map((course: any) => ({
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
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, image, registrationFee, monthlyFee, mentorId } = body;

        const newCourse = await prisma.course.create({
            data: {
                title,
                description,
                image: image || null,
                registrationFee: parseInt(registrationFee || 200000),
                monthlyFee: parseInt(monthlyFee || 350000),
                mentorId: mentorId || null,
            }
        });

        return NextResponse.json(newCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json({ message: 'Error creating course' }, { status: 500 });
    }
}
