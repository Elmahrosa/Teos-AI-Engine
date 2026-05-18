// ─── Payment Configuration & Plan Mapping ───────────────────────────────────

export interface PaymentPlan {
  id: string;
  name: string;
  priceUSD: number;
  pricePi: number;
  dodoProductId: string;
  features: string[];
  badge?: string;
}

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: "pro_monthly",
    name: "Pro",
    priceUSD: 29,
    pricePi: 20,
    dodoProductId: "prod_pro_monthly",
    features: ["Unlimited posts", "All 7 platforms", "50 Styled Images / mo"],
    badge: "Most Popular",
  },
  {
    id: "agency_monthly",
    name: "Agency",
    priceUSD: 99,
    pricePi: 70,
    dodoProductId: "prod_agency_monthly",
    features: ["Unlimited posts", "5 team seats", "200 Styled Images / mo"],
  },
  {
    id: "pro_lifetime",
    name: "Pro Lifetime",
    priceUSD: 149,
    pricePi: 100,
    dodoProductId: "prod_pro_lifetime",
    features: ["Unlimited text forever", "100 Images / mo recursive"],
    badge: "Best Value",
  },
  {
    id: "agency_lifetime",
    name: "Agency Lifetime",
    priceUSD: 349,
    pricePi: 250,
    dodoProductId: "prod_agency_lifetime",
    features: ["Everything forever", "5 team seats", "Unlimited AI media"],
    badge: "Founder",
  },
];

export const PI_DISCOUNT_PCT = 50;

export function getPlanPriceUSD(planId: string): number {
  const plan = PAYMENT_PLANS.find((p) => p.id === planId);
  return plan?.priceUSD ?? 0;
}

export function getPlanPricePi(planId: string, piPrice: number): number {
  const plan = PAYMENT_PLANS.find((p) => p.id === planId);
  if (!plan || piPrice <= 0) return 0;
  const usdPrice = plan.priceUSD;
  const piAmount = usdPrice / piPrice;
  return Math.round(piAmount * (1 - PI_DISCOUNT_PCT / 100) * 100) / 100;
}

export function getDodoProductId(planId: string): string {
  const plan = PAYMENT_PLANS.find((p) => p.id === planId);
  return plan?.dodoProductId ?? "";
}

export function isPaidPlan(planId: string): boolean {
  return PAYMENT_PLANS.some((p) => p.id === planId);
}
