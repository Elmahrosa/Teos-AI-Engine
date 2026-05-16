const inMemoryMap = new Map<string, { count: number; resetAt: number }>();

async function upstashCheck(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number } | null> {
  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return null;
    }

    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs}ms`),
      prefix: "teos",
    });

    const result = await ratelimit.limit(key);
    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt: Date.now() + windowMs,
    };
  } catch {
    return null;
  }
}

function inMemoryCheck(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = inMemoryMap.get(key);

  if (!record || now > record.resetAt) {
    inMemoryMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

export async function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const upstash = await upstashCheck(key, limit, windowMs);
  if (upstash) return upstash;
  return inMemoryCheck(key, limit, windowMs);
}

export function getRateLimitKey(req: Request, suffix = ""): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
  return `${ip}:${suffix}`;
}

export async function rateLimitMiddleware(
  req: Request,
  suffix = "",
  limit = 10,
  windowMs = 60_000,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = getRateLimitKey(req, suffix);
  return checkRateLimit(key, limit, windowMs);
}
