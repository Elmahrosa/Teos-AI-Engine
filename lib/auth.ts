import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

function makeid(): string {
  return Array.from({ length: 32 }, () =>
    Math.random().toString(36)[2]
  ).join("");
}

export const authOptions: NextAuthOptions = {
  secret: secret || makeid(),
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        try {
          const email = credentials.email.toString().trim().toLowerCase();
          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            user = await prisma.user.create({
              data: { email, name: email.split("@")[0], plan: "free" },
            });
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
            trialEndsAt: user.trialEndsAt ? user.trialEndsAt.toISOString() : null,
            isAdmin: false,
          } as any;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan;
        token.trialEndsAt = (user as any).trialEndsAt;
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).plan = token.plan;
        (session.user as any).trialEndsAt = token.trialEndsAt;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
};

export default authOptions;
