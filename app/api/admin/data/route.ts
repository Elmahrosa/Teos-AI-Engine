import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminEmail } from '@/lib/access';
import { getSessionEmail } from '@/lib/session';

export async function GET() {
  const currentUserEmail = await getSessionEmail();
  if (!currentUserEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdminEmail(currentUserEmail)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

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
    (prisma as any).billingEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { email: true } } },
    }),
  ]);

  return NextResponse.json({ users, billing });
}
