import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionEmail } from "@/lib/session";
import { resolveLanguage, buildSystemPrompt } from "@/lib/arabic-prompts";
import { getSmartHashtags, getPlatformInfo, getRandomCTA, getBestTime, calculateVisibilityScore, Platform as LibPlatform } from "@/lib/platforms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const PLAN_LIMITS: Record<string, number> = {
  starter: 5,
  pro: 50,
  agency: 200,
};

type Platform =
  | "X"
  | "LinkedIn"
  | "Facebook"
  | "Instagram"
  | "TikTok"
  | "Threads"
  | "Telegram"
  | "WhatsApp";

function response(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function normalizePlatform(platform: string): Platform {
  const p = String(platform || "X").toLowerCase();
  if (p.includes("linkedin")) return "LinkedIn";
  if (p.includes("facebook")) return "Facebook";
  if (p.includes("instagram")) return "Instagram";
  if (p.includes("tiktok")) return "TikTok";
  if (p.includes("thread")) return "Threads";
  if (p.includes("telegram")) return "Telegram";
  if (p.includes("whatsapp")) return "WhatsApp";
  return "X";
}

function platformIcon(platform: Platform) {
  const icons: Record<Platform, string> = {
    X: "\ud835\udd4f",
    LinkedIn: "in",
    Facebook: "f",
    Instagram: "\u25ce",
    TikTok: "\u266a",
    Threads: "@",
    Telegram: "\u2708",
    WhatsApp: "\u2618",
  };
  return icons[platform];
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

function fallbackPost(topic: string, rawPlatform: string) {
  const platform = normalizePlatform(rawPlatform);
  const libPlatform = (platform.toLowerCase()) as LibPlatform;
  const hashtags = getSmartHashtags(topic, libPlatform);
  const cta = getRandomCTA();
  const post = `${topic}\n\n${cta}`;
  const score = calculateVisibilityScore({
    topic,
    platform: libPlatform,
    tone: "professional",
    goal: "engagement",
    post,
    hashtags,
  });

  return {
    post,
    hashtags,
    visibilityScore: score,
    bestTime: getBestTime(libPlatform),
    suggestedCTA: cta,
    checklist: ["Strong hook", "Platform optimized", "CTA included", "Trend hashtags included"],
    platform,
    platformIcon: platformIcon(platform),
    fallback: true,
    imagePrompt: `Premium ${platform} visual for: "${topic}". Black luxury background, gold and royal purple accents, Egyptian AI aesthetic.`,
    videoScript: "",
    imageUrl: null,
    insights: {
      visibilityScore: score,
      bestTime: getBestTime(libPlatform),
      suggestedCTA: cta,
      checklist: ["Strong hook", "Platform optimized", "CTA included", "Trend hashtags included"],
    },
  };
}

async function openAI(topic: string, platform: string, tone: string, goal: string) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackPost(topic, platform);
  }

  const lang = resolveLanguage("auto", topic);
  const systemPrompt = buildSystemPrompt({
    platform,
    tone,
    goal,
    lang,
  });

  const userPrompt = `
Return ONLY valid JSON with this exact shape:
{
  "post": "string",
  "hashtags": ["tag1", "tag2", "tag3"],
  "visibilityScore": 88,
  "bestTime": "string",
  "suggestedCTA": "string",
  "checklist": ["string", "string", "string"],
  "imagePrompt": "string",
  "videoScript": "string"
}

Topic: ${topic}
Platform: ${platform}
Tone: ${tone}
Goal: ${goal}

Rules:
- Write in ${lang === "ar" ? "Arabic" : "English"}.
- Never reuse generic template lines.
- Make the output platform-specific.
- Use fresh hashtags for this topic.
- Visibility score must be between 55 and 98.
- If platform is TikTok, include videoScript.
`;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.95,
        max_tokens: 900,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const raw = await r.text();

    if (!r.ok) {
      console.error("OPENAI_ERROR", { status: r.status, model: MODEL, body: raw });
      return fallbackPost(topic, platform);
    }

    const data = JSON.parse(raw);
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return fallbackPost(topic, platform);
    }

    try {
      const parsed = JSON.parse(content);
      const safe = fallbackPost(topic, platform);

      return {
        post: parsed.post || safe.post,
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : safe.hashtags,
        visibilityScore: parsed.visibilityScore || parsed.insights?.visibilityScore || safe.visibilityScore,
        bestTime: parsed.bestTime || parsed.insights?.bestTime || safe.bestTime,
        suggestedCTA: parsed.suggestedCTA || parsed.insights?.suggestedCTA || safe.suggestedCTA,
        checklist: Array.isArray(parsed.checklist) ? parsed.checklist : Array.isArray(parsed.insights?.checklist) ? parsed.insights.checklist : safe.checklist,
        imagePrompt: parsed.imagePrompt || safe.imagePrompt,
        videoScript: parsed.videoScript || "",
        platform: normalizePlatform(platform),
        platformIcon: platformIcon(normalizePlatform(platform)),
        fallback: false,
        imageUrl: null,
        insights: {
          visibilityScore: parsed.visibilityScore || parsed.insights?.visibilityScore || safe.visibilityScore,
          bestTime: parsed.bestTime || parsed.insights?.bestTime || safe.bestTime,
          suggestedCTA: parsed.suggestedCTA || parsed.insights?.suggestedCTA || safe.suggestedCTA,
          checklist: Array.isArray(parsed.checklist) ? parsed.checklist : Array.isArray(parsed.insights?.checklist) ? parsed.insights.checklist : safe.checklist,
        },
      };
    } catch {
      console.error("OPENAI_INVALID_JSON", content);
      return fallbackPost(topic, platform);
    }
  } catch (err: unknown) {
    console.error("OPENAI_FATAL", err instanceof Error ? err.message : err);
    return fallbackPost(topic, platform);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return response({ success: false, error: "Rate limit exceeded. Try again in a minute." }, 429);
    }

    const email = await getSessionEmail();
    if (!email) {
      return response({ success: false, error: "Unauthorized" }, 401);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return response({ success: false, error: "User not found" }, 404);
    }

    const body = await req.json();
    const topic = String(body.topic || body.prompt || "").trim();
    const platform = normalizePlatform(String(body.platform || "X"));
    const tone = String(body.tone || "Professional");
    const goal = String(body.goal || "Engagement");

    if (!topic) {
      return response({ success: false, error: "Topic required" }, 400);
    }

    const plan = user.plan || "starter";
    const used = user.postsUsed || 0;
    const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.starter;

    if (!user.isAdmin && !user.isLifetime && used >= limit) {
      return response({ success: false, error: `${plan} plan limit reached` }, 403);
    }

    const agencyPlans = ["agency", "agency_yearly", "agency_lifetime", "founder"];
    if (platform === "LinkedIn" && !agencyPlans.includes(plan) && !user.isAdmin && !user.isLifetime) {
      return response({ success: false, error: "LinkedIn requires Agency plan" }, 403);
    }

    const generated = await openAI(topic, platform, tone, goal);
    const safeFallback = fallbackPost(topic, platform);

    const visibilityScore = generated.visibilityScore || safeFallback.visibilityScore;
    const bestTime = generated.bestTime || safeFallback.bestTime;
    const suggestedCTA = generated.suggestedCTA || safeFallback.suggestedCTA;
    const checklist = Array.isArray(generated.checklist) ? generated.checklist : safeFallback.checklist;
    const hashtags = Array.isArray(generated.hashtags) ? generated.hashtags : safeFallback.hashtags;
    const postContent = generated.post || safeFallback.post;
    const imagePrompt = generated.imagePrompt || safeFallback.imagePrompt;
    const videoScript = generated.videoScript || safeFallback.videoScript;

    const newUsedCount = user.isAdmin || user.isLifetime ? user.postsUsed : user.postsUsed + 1;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { postsUsed: newUsedCount },
      }),
      prisma.post.create({
        data: {
          userId: user.id,
          platform: platform.toLowerCase(),
          prompt: topic,
          content: postContent,
          hashtags: JSON.stringify(hashtags),
          imageUrl: generated.imageUrl || null,
        },
      }),
    ]);

    return response({
      success: true,
      plan,
      used: newUsedCount,
      post: postContent,
      hashtags,
      imageUrl: null,
      imagePrompt,
      videoScript,
      visibilityScore,
      bestTime,
      suggestedCTA,
      checklist,
      platform,
      platformIcon: platformIcon(platform),
      fallback: Boolean(generated.fallback),
      insights: {
        visibilityScore,
        bestTime,
        suggestedCTA,
        checklist,
      },
    });
  } catch (err: unknown) {
    console.error("GENERATE_ROUTE_FATAL", err instanceof Error ? err.message : err);
    return response({ success: false, error: "Generation failed" }, 500);
  }
}
