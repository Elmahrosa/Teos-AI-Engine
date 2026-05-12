import { isAdminEmail } from "./access";

export function isTrialExpired(data: {
  trialEndsAt: Date | null;
  status: string;
  email: string;
}): boolean {
  if (isAdminEmail(data.email)) return false;
  if (data.status === "blocked") return true;
  if (data.status !== "trial") return false;
  if (!data.trialEndsAt) return true;
  return new Date() > new Date(data.trialEndsAt);
}