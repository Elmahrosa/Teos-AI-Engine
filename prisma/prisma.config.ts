import { PrismaClient } from "@prisma/client";

// For Prisma 5+, use the connection string directly via datasourceUrl
// The adapter property is for custom drivers (e.g., libsql, pg)
export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
