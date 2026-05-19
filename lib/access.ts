export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

const PAID_PLANS = ["pro_monthly", "pro_yearly", "pro_lifetime", "agency_monthly", "agency_yearly", "agency_lifetime"];

function isPaidPlan(plan: string): boolean {
  return PAID_PLANS.includes(plan);
}

function isAgencyPlan(plan: string): boolean {
  return plan.startsWith("agency_");
}

export function canUseLinkedIn(user: { plan: string; email?: string | null }): boolean {
  if (isAdminEmail(user.email)) return true;
  return isAgencyPlan(user.plan);
}

export function hasUnlimitedAccess(user: { email?: string | null; plan: string }) {
  return isAdminEmail(user.email) || isPaidPlan(user.plan);
}

export function canUseTrial(user: { trialEndsAt: Date | string | null; email?: string | null }) {
  if (isAdminEmail(user.email)) return true;
  return !!user.trialEndsAt && new Date() < new Date(user.trialEndsAt);
}
