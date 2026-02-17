import { prisma } from '@/lib/prisma';

export async function getUserFromRequest(req: Request): Promise<any | null> {
  try {
    // Try to get userId from Authorization header or X-User-ID header
    const authHeader = req.headers.get('Authorization');
    const userIdHeader = req.headers.get('X-User-ID');
    const userEmailHeader = req.headers.get('X-User-Email');

    let userId: string | null = null;
    let userEmail: string | null = null;

    // Parse Bearer token if present (format: "Bearer {userId}")
    if (authHeader?.startsWith('Bearer ')) {
      userId = authHeader.substring(7);
    } else if (userIdHeader) {
      userId = userIdHeader;
    }

    if (userEmailHeader) {
      userEmail = userEmailHeader;
    }

    // If we have user ID, fetch the user
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user;
    }

    // If we have email, fetch the user
    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });
      return user;
    }

    return null;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}
