import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { setSession } from '@/lib/session';

const schema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(80).optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.parse(await req.json());
    const email = parsed.email.toLowerCase();
    await prisma.user.upsert({
      where: { email },
      update: parsed.name ? { name: parsed.name } : {},
      create: { email, name: parsed.name || email.split('@')[0] },
    });
    await setSession(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 400 });
  }
}
