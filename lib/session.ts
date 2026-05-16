import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import crypto from "crypto";

export async function getSessionEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

export async function getSessionRole(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.role ?? null;
}

export async function createRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(48).toString("hex");
  await prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  return token;
}

export async function rotateRefreshToken(
  oldToken: string,
): Promise<string | null> {
  const existing = await prisma.refreshToken.findUnique({
    where: { token: oldToken, revokedAt: null },
  });
  if (!existing || existing.expiresAt < new Date()) return null;

  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date() },
  });

  await createAuditLog(existing.userId, "token-rotated", { oldTokenId: existing.id });

  return createRefreshToken(existing.userId);
}

export async function revokeUserRefreshTokens(userId: string): Promise<void> {
  const affected = await prisma.refreshToken.findMany({
    where: { userId, revokedAt: null },
    select: { id: true },
  });

  if (affected.length === 0) return;

  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  await createAuditLog(userId, "tokens-revoked", { count: affected.length });
}

export async function updateLastActive(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastActiveAt: new Date() },
  });
}

export async function createAuditLog(
  userId: string,
  action: string,
  metadata?: Record<string, unknown>,
  ip?: string,
): Promise<void> {
  await prisma.auditLog.create({
    data: { userId, action, metadata: (metadata ?? {}) as any, ip },
  });
}
