node -e "
const fs = require('fs');
const c = \`import { Prisma } from \"@prisma/client\";
import { prisma } from \"./prisma\";

export type UserPlan = \"starter\" | \"pro\" | \"agency\";
export type UserStatus = \"trial\" | \"active\" | \"blocked\";
export type BillingStatus = \"paid\" | \"ignored\" | \"failed\";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true, email: true, name: true, plan: true, status: true,
      trialEndsAt: true, createdAt: true, updatedAt: true,
      posts: { orderBy: { createdAt: 'desc' }, select: { id: true, content: true, platform: true, createdAt: true } },
    },
  });
}

export async function createUser(data: { email: string; name: string; plan?: UserPlan; status?: UserStatus; trialEndsAt?: Date; }) {
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(), name: data.name,
      ...(data.plan ? { plan: data.plan } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.trialEndsAt ? { trialEndsAt: data.trialEndsAt } : {}),
    },
    select: {
      id: true, email: true, name: true, plan: true, status: true,
      trialEndsAt: true, createdAt: true, updatedAt: true,
      posts: { orderBy: { createdAt: 'desc' }, select: { id: true, content: true, platform: true, createdAt: true } },
    },
  });
}

export async function updateUserByEmail(email: string, data: Partial<{ name: string; plan: UserPlan; status: UserStatus; trialEndsAt: Date | null; }>) {
  return prisma.user.update({
    where: { email: email.toLowerCase() }, data,
    select: {
      id: true, email: true, name: true, plan: true, status: true,
      trialEndsAt: true, createdAt: true, updatedAt: true,
    },
  });
}

export async function appendPost(email: string, post: { content: string; platform: string }) {
  return prisma.post.create({
    data: { content: post.content, platform: post.platform, user: { connect: { email: email.toLowerCase() } } },
    select: { id: true, content: true, platform: true, createdAt: true, userId: true },
  });
}

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, email: true, name: true, plan: true, status: true,
      trialEndsAt: true, createdAt: true, updatedAt: true,
      posts: { select: { id: true } },
    },
  });
}

export async function logBillingEvent(data: { provider: string; externalEventId?: string | null; invoiceId?: string | null; status: BillingStatus; plan?: UserPlan; payload: Prisma.InputJsonValue; userId?: string; }) {
  return prisma.billingEvent.create({
    data: {
      provider: data.provider, externalEventId: data.externalEventId ?? null,
      invoiceId: data.invoiceId ?? null, status: data.status,
      ...(data.plan ? { plan: data.plan } : {}),
      payload: data.payload,
      ...(data.userId ? { userId: data.userId } : {}),
    },
  });
}

export async function findBillingEventByExternalEventId(externalEventId: string) {
  return prisma.billingEvent.findFirst({
    where: { externalEventId },
    select: { id: true, externalEventId: true },
  });
}
\`;
fs.writeFileSync('lib/db.ts', c);
console.log('status OK:', c.includes('status: true'));
console.log('posts OK:', c.includes('posts: {'));
"
