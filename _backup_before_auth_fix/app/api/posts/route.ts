import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { canGenerate, canUseLinkedIn } from '@/lib/limits';

const schema = z.object({
  prompt: z.string().min(3),
  platform: z.enum(['x', 'facebook', 'instagram', 'linkedin']),
  content: z.string().min(3),
  hashtags: z.array(z.string()).default([]),
  imageUrl: z.string().optional().nullable(),
});

export async function GET() {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { email },
    include: { posts: { orderBy: { createdAt: 'desc' }, take: 50 } },
  });
  return NextResponse.json({ posts: user?.posts || [] });
}

export async function POST(req: Request) {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email },
    include: { posts: true },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  try {
    const parsed = schema.parse(await req.json());

    if (parsed.platform === 'linkedin' && !canUseLinkedIn(user.plan)) {
      return NextResponse.json({ error: 'LinkedIn requires Agency plan' }, { status: 403 });
    }

    if (!canGenerate(user.plan, user.posts.length)) {
      return NextResponse.json({ error: 'Starter plan limit reached' }, { status: 403 });
    }

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        prompt: parsed.prompt,
        platform: parsed.platform,
        content: parsed.content,
        hashtags: JSON.stringify(parsed.hashtags),
        imageUrl: parsed.imageUrl || null,
      },
    });
    return NextResponse.json({ success: true, post });
  } catch {
    return NextResponse.json({ error: 'Failed to save post' }, { status: 400 });
  }
}
