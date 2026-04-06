import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type UserPlan = "starter" | "pro" | "agency";
export type UserStatus = "trial" | "active" | "blocked";
export type BillingStatus = "paid" | "ignored" | "failed";

// USERS
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function updateUserByEmail(
  email: string,
  data: Partial<{
    plan: UserPlan;
    status: UserStatus;
    trialEndsAt: Date | null;
  }>
) {
  return prisma.user.update({
    where: { email: email.toLowerCase() },
    data,
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  plan?: UserPlan;
  status?: UserStatus;
  trialEndsAt?: Date | null;
}) {
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      plan: data.plan ?? "starter",
      status: data.status ?? "trial",
      trialEndsAt: data.trialEndsAt ?? null,
    },
  });
}

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// POSTS
export async function appendPost(data: {
  userId: string;
  content: string;
  platform: string;
  prompt: string;
}) {
  return prisma.post.create({
    data: {
      userId: data.userId,
      content: data.content,
      platform: data.platform,
      prompt: data.prompt,
    },
  });
}

// BILLING EVENTS
export async function findBillingEventByExternalEventId(externalEventId: string) {
  return prisma.billingEvent.findUnique({
    where: { externalEventId },
  });
}

export async function logBillingEvent(
  provider: string,
  externalEventId: string,
  invoiceId?: string,
  status: string = "pending",
  plan?: string,
  userId?: string,
  payload: Record<string, any> = {}
) {
  try {
    await prisma.billingEvent.create({
      data: {
        provider,
        externalEventId,
        invoiceId,
        status,
        plan,
        userId,
        payload,
      },
    });
    console.log(`✅ Logged ${provider} event ${externalEventId}`);
  } catch (error) {
    console.error("❌ Billing event log failed:", error);
  }
}
