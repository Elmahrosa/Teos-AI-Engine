// ─── Single source of truth for all TEOS plans ───────────────────────────────
// All prices, limits, and Dodo links live here. Never hardcode elsewhere.

export type PlanId =
  | "free"
  | "pro_monthly"
  | "agency_monthly"
  | "pro_yearly"
  | "agency_yearly"
  | "pro_lifetime"
  | "agency_lifetime";

export interface Plan {
  id: PlanId;
  name: string;
  badge: string;
  price: string;
  period: string;
  dailyLimit: number;   // -1 = unlimited
  totalLimit: number;   // -1 = unlimited
  platforms: number;
  teamSeats: number;
  dodLink: string | null; // null = internal /signup
  features: string[];
  highlight: boolean;
  color: string;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free", name: "Starter", badge: "Free", price: "$0", period: "free",
    dailyLimit: 5, totalLimit: 5, platforms: 2, teamSeats: 1, dodLink: null,
    features: ["5 posts total", "X + LinkedIn only", "Basic visibility score", "No credit card"],
    highlight: false, color: "#888",
  },
  pro_monthly: {
    id: "pro_monthly", name: "Pro Monthly", badge: "Pro", price: "$29", period: "/month",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 1,
    dodLink: "https://dodo.pe/ljkagv2ixcr",
    features: ["Unlimited posts", "All 7 platforms", "Full visibility scoring", "CTA suggestions", "Arabic content mode"],
    highlight: true, color: "#9B6FDF",
  },
  agency_monthly: {
    id: "agency_monthly", name: "Agency Monthly", badge: "Agency", price: "$69", period: "/month",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 5,
    dodLink: "https://dodo.pe/dbvnd9a4pp",
    features: ["Everything in Pro", "5 team seats", "Multi-brand workspace", "Batch generation", "Priority support"],
    highlight: false, color: "#C9A84C",
  },
  pro_yearly: {
    id: "pro_yearly", name: "Pro Yearly", badge: "Pro", price: "$290", period: "/year",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 1,
    dodLink: "https://dodo.pe/ep9cgmojbua",
    features: ["Everything in Pro Monthly", "2 months free", "All 7 platforms"],
    highlight: false, color: "#9B6FDF",
  },
  agency_yearly: {
    id: "agency_yearly", name: "Agency Yearly", badge: "Agency", price: "$690", period: "/year",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 5,
    dodLink: "https://dodo.pe/79q4irl1347",
    features: ["Everything in Agency Monthly", "2 months free", "5 team seats"],
    highlight: false, color: "#C9A84C",
  },
  pro_lifetime: {
    id: "pro_lifetime", name: "Pro Lifetime", badge: "Lifetime", price: "$149", period: "one-time",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 1,
    dodLink: "https://dodo.pe/relh2gradr9",
    features: [
      "Everything in Pro — forever",
      "All future upgrades included",
      "TikTok + AI video scripts — next upgrade",
      "Image generation — next upgrade",
      "Priority support forever",
    ],
    highlight: true, color: "#C9A84C",
  },
  agency_lifetime: {
    id: "agency_lifetime", name: "Agency Lifetime", badge: "Agency Lifetime", price: "$349", period: "one-time",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 5,
    dodLink: "https://dodo.pe/91zcmc4xi27",
    features: [
      "Everything in Agency — forever",
      "5 team seats forever",
      "White-label ready",
      "TikTok + AI video upgrades included",
      "Image generation included",
    ],
    highlight: false, color: "#C9A84C",
  },
};

export function getPlan(id: string | null | undefined): Plan {
  if (id && id in PLANS) return PLANS[id as PlanId];
  return PLANS.free;
}
export function isUnlimited(plan: Plan) { return plan.dailyLimit === -1; }
export function isLifetime(plan: Plan) { return plan.id === "pro_lifetime" || plan.id === "agency_lifetime"; }
export function isPaid(plan: Plan) { return plan.id !== "free"; }

export function postsRemainingToday(plan: Plan, dailyUsed: number): number | null {
  if (plan.dailyLimit === -1) return null;
  return Math.max(0, plan.dailyLimit - dailyUsed);
}
export function usagePct(plan: Plan, dailyUsed: number): number {
  if (plan.dailyLimit === -1) return 0;
  return Math.min(100, Math.round((dailyUsed / plan.dailyLimit) * 100));
}
export function upgradeTarget(id: PlanId): Plan | null {
  const map: Partial<Record<PlanId, PlanId>> = {
    free: "pro_lifetime",
    pro_monthly: "pro_lifetime",
    agency_monthly: "agency_lifetime",
    pro_yearly: "pro_lifetime",
    agency_yearly: "agency_lifetime",
  };
  const t = map[id];
  return t ? PLANS[t] : null;
}
