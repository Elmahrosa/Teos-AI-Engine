import type { UserPlan, UserStatus } from "./db";

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(email.toLowerCase());
}

export function canUseLinkedIn(user: {
  plan: UserPlan;
  email?: string | null;
}): boolean {
  if (isAdminEmail(user.email)) return true;
  return user.plan === "agency";
}

export function hasUnlimitedAccess(user: {
  email?: string | null;
  plan: UserPlan;
}) {
  return (
    isAdminEmail(user.email) ||
    user.plan === "pro" ||
    user.plan === "agency"
  );
}

export function canUseTrial(user: {
  trialStart: Date | string | null;
  status: UserStatus;
  email?: string | null;
}) {
  if (isAdminEmail(user.email)) return true;
  return user.status === "trial" && !!user.trialStart;
}
