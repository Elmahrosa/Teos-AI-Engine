import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionEmail } from "@/lib/session";

/**
 * Retrieves the current user and attaches their admin status
 */
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

  // Attach dynamic admin status based on environment variables
  return {
    ...user,
    isAdmin: isAdminEmail(user.email),
  };
}

/**
 * Protects routes by redirecting unauthenticated users
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Validates if an email is in the founder/admin list
 */
export function isAdminEmail(email?: string | null) {
  if (!email) return false;

  const normalized = email.trim().toLowerCase();
  const adminList =
    process.env.ADMIN_EMAILS ||
    process.env.ADMIN_EMAIL ||
    "aams1969@gmail.com"; // Default fallback to your founder email

  return adminList
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);
}