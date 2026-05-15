import { NextRequest, NextResponse } from "next/server";

const TOTAL_SEATS = 50;
const FALLBACK_TAKEN = 37;

async function kvGet(key: string): Promise<string | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.result ?? null;
  } catch {
    return null;
  }
}

async function kvIncr(key: string): Promise<number | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/incr/${key}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.result === "number" ? data.result : null;
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest) {
  const raw = await kvGet("lifetime_seats_taken");
  const taken = raw !== null ? Math.min(parseInt(raw, 10), TOTAL_SEATS) : FALLBACK_TAKEN;
  const left = TOTAL_SEATS - taken;

  return NextResponse.json(
    {
      taken,
      total: TOTAL_SEATS,
      left: Math.max(0, left),
      pct: Math.round((taken / TOTAL_SEATS) * 100),
      soldOut: left <= 0,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-internal-key");
  if (!process.env.INTERNAL_KEY || secret !== process.env.INTERNAL_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newValue = await kvIncr("lifetime_seats_taken");
  if (newValue === null) {
    return NextResponse.json({ error: "KV unavailable" }, { status: 503 });
  }

  return NextResponse.json({
    taken: newValue,
    total: TOTAL_SEATS,
    left: Math.max(0, TOTAL_SEATS - newValue),
  });
}
