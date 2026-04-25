import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import * as sessionLib from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type Platform =
  | "X"
  | "LinkedIn"
  | "Facebook"
  | "Instagram"
  | "TikTok"
  | "Threads"
  | "Telegram"
  | "WhatsApp";

function response(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
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
    X: "𝕏",
    LinkedIn: "in",
    Facebook: "f",
    Instagram: "◎",
    TikTok: "♪",
    Threads: "@",
    Telegram: "✈",
    WhatsApp: "☘",
  };

  return icons[platform];
}

function getBestTime(platform: Platform) {
  const map: Record<Platform, string[]> = {
    X: ["8–10 AM", "12–1 PM", "6–8 PM"],
    LinkedIn: ["7–9 AM", "11 AM–1 PM", "5–6 PM"],
    Facebook: ["1–3 PM", "6–8 PM", "8–9 PM"],
    Instagram: ["11 AM–1 PM", "7–9 PM", "9–10 PM"],
    TikTok: ["12 PM", "6 PM", "9 PM"],
    Threads: ["9 AM", "2 PM", "8 PM"],
    Telegram: ["10 AM", "8 PM", "9 PM"],
    WhatsApp: ["9 AM", "7 PM", "8 PM"],
  };

  return pick(map[platform]);
}

function getHashtags(topic: string, platform: Platform) {
  const lower = topic.toLowerCase();

  const base: Record<Platform, string[]> = {
    X: ["AI", "SaaS", "BuildInPublic", "Founders", "Startup"],
    LinkedIn: ["Leadership", "FounderMindset", "SaaS", "BusinessGrowth", "AI"],
    Facebook: ["SmallBusiness", "ContentMarketing", "Entrepreneurship", "AI"],
    Instagram: ["ContentCreator", "CreatorEconomy", "AItools", "DigitalMarketing", "StartupLife", "ReelsTips"],
    TikTok: ["TikTokBusiness", "AItools", "StartupTok", "FounderTok", "LearnOnTikTok", "ContentTips"],
    Threads: ["Threads", "Founders", "BuildInPublic", "AI"],
    Telegram: ["Founders", "StartupCommunity", "AIUpdates", "Web3"],
    WhatsApp: ["Business", "Founders", "AI", "Startup"],
  };

  let pool = [...base[platform]];

  if (lower.includes("pi")) pool.push("PiNetwork", "Web3", "DigitalEconomy");
  if (lower.includes("egypt") || lower.includes("alexandria")) pool.push("Egypt", "MENA", "Alexandria");
  if (lower.includes("content") || lower.includes("marketing")) pool.push("ContentStrategy", "SocialMedia");
  if (lower.includes("video") || lower.includes("tiktok")) pool.push("ShortVideo", "VideoMarketing");
  if (lower.includes("founder") || lower.includes("startup")) pool.push("FounderLife", "Entrepreneurship");

  const limits: Record<Platform, [number, number]> = {
    X: [2, 3],
    LinkedIn: [3, 5],
    Facebook: [2, 4],
    Instagram: [5, 7],
    TikTok: [4, 6],
    Threads: [2, 3],
    Telegram: [2, 4],
    WhatsApp: [1, 3],
  };

  const [min, max] = limits[platform];
  const count = rand(min, max);

  return [...new Set(pool)].sort(() => 0.5 - Math.random()).slice(0, count);
}

function dynamicCTA() {
  return pick([
    "What would you improve?",
    "Would you test this?",
    "Comment your honest take.",
    "Share this with another founder.",
    "Save this for your next post.",
    "Try it and tell me what feels weak.",
    "Agree or disagree?",
    "Want the exact workflow?",
    "Drop a comment if you want early access.",
    "Should I make a video version?",
  ]);
}

