import { PrismaClient } from "@prisma/client";

// Prisma reads DATABASE_URL from .env automatically via schema.prisma
// No need to pass it in the constructor
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
