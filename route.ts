import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { canGenerate, canUseLinkedIn } from "@/lib/limits";
import { getSessionEmail } from "@/lib/session";
import { prisma } from "@/lib/db";
import { generateHashtags } from "@/lib/ai/generateHashtags";
import { generateImage } from "@/lib/ai/generateImage";
import { getVisibilityScore, getBestTime, getSuggestedCTA, getChecklist } from "@/lib/ai/insights";

const schema = z.object({
  prompt: z.string().min(3).max(500),
  platform: z.enum(["x", "facebook", "instagram", "linkedin"]),
  tone: z
    .enum(["professional", "bold", "educational", "conversational"])
    .default("professional"),
  goal: z
    .enum(["engagement", "authority", "sales", "community"])
    .default("engagement"),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.parse(await req.json());

    const email = await getSessionEmail();
    if (!email) {
      return NextResponse.json({ error: "Please log in first" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { posts: { select: { id: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (parsed.platform === "linkedin" && !canUseLinkedIn(user.plan)) {
      return NextResponse.json(
        { error: "LinkedIn requires Agency plan" },
        { status: 403 }
      );
    }

    const usedCount = user.posts.length;
    if (!canGenerate(user.plan, usedCount)) {
      return NextResponse.json(
        {
          error: "Starter plan limit reached. Upgrade to continue.",
          upgrade: true,
        },
        { status: 403 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const systemPrompt = `You are Teos AI Engine, an elite social media content strategist.

Generate a high-performing social media post and return ONLY valid JSON in this exact shape:
{
  "post": "the main post text",
  "hookVariations": ["hook 1", "hook 2", "hook 3"],
  "cta": "one clear call to action"
}

Rules:
- No markdown, no backticks, no preamble — raw JSON only
- post must be ready to publish as-is
- Sound human, premium, scroll-stopping
- Optimize for the platform character limits and style`;

    const userPrompt = `Platform: ${parsed.platform}
Topic: ${parsed.prompt}
Goal: ${parsed.goal}
Tone: ${parsed.tone}
Audience: founders, creators, growth-focused builders`;

    let postText = "";
    try {
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      const raw = response.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");

      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed2 = JSON.parse(cleaned);
      postText = parsed2.post || cleaned;
    } catch {
      // Fallback: return raw text if JSON parse fails
      postText = `${parsed.prompt} — built for ${parsed.platform}. Share your thoughts.`;
    }

    // Generate supporting assets
    const hashtags = generateHashtags(parsed.prompt, parsed.platform);
    const imageResult = await generateImage(parsed.platform, parsed.prompt);
    const visibilityScore = getVisibilityScore(postText, hashtags, parsed.goal);
    const bestTime = getBestTime(parsed.platform);
    const suggestedCTA = getSuggestedCTA(parsed.goal);
    const checklist = getChecklist(parsed.platform, parsed.goal);

    // ✅ Return shape that matches PostGenerator component exactly
    return NextResponse.json({
      success: true,
      plan: user.plan,
      used: usedCount,
      post: postText,
      hashtags,
      imageUrl: imageResult.url,
      insights: {
        visibilityScore,
        bestTime,
        suggestedCTA,
        checklist,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("[/api/generate]", error);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
