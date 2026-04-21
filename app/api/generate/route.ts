import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePost } from '@/lib/claude';
import { canUserPost, appendPost, ensureUserExists } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, platform } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Ensure user exists and check limits
    const user = await ensureUserExists(session.user.email, session.user.name || undefined);
    
    const check = await canUserPost(user.id, user.plan);
    if (!check.allowed) {
      return NextResponse.json({ 
        error: check.reason,
        limitReached: true 
      }, { status: 429 });
    }

    // Generate post using Claude
    const result = await generatePost(prompt, platform);

    // Save post and update usage
    await appendPost({
      userId: user.id,
      content: result.post,
      platform,
      prompt
    });

    return NextResponse.json({
      success: true,
      post: result.post,
      remaining: check.limit ? check.limit - (user.dailyPostsUsed + 1) : null
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 });
  }
}
