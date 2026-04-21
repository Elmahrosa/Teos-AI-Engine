import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = credentials.email.toString().trim().toLowerCase();
        const name = credentials.name?.toString().trim();

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: name || email.split("@")[0],
              plan: "free",
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          trialEndsAt: user.trialEndsAt ? user.trialEndsAt.toISOString() : null,
          isAdmin: user.isAdmin ?? false,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = user.plan;
        token.trialEndsAt = user.trialEndsAt;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).plan = token.plan as string;
        (session.user as any).trialEndsAt = token.trialEndsAt as string | null;
        (session.user as any).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default authOptions;
