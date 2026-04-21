import { NextResponse } from 'next/server';
import { z } from 'zod';
import { canGenerate, canUseLinkedIn } from '@/lib/limits';
import { generatePost } from '@/lib/ai/generateText';
import { generateImage } from '@/lib/ai/generateImage';
import { generateHashtags } from '@/lib/ai/generateHashtags';
import { getChecklist, getBestTime, getSuggestedCTA, getVisibilityScore } from '@/lib/ai/insights';
import { getSessionEmail } from '@/lib/session';
import { prisma } from '@/lib/db';

const schema = z.object({
  prompt: z.string().min(3).max(500),
  platform: z.enum(['x', 'facebook', 'instagram', 'linkedin']),
  tone: z.enum(['professional', 'bold', 'educational', 'conversational']).default('professional'),
  goal: z.enum(['engagement', 'authority', 'sales', 'community']).default('engagement'),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.parse(await req.json());
    const email = await getSessionEmail();
    if (!email) {
      return NextResponse.json({ error: 'Please log in first' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { posts: { select: { id: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (parsed.platform === 'linkedin' && !canUseLinkedIn(user.plan)) {
      return NextResponse.json({ error: 'LinkedIn requires Agency plan' }, { status: 403 });
    }

    const usedCount = user.posts.length;
    if (!canGenerate(user.plan, usedCount)) {
      return NextResponse.json({
        error: 'Starter plan limit reached (10 posts). Upgrade to Pro for unlimited.',
        upgrade: true,
      }, { status: 403 });
    }

    const [post, imageResult, hashtags] = await Promise.all([
      generatePost(parsed.prompt, parsed.platform, parsed.tone, parsed.goal),
      generateImage(parsed.platform, parsed.prompt),
      Promise.resolve(generateHashtags(parsed.prompt, parsed.platform)),
    ]);

    const visibilityScore = getVisibilityScore(post, hashtags, parsed.goal);

    return NextResponse.json({
      success: true,
      plan: user.plan,
      used: usedCount,
      post,
      hashtags,
      imageUrl: imageResult.url,
      insights: {
        visibilityScore,
        bestTime: getBestTime(parsed.platform),
        suggestedCTA: getSuggestedCTA(parsed.goal),
        checklist: getChecklist(parsed.platform, parsed.goal),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.flatten() }, { status: 400 });
    }
    console.error('[/api/generate]', error);
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 });
  }
}
