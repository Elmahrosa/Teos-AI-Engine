import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentUser, isAdminEmail } from '@/lib/auth';

const schema = z.object({
  billingEventId: z.string().min(1),
  userId: z.string().min(1),
  plan: z.enum(['starter', 'pro', 'agency']),
});

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isAdminEmail(currentUser.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const parsed = schema.parse(await req.json());
    await prisma.$transaction([
      prisma.user.update({
        where: { id: parsed.userId },
        data: { plan: parsed.plan, status: 'active' },
      }),
      prisma.billingEvent.update({
        where: { id: parsed.billingEventId },
        data: { status: 'confirmed' },
      }),
    ]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Activation failed' }, { status: 400 });
  }
}