function firstLine(topic: string, platform: Platform) {
  const hooks: Record<Platform, string[]> = {
    X: [
      `Hot take: ${topic}`,
      `Nobody talks enough about ${topic}`,
      `Founder lesson: ${topic}`,
    ],
    LinkedIn: [
      `I learned something important about ${topic}.`,
      `Most founders misunderstand ${topic}.`,
      `Here is the honest lesson behind ${topic}.`,
    ],
    Facebook: [
      `Let’s talk honestly about ${topic}.`,
      `I have been thinking about ${topic}.`,
      `This may help founders dealing with ${topic}.`,
    ],
    Instagram: [
      `✨ ${topic}`,
      `Save this if you care about ${topic}`,
      `A quick reminder about ${topic}`,
    ],
    TikTok: [
      `Stop scrolling if you care about ${topic}`,
      `Nobody tells you this about ${topic}`,
      `3 seconds to understand ${topic}`,
    ],
    Threads: [
      `${topic}. Quick thought:`,
      `A short note on ${topic}:`,
      `Founders: ${topic}`,
    ],
    Telegram: [
      `TEOS update: ${topic}`,
      `Community note: ${topic}`,
      `Important founder update: ${topic}`,
    ],
    WhatsApp: [
      `Quick founder note: ${topic}`,
      `Sharing this because it matters: ${topic}`,
      `Useful idea: ${topic}`,
    ],
  };

  return pick(hooks[platform]);
}

function platformBody(topic: string, platform: Platform) {
  if (platform === "TikTok") {
    return `${firstLine(topic, platform)}

Hook:
${topic}

3 quick beats:
1. Show the problem.
2. Reveal the insight.
3. End with a clear CTA.

This is built for short-form attention.`;
  }

  if (platform === "LinkedIn") {
    return `${firstLine(topic, platform)}

The mistake most people make is treating content like decoration.

But content is distribution.
Distribution creates trust.
Trust creates customers.

${topic} is not just another idea. It is a signal that founder-led products can move faster when they listen, ship, and improve in public.

${dynamicCTA()}`;
  }

  if (platform === "Instagram") {
    return `${firstLine(topic, platform)}

Attention is earned in the first line.
Trust is built in the story.
Action happens when the CTA is clear.

${topic}

Create simply. Publish consistently. Improve from feedback.

${dynamicCTA()}`;
  }

  if (platform === "X") {
    return `${firstLine(topic, platform)}

Execution beats noise.

${topic}

Small teams can move fast when they build in public, listen hard, and ship before perfection.

${dynamicCTA()}`;
  }

  return `${firstLine(topic, platform)}

${pick([
    "Execution beats ideas when distribution is clear.",
    "The market rewards clarity, speed, and consistency.",
    "Founder-led products win when they listen and improve fast.",
  ])}

${topic}

${dynamicCTA()}`;
}

function calculateVisibilityScore(topic: string, platform: Platform, post: string, hashtags: string[]) {
  let score = 65;

  if (post.length > 120) score += 6;
  if (post.includes("?")) score += 5;
  if (hashtags.length >= 3) score += 5;
  if (topic.length > 25) score += 4;
  if (platform === "TikTok" || platform === "Instagram") score += 3;
  if (platform === "LinkedIn" && post.split("\n").length >= 5) score += 4;

  score += rand(-5, 12);

  return Math.max(55, Math.min(98, score));
}

function imagePrompt(topic: string, platform: Platform) {
  return `Premium ${platform} visual for: "${topic}". Black luxury background, gold and royal purple accents, Egyptian AI aesthetic, Eye of Horus inspired, high contrast, clean typography, modern SaaS launch style.`;
}

function videoScript(topic: string, platform: Platform) {
  if (platform !== "TikTok") return "";

  return `Hook: ${topic}

Scene 1: Show the problem in one sentence.
Scene 2: Show the insight or transformation.
Scene 3: Show the result or product screen.

Caption: ${topic}

CTA: Comment if you want to test it.`;
}

