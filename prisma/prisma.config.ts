// prisma/prisma.config.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  adapter: process.env.DATABASE_URL, // Use your main DB URL
  // accelerateUrl: process.env.ACCELERATE_URL, // optional
});
