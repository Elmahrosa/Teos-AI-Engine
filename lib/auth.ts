import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionEmail } from "@/lib/session";

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;

  const normalized = email.trim().toLowerCase();

  const listEnv = process.env.ADMIN_EMAILS;
  if (listEnv) {
    const list = listEnv.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (list.includes(normalized)) return true;
  }

  const singleEnv = process.env.ADMIN_EMAIL;
  if (singleEnv && singleEnv.trim().toLowerCase() === normalized) return true;

  return false;
}

export async function getCurrentUser() {
  const email = await getSessionEmail();
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) return null;

  return {
    ...user,
    isAdmin: user.isAdmin || isAdminEmail(user.email),
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export function canUseLinkedIn(plan?: string | null, isAdmin = false): boolean {
  if (isAdmin) return true;
  return plan === "agency";
}
