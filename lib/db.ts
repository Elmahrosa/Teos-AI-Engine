import { prisma } from './prisma';

export async function ensureUserExists(email: string, name?: string) {
  let user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
        plan: "free",
        status: "trial",
      },
    });
  }
  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function updateUserByEmail(email: string, data: any) {
  return prisma.user.update({ 
    where: { email: email.toLowerCase() }, 
    data 
  });
}

export async function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

// FIXED: appendPost now accepts object (matching the call)
export async function appendPost(data: { userId: string; content: string; platform: string; prompt?: string }) {
  return prisma.post.create({
    data: {
      userId: data.userId,
      content: data.content,
      platform: data.platform,
      prompt: data.prompt || "",
    }
  });
}

export async function findBillingEventByExternalEventId(id: string) {
  return null;
}

export const TAP_INVOICES = [];
export const subscribeSchema = {};
export const isAllowedOrigin = () => true;

export default prisma;
export { prisma };
