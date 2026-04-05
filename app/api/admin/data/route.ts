import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, isAdminEmail } from '@/lib/auth';

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdminEmail(currentUser.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [users, billing] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        status: true,
        createdAt: true,
        posts: { select: { id: true } },
      },
    }),
    prisma.billingEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { email: true } } },
    }),
  ]);

  return NextResponse.json({ users, billing });
}