function fallbackPost(topic: string, rawPlatform: string) {
  const platform = normalizePlatform(rawPlatform);
  const hashtags = getHashtags(topic, platform);
  const post = platformBody(topic, platform);
  const score = calculateVisibilityScore(topic, platform, post, hashtags);
  const cta = dynamicCTA();

  return {
    post,
    hashtags,
    visibilityScore: score,
    bestTime: getBestTime(platform),
    suggestedCTA: cta,
    checklist: [
      "Strong hook",
      "Platform optimized",
      "CTA included",
      "Trend hashtags included",
    ],
    platform,
    platformIcon: platformIcon(platform),
    fallback: true,
    imagePrompt: imagePrompt(topic, platform),
    videoScript: videoScript(topic, platform),
    imageUrl: null,
    insights: {
      visibilityScore: score,
      bestTime: getBestTime(platform),
      suggestedCTA: cta,
      checklist: [
        "Strong hook",
        "Platform optimized",
        "CTA included",
        "Trend hashtags included",
      ],
    },
  };
}

async function getEmailFromSession(req: NextRequest): Promise<string | null> {
  const lib: any = sessionLib;

  const possibleFns = [
    "getSessionUser",
    "getSession",
    "getCurrentUser",
    "getCurrentUserEmail",
    "requireUser",
    "readSession",
    "verifySession",
  ];

  for (const fn of possibleFns) {
    if (typeof lib[fn] === "function") {
      try {
        const result = await lib[fn](req);
        const email =
          result?.email ||
          result?.user?.email ||
          result?.session?.email ||
          result?.payload?.email;

        if (email) return email;
      } catch {}
    }
  }

  const cookieStore = cookies();
  const raw =
    cookieStore.get("teos_session")?.value ||
    req.cookies.get("teos_session")?.value;

  if (!raw) return null;

  try {
    const decoded = decodeURIComponent(raw);

    try {
      const parsed = JSON.parse(decoded);
      return parsed?.email || parsed?.user?.email || null;
    } catch {}

    try {
      const json = Buffer.from(decoded, "base64").toString("utf8");
      const parsed = JSON.parse(json);
      return parsed?.email || parsed?.user?.email || null;
    } catch {}

    try {
      const parts = decoded.split(".");
      if (parts.length >= 2) {
        const payload = Buffer.from(parts[1], "base64url").toString("utf8");
        const parsed = JSON.parse(payload);
        return parsed?.email || parsed?.user?.email || null;
      }
    } catch {}
  } catch {}

  return null;
}

