// ─── Pi Network Integration: Price Fetching & Transaction Verification ─────

const PI_API_BASE = "https://api.minepi.com";

interface PiTickerResponse {
  price: number;
  currency: string;
  timestamp: number;
}

interface PiTransaction {
  txid: string;
  amount: number;
  memo: string;
  status: "pending" | "confirmed" | "failed";
  blockHeight?: number;
}

let cachedPrice = 0;
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function fetchPiPrice(): Promise<number> {
  const now = Date.now();
  if (cachedPrice > 0 && now - lastFetch < CACHE_TTL) {
    return cachedPrice;
  }

  try {
    const res = await fetch(`${PI_API_BASE}/v2/ticker`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Pi API returned ${res.status}`);
    const data: PiTickerResponse = await res.json();
    cachedPrice = data.price;
    lastFetch = now;
    return cachedPrice;
  } catch {
    if (cachedPrice > 0) return cachedPrice;
    return 31.4159;
  }
}

export async function verifyPiTransaction(
  txid: string,
): Promise<{ valid: boolean; tx?: PiTransaction }> {
  try {
    const res = await fetch(`${PI_API_BASE}/v2/transactions/${txid}`);
    if (!res.ok) return { valid: false };
    const tx: PiTransaction = await res.json();
    if (tx.status === "confirmed" && tx.blockHeight && tx.blockHeight > 0) {
      return { valid: true, tx };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

export function calculatePiAmount(
  usdPrice: number,
  piPrice: number,
  discountPct: number = 0,
): number {
  if (piPrice <= 0) return 0;
  const discountedUSD = usdPrice * (1 - discountPct / 100);
  return Math.round((discountedUSD / piPrice) * 100) / 100;
}
