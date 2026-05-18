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
  mediaImagesLimit: number;
  mediaVideosLimit: number;
  features: string[];
  highlight: boolean;
  color: string;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free", name: "Starter", badge: "Free", price: "$0", period: "free",
    dailyLimit: 5, totalLimit: 5, platforms: 2, teamSeats: 1, dodLink: null,
    mediaImagesLimit: 0, mediaVideosLimit: 0,
    features: ["5 posts total", "X + LinkedIn only", "Basic visibility score", "Media Studio Disabled"],
    highlight: false, color: "#888",
  },
  pro_monthly: {
    id: "pro_monthly", name: "Pro Monthly", badge: "Pro", price: "$29", period: "/month",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 1, dodLink: "https://dodo.pe/checkout/pro_monthly",
    mediaImagesLimit: 50, mediaVideosLimit: 5,
    features: ["Unlimited posts", "All 7 platforms", "50 Styled Images / mo", "5 AI Videos / mo"],
    highlight: false, color: "#333",
  },
  agency_monthly: {
    id: "agency_monthly", name: "Agency Monthly", badge: "Agency", price: "$99", period: "/month",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 5, dodLink: "https://dodo.pe/checkout/agency_monthly",
    mediaImagesLimit: 200, mediaVideosLimit: 25,
    features: ["Unlimited posts", "5 team seats", "200 Styled Images / mo", "25 AI Videos / mo"],
    highlight: false, color: "#444",
  },
  pro_yearly: {
    id: "pro_yearly", name: "Pro Yearly", badge: "Pro Annual", price: "$249", period: "/year",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 1, dodLink: "https://dodo.pe/checkout/pro_yearly",
    mediaImagesLimit: 600, mediaVideosLimit: 60,
    features: ["Unlimited posts", "Save money yearly", "600 Images / year", "60 Videos / year"],
    highlight: false, color: "#555",
  },
  agency_yearly: {
    id: "agency_yearly", name: "Agency Yearly", badge: "Agency Annual", price: "$799", period: "/year",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 5, dodLink: "https://dodo.pe/checkout/agency_yearly",
    mediaImagesLimit: 2400, mediaVideosLimit: 300,
    features: ["Unlimited posts", "Team scale yearly", "2400 Images / year", "300 Videos / year"],
    highlight: false, color: "#666",
  },
  pro_lifetime: {
    id: "pro_lifetime", name: "Pro Lifetime", badge: "Pro Lifetime", price: "$149", period: "one-time",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 1, dodLink: "https://dodo.pe/checkout/pro_lifetime",
    mediaImagesLimit: 100, mediaVideosLimit: 10,
    features: ["Unlimited text forever", "Single seat", "100 Images / mo recursive", "10 Videos / mo recursive"],
    highlight: false, color: "#777",
  },
  agency_lifetime: {
    id: "agency_lifetime", name: "Founder Lifetime", badge: "Founder", price: "$349", period: "one-time",
    dailyLimit: -1, totalLimit: -1, platforms: 7, teamSeats: 5, dodLink: "https://dodo.pe/91zcmc4xi27",
    mediaImagesLimit: -1, mediaVideosLimit: -1,
    features: ["Everything in Engine — forever", "5 team seats forever", "Unlimited AI Image Stylization", "Unlimited Text-to-Video conversion"],
    highlight: true, color: "#C9A84C",
  },
};

export function getPlan(id: string | null | undefined, userEmail?: string): Plan {
  if (userEmail === "aams1969@gmail.com" || userEmail === "ayman@teosegypt.com") {
    return PLANS.agency_lifetime;
  }
  if (!id) return PLANS.free;
  const upper = id.toUpperCase().trim();
  if (upper === "FOUNDER" || upper === "ADMIN" || upper === "AGENCY_LIFETIME") {
    return PLANS.agency_lifetime;
  }
  const lower = id.toLowerCase();
  if (lower in PLANS) return PLANS[lower as PlanId];
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
