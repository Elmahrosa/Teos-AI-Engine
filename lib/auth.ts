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

      let user = await findUserByEmail(email);
      if (!user) {
        user = await createUser({ email, name, plan: "starter", status: "trial", trialStart: new Date() });
      }
      if (user.status === "blocked") return null;
      return { id: user.id, email: user.email, name: user.name };
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
    async signIn({ user }) {
      if (!user.email) return false;
      const existing = await findUserByEmail(user.email);
      if (!existing) {
        await createUser({
          email: user.email,
          name: user.name || user.email.split("@")[0],
          plan: "starter",
          status: "trial",
          trialStart: new Date(),
        });
      } else if (existing.status === "blocked") {
        return false;
      }
      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await findUserByEmail(token.email);
        if (dbUser) {
          token.plan = dbUser.plan;
          token.status = dbUser.status;
          token.trialStart = dbUser.trialStart?.toISOString() || null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        (session.user as any).plan = token.plan;
        (session.user as any).status = token.status;
        (session.user as any).trialStart = token.trialStart;
      }
      return session;
    },
  },
};
