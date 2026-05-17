// ─── TEOS AI Engine — Single Source of Truth ─────────────────────────────────
// All plans, prices, limits, and Dodo links live here.
// NEVER hardcode these anywhere else in the codebase.
// DO NOT change Dodo links without updating this file.

import { isAdminEmail } from "./access";

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
  label: string;
  price: string;
  period: string;
  dodoPLink: string | null;
  isLifetime: boolean;
  isAgency: boolean;
  dailyPostLimit: number;
  totalPostLimit: number;
  teamSeats: number;
  badge: string | null;
  features: string[];
  color: "gold" | "purple" | "white";
  platforms: number;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Starter",
    label: "Starter",
    price: "$0",
    period: "free forever",
    dodoPLink: null,
    isLifetime: false,
    isAgency: false,
    dailyPostLimit: 5,
    totalPostLimit: 5,
    teamSeats: 1,
    badge: null,
    platforms: 2,
    features: [
      "5 posts total",
      "1 platform",
      "Basic visibility score",
      "No credit card",
    ],
    color: "white",
  },
  pro_monthly: {
    id: "pro_monthly",
    name: "Pro Monthly",
    label: "Pro",
    price: "$29",
    period: "/month",
    dodoPLink: "https://dodo.pe/ljkagv2ixcr",
    isLifetime: false,
    isAgency: false,
    dailyPostLimit: 50,
    totalPostLimit: -1,
    teamSeats: 1,
    badge: "Most Popular",
    platforms: 7,
    features: [
      "50 posts per day",
      "All 7 platforms",
      "Full visibility scoring",
      "CTA suggestions",
      "Arabic content mode",
      "Cancel anytime",
    ],
    color: "purple",
  },
  agency_monthly: {
    id: "agency_monthly",
    name: "Agency Monthly",
    label: "Agency",
    price: "$69",
    period: "/month",
    dodoPLink: "https://dodo.pe/dbvnd9a4pp",
    isLifetime: false,
    isAgency: true,
    dailyPostLimit: 200,
    totalPostLimit: -1,
    teamSeats: 5,
    badge: null,
    platforms: 7,
    features: [
      "200 posts per day",
      "All 7 platforms",
      "5 team seats",
      "Multi-brand workspace",
      "Batch generation",
      "Priority support",
    ],
    color: "white",
  },
  pro_yearly: {
    id: "pro_yearly",
    name: "Pro Yearly",
    label: "Pro",
    price: "$290",
    period: "/year",
    dodoPLink: "https://dodo.pe/ep9cgmojbua",
    isLifetime: false,
    isAgency: false,
    dailyPostLimit: 50,
    totalPostLimit: -1,
    teamSeats: 1,
    badge: "Save $58",
    platforms: 7,
    features: [
      "Everything in Pro Monthly",
      "2 months free",
      "All 7 platforms",
      "Full visibility scoring",
      "Arabic content mode",
    ],
    color: "purple",
  },
  agency_yearly: {
    id: "agency_yearly",
    name: "Agency Yearly",
    label: "Agency",
    price: "$690",
    period: "/year",
    dodoPLink: "https://dodo.pe/79q4irl1347",
    isLifetime: false,
    isAgency: true,
    dailyPostLimit: 200,
    totalPostLimit: -1,
    teamSeats: 5,
    badge: "Save $138",
    platforms: 7,
    features: [
      "Everything in Agency Monthly",
      "2 months free",
      "5 team seats",
      "Multi-brand workspace",
    ],
    color: "white",
  },
  pro_lifetime: {
    id: "pro_lifetime",
    name: "Pro Lifetime",
    label: "Pro Lifetime",
    price: "$149",
    period: "one-time",
    dodoPLink: "https://dodo.pe/relh2gradr9",
    isLifetime: true,
    isAgency: false,
    dailyPostLimit: -1,
    totalPostLimit: -1,
    teamSeats: 1,
    badge: "🔥 Best Value",
    platforms: 7,
    features: [
      "Everything in Pro — forever",
      "All future upgrades included",
      "TikTok + AI video — next upgrade",
      "Image generation — next upgrade",
      "Priority support forever",
    ],
    color: "gold",
  },
  agency_lifetime: {
    id: "agency_lifetime",
    name: "Agency Lifetime",
    label: "Agency Lifetime",
    price: "$349",
    period: "one-time",
    dodoPLink: "https://dodo.pe/91zcmc4xi27",
    isLifetime: true,
    isAgency: true,
    dailyPostLimit: -1,
    totalPostLimit: -1,
    teamSeats: 5,
    badge: "🚀 Agencies",
    platforms: 7,
    features: [
      "Everything in Agency — forever",
      "5 team seats forever",
      "White-label ready",
      "TikTok + video upgrades included",
      "Image generation included",
      "Priority support + onboarding",
    ],
    color: "purple",
  },
};

export function getPlan(id: string | null | undefined): Plan {
  if (!id || !(id in PLANS)) return PLANS.free;
  return PLANS[id as PlanId];
}

export function dailyLimitLabel(plan: Plan): string {
  if (plan.dailyPostLimit === -1) return "Unlimited";
  return `${plan.dailyPostLimit} posts/day`;
}

export function isWithinDailyLimit(plan: Plan, dailyUsed: number): boolean {
  if (plan.dailyPostLimit === -1) return true;
  return dailyUsed < plan.dailyPostLimit;
}

export function isWithinTotalLimit(plan: Plan, totalUsed: number): boolean {
  if (plan.totalPostLimit === -1) return true;
  return totalUsed < plan.totalPostLimit;
}

export function getUpgradePlan(currentPlanId: PlanId): Plan | null {
  const upgrades: Partial<Record<PlanId, PlanId>> = {
    free: "pro_lifetime",
    pro_monthly: "pro_lifetime",
    agency_monthly: "agency_lifetime",
    pro_yearly: "pro_lifetime",
    agency_yearly: "agency_lifetime",
  };
  const next = upgrades[currentPlanId];
  return next ? PLANS[next] : null;
}

export const FOUNDER_EMAILS = [
  "aams1969@gmail.com",
  "ayman@teosegypt.com",
] as const;

export function isFounder(email: string | null | undefined): boolean {
  if (!email) return false;
  return (FOUNDER_EMAILS as readonly string[]).includes(email.toLowerCase());
}

export function isUnlimited(plan: Plan) { return plan.dailyPostLimit === -1; }

export function postsRemainingToday(plan: Plan, dailyUsed: number): number | null {
  if (plan.dailyPostLimit === -1) return null;
  return Math.max(0, plan.dailyPostLimit - dailyUsed);
}

export function usagePct(plan: Plan, dailyUsed: number): number {
  if (plan.dailyPostLimit === -1) return 0;
  return Math.min(100, Math.round((dailyUsed / plan.dailyPostLimit) * 100));
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

export const PLATFORM_LABELS: Record<string, string> = {
  x: "X (Twitter)",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

export function trialExpired(trialEndsAt: Date | string | null): boolean {
  if (!trialEndsAt) return true;
  return new Date() > new Date(trialEndsAt);
}