async function openAI(topic: string, platform: string, tone: string, goal: string) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY missing");
    return fallbackPost(topic, platform);
  }

  const prompt = `
Return ONLY valid JSON with this exact shape:
{
  "post": "string",
  "hashtags": ["tag1", "tag2", "tag3"],
  "visibilityScore": 88,
  "bestTime": "string",
  "suggestedCTA": "string",
  "checklist": ["string", "string", "string"],
  "imagePrompt": "string",
  "videoScript": "string",
  "insights": {
    "visibilityScore": 88,
    "bestTime": "string",
    "suggestedCTA": "string",
    "checklist": ["string", "string", "string"]
  }
}

Topic: ${topic}
Platform: ${platform}
Tone: ${tone}
Goal: ${goal}

Rules:
- Never reuse generic template lines.
- Never say "This is your moment to turn attention into action."
- Make the output platform-specific.
- Use fresh hashtags for this topic.
- Visibility score must be realistic between 55 and 98.
- Best time must match the platform.
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
          {
            role: "system",
            content:
              "You are Teos AI Engine. Return valid JSON only. Create fresh, platform-specific content every time.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const raw = await r.text();

    if (!r.ok) {
      console.error("OPENAI_ERROR", {
        status: r.status,
        model: MODEL,
        body: raw,
      });
      return fallbackPost(topic, platform);
    }

    const data = JSON.parse(raw);
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("OPENAI_EMPTY_CONTENT", data);
      return fallbackPost(topic, platform);
    }

    try {
      const parsed = JSON.parse(content);
      const safe = fallbackPost(topic, platform);
      const p = normalizePlatform(platform);

      const score =
        parsed.visibilityScore ||
        parsed.insights?.visibilityScore ||
        safe.visibilityScore;

      const bestTime =
        parsed.bestTime ||
        parsed.insights?.bestTime ||
        safe.bestTime;

      const suggestedCTA =
        parsed.suggestedCTA ||
        parsed.insights?.suggestedCTA ||
        safe.suggestedCTA;

      const checklist = Array.isArray(parsed.checklist)
        ? parsed.checklist
        : Array.isArray(parsed.insights?.checklist)
        ? parsed.insights.checklist
        : safe.checklist;

      return {
        post: parsed.post || safe.post,
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : safe.hashtags,
        visibilityScore: score,
        bestTime,
        suggestedCTA,
        checklist,
        imagePrompt: parsed.imagePrompt || safe.imagePrompt,
        videoScript: parsed.videoScript || safe.videoScript,
        platform: p,
        platformIcon: platformIcon(p),
        fallback: false,
        imageUrl: null,
        insights: {
          visibilityScore: score,
          bestTime,
          suggestedCTA,
          checklist,
        },
      };
    } catch {
      console.error("OPENAI_INVALID_JSON", content);
      return fallbackPost(topic, platform);
    }
  } catch (err: any) {
    console.error("OPENAI_FATAL", err?.message || err);
    return fallbackPost(topic, platform);
  }
}

export async function POST(req: NextRequest) {
  try {
    const email = await getEmailFromSession(req);

    if (!email) {
      return response({ success: false, error: "Unauthorized" }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

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

    const userAny = user as any;

    const plan = user.plan || "starter";
    const used = Number(
      userAny.postsUsed ||
        userAny.generationsUsed ||
        userAny.usageCount ||
        userAny.postsGenerated ||
        0
    );

    if (plan === "starter" && used >= 5) {
      return response({ success: false, error: "Starter limit reached" }, 403);
    }

    const agencyPlans = ["agency", "agency_yearly", "agency_lifetime", "founder"];

    if (platform === "LinkedIn" && !agencyPlans.includes(plan)) {
      return response(
        { success: false, error: "LinkedIn requires Agency plan" },
        403
      );
    }

    const generated = await openAI(topic, platform, tone, goal);
    const safeFallback = fallbackPost(topic, platform);

    try {
      await (prisma.user.update as any)({
        where: { id: user.id },
        data: {
          postsUsed: {
            increment: 1,
          },
        },
      });
    } catch {
      console.warn("Usage counter skipped: postsUsed field not in Prisma schema");
    }

    const visibilityScore =
      generated.visibilityScore ||
      generated.insights?.visibilityScore ||
      safeFallback.visibilityScore;

    const bestTime =
      generated.bestTime ||
      generated.insights?.bestTime ||
      safeFallback.bestTime;

    const suggestedCTA =
      generated.suggestedCTA ||
      generated.insights?.suggestedCTA ||
      safeFallback.suggestedCTA;

    const checklist = Array.isArray(generated.checklist)
      ? generated.checklist
      : Array.isArray(generated.insights?.checklist)
      ? generated.insights.checklist
      : safeFallback.checklist;

    return response({
      success: true,
      plan,
      used: used + 1,
      post: generated.post || safeFallback.post,
      hashtags: Array.isArray(generated.hashtags)
        ? generated.hashtags
        : safeFallback.hashtags,
      imageUrl: generated.imageUrl || null,
      imagePrompt: generated.imagePrompt || safeFallback.imagePrompt,
      videoScript: generated.videoScript || safeFallback.videoScript,
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
  } catch (err: any) {
    console.error("GENERATE_ROUTE_FATAL", err?.message || err);

    return response(
      {
        success: false,
        error: "Generation failed",
      },
      500
    );
  }
}