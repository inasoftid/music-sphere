
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// GET: Fetch messages
export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role'); // 'admin' or undefined (student)
    
    // If Admin requesting all conversations
    if (role === 'admin') {
      // Check if user is actually admin
      if (user.role !== 'admin') {
        return new NextResponse('Forbidden', { status: 403 });
      }

      // Fetch all messages, we might want to group them by user on the client side
      // or fetch users who have messages. 
      // For simplicity/performance in this MVP, let's fetch users who have messages first.
      
      // Get all users who have sent messages or received messages
      // This might be heavy if there are many messages. 
      // Better approach: Fetch all users with role 'student' and include their messages
      const studentsWithMessages = await prisma.user.findMany({
        where: { role: 'student' },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          // lastActiveAt: true, // If we had this feature
          messages: {
            orderBy: { createdAt: 'asc' },
            // take: 50 // limit history if needed
          }
        }
      });

      // Filter out students with no messages if desired, or keep them to allow starting chat
      // For Admin Chat to look populated, we send students who have messages or we want to chat with.
      
      return NextResponse.json(studentsWithMessages);
    }

    // If Student requesting their own messages
    const messages = await prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);

  } catch (error) {
    console.error('[CHAT_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// POST: Send a message
export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { text, targetUserId } = body; // targetUserId needed if Admin sending to Student

    if (!text) {
      return new NextResponse('Missing text', { status: 400 });
    }

    let messageData;

    if (user.role === 'admin') {
      if (!targetUserId) {
        return new NextResponse('Target User ID required for admin', { status: 400 });
      }
      // Admin sending to specific student
      messageData = {
        userId: targetUserId, // The conversation belongs to the student
        sender: 'admin',
        text,
        isRead: false,
      };
    } else {
      // Student sending to admin
      messageData = {
        userId: user.id,
        sender: 'user',
        text,
        isRead: false,
      };
    }

    const newMessage = await prisma.chatMessage.create({
      data: messageData,
    });

    return NextResponse.json(newMessage);

  } catch (error) {
    console.error('[CHAT_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
