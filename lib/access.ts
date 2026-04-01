import { differenceInDays } from "date-fns";
import type { UserPlan, UserStatus } from "./db";

export function isTrialExpired(user: { trialStart: Date | string | null; status: UserStatus }): boolean {
  if (user.status !== "trial" || !user.trialStart) return false;
  return differenceInDays(new Date(), new Date(user.trialStart)) >= 3;
}

export function canUseLinkedIn(user: { plan: UserPlan }): boolean {
  return user.plan === "agency";
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
