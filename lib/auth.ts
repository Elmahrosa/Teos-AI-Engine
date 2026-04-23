import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionEmail } from "@/lib/session";

export function isAdminEmail(email?: string | null) {
  if (!email) return false;

  const normalized = email.trim().toLowerCase();
  const adminList =
    process.env.ADMIN_EMAILS ||
    process.env.ADMIN_EMAIL ||
    "aams1969@gmail.com";

  return adminList
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);
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
    isAdmin: isAdminEmail(user.email),
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}