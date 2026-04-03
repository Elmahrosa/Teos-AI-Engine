import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
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

export async function createUser(data: {
  email: string;
  name: string;
  plan?: string;
  status?: string;
  trialStart?: Date;
}) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      status: true,
      trialStart: true,
    },
  });
}

export async function updateUserByEmail(
  email: string,
  data: Partial<{
    name: string;
    plan: string;
    status: string;
    trialStart: Date;
  }>
) {
  return prisma.user.update({
    where: { email: email.toLowerCase() },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      status: true,
      trialStart: true,
    },
  });
}

export async function appendPost(
  email: string,
  post: { content: string; platform: string }
) {
  return prisma.post.create({
    data: {
      content: post.content,
      platform: post.platform,
      user: { connect: { email: email.toLowerCase() } },
    },
  });
}

// List all users for admin dashboard
export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      status: true,
      trialStart: true,
      createdAt: true,
      updatedAt: true,
      posts: {
        select: { id: true }, // ✅ allows user.posts.length
      },
    },
  });
}

// Log billing events from Tap webhook
export async function logBillingEvent(data: {
  provider: string;
  externalEventId?: string;
  invoiceId?: string;
  status: string;
  plan?: string;
  payload: any;
  userId?: string;
}) {
  return prisma.billingEvent.create({
    data,
  });
}
