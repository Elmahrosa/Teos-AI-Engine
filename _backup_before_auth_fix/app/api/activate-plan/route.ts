import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';

const schema = z.object({
  plan: z.enum(['starter', 'pro', 'agency']),
  txHash: z.string().trim().min(3).optional(),
  network: z.enum(['solana', 'pi']).optional(),
});

export async function POST(req: Request) {
  try {
    const email = await getSessionEmail();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const amount = parsed.plan === 'pro' ? (parsed.network === 'pi' ? 14.5 : 29) : parsed.plan === 'agency' ? (parsed.network === 'pi' ? 49.5 : 99) : 0;

    const billingEvent = await prisma.billingEvent.create({
      data: {
        userId: user.id,
        provider: parsed.network === 'pi' ? 'pi' : 'usdc-solana',
        plan: parsed.plan,
        amount,
        network: parsed.network || null,
        txHash: parsed.txHash || null,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      status: 'pending_confirmation',
      billingEventId: billingEvent.id,
      plan: parsed.plan,
    });
  } catch {
    return NextResponse.json({ error: 'Activation failed' }, { status: 400 });
  }
}
