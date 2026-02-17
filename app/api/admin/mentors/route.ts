import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET - List all mentors
export async function GET() {
  try {
    const mentors = await prisma.mentor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            courseSchedules: true,
          },
        },
      },
    });

    return NextResponse.json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    );
  }
}

// POST - Create new mentor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, expertise, photo, bio, status } = body;

    // Validation
    if (!name || !email || !expertise) {
      return NextResponse.json(
        { error: 'Name, email, and expertise are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingMentor = await prisma.mentor.findUnique({
      where: { email },
    });

    if (existingMentor) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const mentor = await prisma.mentor.create({
      data: {
        name,
        email,
        phone: phone || null,
        expertise,
        photo: photo || null,
        bio: bio || null,
        status: status || 'active',
      },
    });

    return NextResponse.json(mentor, { status: 201 });
  } catch (error) {
    console.error('Error creating mentor:', error);
    return NextResponse.json(
      { error: 'Failed to create mentor' },
      { status: 500 }
    );
  }
}
