import { randomUUID } from "crypto";
import { BillingStatus, Prisma, UserPlan, UserStatus } from "@prisma/client";
import { prisma } from "./prisma";

export type { UserPlan, UserStatus, BillingStatus };

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      posts: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      status: true,
      trialStart: true,   // ✅ ensure trialStart is always available
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  plan?: UserPlan;
  status?: UserStatus;
  trialStart?: Date | null;
}) {
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      name: data.name,
      plan: data.plan ?? "starter",
      status: data.status ?? "trial",
      trialStart: data.trialStart ?? new Date(),
    },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      status: true,
      trialStart: true,
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function updateUserByEmail(
  email: string,
  updates: {
    name?: string;
    plan?: UserPlan;
    status?: UserStatus;
    trialStart?: Date | null;
  }
) {
  return prisma.user.update({
    where: { email: email.toLowerCase() },
    data: updates,
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      status: true,
      trialStart: true,
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function appendPost(
  email: string,
  data: { content: string; platform: string }
) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) return null;

  return prisma.post.create({
    data: {
      userId: user.id,
      content: data.content,
      platform: data.platform,
    },
  });
}

export async function logBillingEvent(data: {
  externalEventId?: string | null;
  invoiceId?: string | null;
  status: BillingStatus;
  plan?: UserPlan | null;
  provider?: string;
  payload: Prisma.InputJsonValue;
  userEmail?: string | null;
}) {
  const user = data.userEmail
    ? await prisma.user.findUnique({
        where: { email: data.userEmail.toLowerCase() },
      })
    : null;

  const eventKey =
    data.externalEventId || `tap:${data.invoiceId || randomUUID()}`;

  return prisma.billingEvent.upsert({
    where: { externalEventId: eventKey },
    update: {
      invoiceId: data.invoiceId ?? undefined,
      status: data.status,
      plan: data.plan ?? undefined,
      payload: data.payload,
      userId: user?.id,
    },
    create: {
      provider: data.provider ?? "tap",
      externalEventId: eventKey,
      invoiceId: data.invoiceId ?? null,
      status: data.status,
      plan: data.plan ?? null,
      payload: data.payload,
      userId: user?.id,
    },
  });
}
