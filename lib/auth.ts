import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

function makeid(): string {
  return Array.from({ length: 32 }, () =>
    Math.random().toString(36)[2]
  ).join("");
}

export const authOptions: NextAuthOptions = {
  secret: secret || makeid(),
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        try {
          const email = credentials.email.toString().trim().toLowerCase();
          const password = credentials.password?.toString() || "";
          const name = credentials.name?.toString().trim() || email.split("@")[0];

          let user = await prisma.user.findUnique({ where: { email } });

          if (user) {
            if (user.passwordHash) {
              const valid = await bcrypt.compare(password, user.passwordHash);
              if (!valid) return null;
            } else if (!password) {
              return null;
            } else {
              user = await prisma.user.update({
                where: { email },
                data: { passwordHash: await bcrypt.hash(password, 10) },
              });
            }
          } else {
            if (!password) return null;
            user = await prisma.user.create({
              data: {
                email,
                name,
                plan: "free",
                passwordHash: await bcrypt.hash(password, 10),
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
            trialEndsAt: user.trialEndsAt ? user.trialEndsAt.toISOString() : null,
            isAdmin: user.isAdmin,
          } as any;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan;
        token.trialEndsAt = (user as any).trialEndsAt;
        token.isAdmin = (user as any).isAdmin;
      }
      if (account?.provider === "google" && account?.access_token) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.plan = dbUser.plan;
          token.isAdmin = dbUser.isAdmin;
        }
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
