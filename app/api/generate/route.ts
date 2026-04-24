import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import * as sessionLib from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function response(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function fallbackPost(topic: string, platform: string) {
  return {
    post: `🚀 ${topic}

This is your moment to turn attention into action. Teos AI Engine helps founders, creators, and agencies create stronger content faster across ${platform}.

Start simple. Publish consistently. Grow smarter.`,
    hashtags: ["#AI", "#SaaS", "#TeosAI", "#ContentMarketing"],
    insights: {
      visibilityScore: 82,
      bestTime: "10 AM - 12 PM",
      suggestedCTA: "Ask your audience to try it today.",
      checklist: ["Strong hook", "Clear value", "CTA included", "Hashtags included"],
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
        temperature: 0.8,
        max_tokens: 900,
        messages: [
          {
            role: "system",
            content: "You are Teos AI Engine. Return valid JSON only.",
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
      return JSON.parse(content);
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
    const platform = String(body.platform || "X");
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

    if (platform.toLowerCase() === "linkedin" && !agencyPlans.includes(plan)) {
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

    return response({
      success: true,
      plan,
      used: used + 1,
      post: generated.post || safeFallback.post,
      hashtags: Array.isArray(generated.hashtags)
        ? generated.hashtags
        : safeFallback.hashtags,
      imageUrl: null,
      insights: {
        visibilityScore:
          generated.insights?.visibilityScore ||
          safeFallback.insights.visibilityScore,
        bestTime:
          generated.insights?.bestTime || safeFallback.insights.bestTime,
        suggestedCTA:
          generated.insights?.suggestedCTA ||
          safeFallback.insights.suggestedCTA,
        checklist: Array.isArray(generated.insights?.checklist)
          ? generated.insights.checklist
          : safeFallback.insights.checklist,
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