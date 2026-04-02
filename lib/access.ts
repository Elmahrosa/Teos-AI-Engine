import { differenceInDays } from "date-fns";
import type { UserPlan, UserStatus } from "./db";

export function isTrialExpired(user: {
  trialStart: Date | string | null;
  status: UserStatus;
  email?: string | null;
}): boolean {
  if (isAdminEmail(user.email)) return false;
  if (user.status !== "trial" || !user.trialStart) return false;
  return differenceInDays(new Date(), new Date(user.trialStart)) >= 3;
}

export function canUseLinkedIn(user: {
  plan: UserPlan;
  email?: string | null;
}): boolean {
  if (isAdminEmail(user.email)) return true;
  return user.plan === "agency";
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // Add your hardcoded admin email here
  allowed.push("aams1969@gmail.com");

  return allowed.includes(email.toLowerCase());
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
