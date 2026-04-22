import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionEmail } from "@/lib/session";

export async function getCurrentUser() {
  const email = await getSessionEmail();
  if (!email) return null;

  return prisma.user.findUnique({
    where: { email },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;

  const normalized = email.trim().toLowerCase();
  const adminList =
    process.env.ADMIN_EMAILS ||
    process.env.ADMIN_EMAIL ||
    "";

  return adminList
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);
}