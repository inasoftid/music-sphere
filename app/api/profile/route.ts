import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
     return NextResponse.json({ message: 'User ID required' }, { status: 400 });
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
    });
    
    // Also fetch basic user info to ensure sync
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, role: true }
    });

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ ...user, profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, address, dateOfBirth, instrument } = body;

    if (!userId) {
        return NextResponse.json({ message: 'User ID required' }, { status: 400 });
    }

    const updatedProfile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        instrument,
      },
      create: {
        userId,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        instrument,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
