import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendResetPasswordEmail } from '@/lib/mail';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email wajib diisi' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success message to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: 'Jika email terdaftar, kami telah mengirimkan link reset kata sandi.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // Send reset email
    const emailSent = await sendResetPasswordEmail(email, resetToken);

    if (!emailSent) {
      return NextResponse.json(
        { message: 'Gagal mengirim email. Silakan coba lagi.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Jika email terdaftar, kami telah mengirimkan link reset kata sandi.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
