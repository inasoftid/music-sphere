
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ACTIVITY_UPDATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
