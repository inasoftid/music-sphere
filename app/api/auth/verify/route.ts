import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email and code are required' },
        { status: 400 }
      );
    }

    // Find user with matching email and code
    const user = await prisma.user.findFirst({
      where: {
        email,
        verificationCode: code,
        verificationCodeExpires: {
          gt: new Date(), // Code must not be defined as expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Clear verification code and mark as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: null,
        verificationCodeExpires: null,
        emailVerified: new Date(),
      },
    });

    return NextResponse.json(
      { 
        message: 'Email verified successfully', 
        user: { 
          id: updatedUser.id, 
          name: updatedUser.name, 
          email: updatedUser.email, 
          role: updatedUser.role 
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
