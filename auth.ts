import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const IS_DEV = process.env.NODE_ENV === "development";

export const authOptions: NextAuthOptions = {
  // @ts-expect-error prisma adapter type mismatch between next-auth v4 and @auth/prisma-adapter — works at runtime
  adapter: PrismaAdapter(prisma),

  providers: [
    // ── Google OAuth ──────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // ── Email Magic Link (via Resend) ─────────────────────────────
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: process.env.EMAIL_FROM ?? "noreply@teosegypt.com",
    }),

    // ── Dev-only demo login — NEVER shown in production ───────────
    ...(IS_DEV
      ? [
          CredentialsProvider({
            id: "dev-demo",
            name: "Dev Demo Login",
            credentials: {
              email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
              if (!credentials?.email) return null;
              // Upsert a throwaway user so Prisma session works locally
              const user = await prisma.user.upsert({
                where: { email: credentials.email },
                update: {},
                create: {
                  email: credentials.email,
                  name: "Dev User",
                  plan: "starter",
                },
              });
              return user;
            },
          }),
        ]
      : []),
  ],

  session: { strategy: "database" },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.plan = (user as { plan?: string }).plan ?? "starter";
        session.user.isAdmin = ADMIN_EMAILS.includes(
          (user.email ?? "").toLowerCase()
        );
        session.user.trialEndsAt = (user as { trialEndsAt?: Date | null })
          .trialEndsAt ?? null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/login?verify=1",
  },
};
