import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create new user
    // Note: In visual production, password should be hashed (e.g., bcrypt)
    // For this prototype/skripsi, we might store as plain or simple hash if no library installed
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Storing plain for now as per "simple credential check" in plan, recommend hashing later
        role: 'student',
        verificationCode,
        verificationCodeExpires,
        emailVerified: null,
        profile: {
          create: {} // Create empty profile
        }
      },
    });

    // Send verification email
    // We don't await this to keep response fast, or we can await if critical
    try {
      const { sendVerificationEmail } = await import('@/lib/mail');
      await sendVerificationEmail(email, verificationCode);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // We still return success as user is created, they can resend code later
    }

    return NextResponse.json(
      { message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
