import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import { createUser, findUserByEmail } from "./db";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Email demo sign in",
    credentials: {
      email: { label: "Email", type: "email" },
      name: { label: "Name", type: "text" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const name = credentials?.name?.trim() || "User";

      if (!email) return null;

      const existingUser = await findUserByEmail(email);

      if (!existingUser) {
        const createdUser = await createUser({
          email,
          name,
          plan: "starter",
          status: "trial",
          trialStart: new Date(),
        });

        if (createdUser.status === "blocked") return null;

        return {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
        };
      }

      if (existingUser.status === "blocked") return null;

      return {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
  providers.push(
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0",
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await findUserByEmail(token.email);
        if (dbUser) {
          (token as any).plan = dbUser.plan;
          (token as any).status = dbUser.status;
          (token as any).trialStart = dbUser.trialStart
            ? new Date(dbUser.trialStart).toISOString()
            : null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).plan = (token as any).plan;
        (session.user as any).status = (token as any).status;
        (session.user as any).trialStart = (token as any).trialStart;
      }
      return session;
    },
  },
};