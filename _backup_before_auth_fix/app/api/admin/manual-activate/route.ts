import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentUser, isAdminEmail } from '@/lib/auth';

const schema = z.object({
  userId: z.string().min(1),
  plan: z.enum(['pro', 'agency']),
});

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isAdminEmail(currentUser.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const parsed = schema.parse(await req.json());
    await prisma.user.update({
      where: { id: parsed.userId },
      data: { plan: parsed.plan, status: 'active' },
    });
    // Create a billing event record for audit trail
    await prisma.billingEvent.create({
      data: {
        userId: parsed.userId,
        provider: 'manual-admin',
        plan: parsed.plan,
        amount: null,
        status: 'confirmed',
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/admin/manual-activate]', error);
    return NextResponse.json({ error: 'Activation failed' }, { status: 400 });
  }
}
