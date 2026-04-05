import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';

const schema = z.object({
  plan:          z.enum(['pro', 'agency']),
  paypalTxId:    z.string().min(4).max(200),   // PayPal Transaction ID from receipt email
  amount:        z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const email = await getSessionEmail();
    if (!email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
    }

    const { plan, paypalTxId, amount } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for duplicate submission of same TX ID
    const existing = await prisma.billingEvent.findFirst({
      where: { txHash: paypalTxId, provider: 'paypal' },
    });
    if (existing) {
      return NextResponse.json({ error: 'This PayPal transaction ID has already been submitted.' }, { status: 409 });
    }

    // Record the billing event — status 'pending' until admin approves
    await prisma.billingEvent.create({
      data: {
        userId:   user.id,
        email:    user.email,
        provider: 'paypal',
        plan,
        amount,
        network:  'USD',
        txHash:   paypalTxId,
        status:   'pending',
      },
    });

    return NextResponse.json({
      ok: true,
      message: 'PayPal payment submitted. Your plan will be activated after verification (usually within a few hours).',
    });

  } catch (err) {
    console.error('[paypal-payment]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
