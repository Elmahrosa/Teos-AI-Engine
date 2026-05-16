import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionEmail } from '@/lib/session';
import { isAdminEmail } from '@/lib/access';

export async function POST(req: Request) {
  const actorEmail = await getSessionEmail();
  if (!actorEmail || !isAdminEmail(actorEmail)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await req.formData();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const plan = String(formData.get('plan') || '').trim().toLowerCase();

  if (!email || !['starter', 'pro', 'agency'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({ where: { email } });
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: targetUser.id },
    data: { plan, status: 'active' },
  });

  await (prisma as any).billingEvent.create({
    data: {
      userId: targetUser.id,
      provider: 'manual-admin',
      plan,
      amount: null,
      status: 'confirmed',
    },
  });

  return NextResponse.redirect(new URL('/admin', req.url));
}
