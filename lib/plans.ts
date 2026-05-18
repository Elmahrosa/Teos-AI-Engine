// ─── Single source of truth for all TEOS plans ───────────────────────────────

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
  dailyLimit: number;
  totalLimit: number;
  platforms: number;
  teamSeats: number;
  dodLink: string | null;
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
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 1, dodLink: null,
    features: ["Unlimited posts", "All 7 platforms", "Advanced metrics"],
    highlight: false, color: "#333",
  },
  agency_monthly: {
    id: "agency_monthly", name: "Agency Monthly", badge: "Agency", price: "$99", period: "/month",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 5, dodLink: null,
    features: ["Unlimited posts", "5 team seats", "Priority priority"],
    highlight: false, color: "#444",
  },
  pro_yearly: {
    id: "pro_yearly", name: "Pro Yearly", badge: "Pro Annual", price: "$249", period: "/year",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 1, dodLink: null,
    features: ["Unlimited posts", "Save money yearly"],
    highlight: false, color: "#555",
  },
  agency_yearly: {
    id: "agency_yearly", name: "Agency Yearly", badge: "Agency Annual", price: "$799", period: "/year",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 5, dodLink: null,
    features: ["Unlimited posts", "Team scale yearly"],
    highlight: false, color: "#666",
  },
  pro_lifetime: {
    id: "pro_lifetime", name: "Pro Lifetime", badge: "Pro Lifetime", price: "$149", period: "one-time",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 1, dodLink: null,
    features: ["Unlimited forever", "Single seat"],
    highlight: false, color: "#777",
  },
  agency_lifetime: {
    id: "agency_lifetime", name: "Founder Lifetime", badge: "Founder", price: "$349", period: "one-time",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 5, dodLink: null,
    features: ["Everything in Engine — forever", "5 team seats forever", "Predictive scoring enabled"],
    highlight: true, color: "#C9A84C",
  },
};

export function getPlan(id: string | null | undefined): Plan {
  if (!id) return PLANS.free;
  const normalized = id.toLowerCase().trim();
  if (normalized === "founder" || normalized === "admin" || normalized === "founder lifetime") {
    return PLANS.agency_lifetime;
  }
  if (id in PLANS) return PLANS[id as PlanId];
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
  if (id === "free") return PLANS.pro_lifetime;
  return null;
}

export const FOUNDER_EMAILS = [
  "aams1969@gmail.com",
  "ayman@teosegypt.com",
] as const;

export function isFounder(email: string | null | undefined): boolean {
  if (!email) return false;
  return (FOUNDER_EMAILS as readonly string[]).includes(email.toLowerCase());
}
