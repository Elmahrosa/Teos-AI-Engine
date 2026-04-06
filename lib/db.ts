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

// BILLING EVENTS (Tap webhook idempotency)

export async function findBillingEventByExternalEventId(
  externalEventId: string
) {
  return prisma.billingEvent.findUnique({
    where: { externalEventId },
  });
}

export async function logBillingEvent(data: {
  externalEventId: string;
  type: string;
  email?: string;
  payload?: Prisma.JsonValue;
}) {
  return prisma.billingEvent.create({
    data: {
      externalEventId: data.externalEventId,
      type: data.type,
      email: data.email,
      payload: data.payload,
    },
  });
}
// Billing events (Tap webhook idempotency)
export async function findBillingEventByExternalEventId(externalEventId: string) {
  return prisma.billingEvent.findUnique({
    where: { externalEventId },
  });
}

export async function createBillingEvent(data: {
  externalEventId: string;
  type: string;
  email?: string;
  payload?: Prisma.JsonValue;
}) {
  return prisma.billingEvent.create({
    data: {
      externalEventId: data.externalEventId,
      type: data.type,
      email: data.email,
      payload: data.payload,
    },
  });
}
=======
}
893a73f (fix: clean db.ts)