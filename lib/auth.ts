import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import { createUser, findUserByEmail } from "./db";

// ============================================================================
// TYPE AUGMENTATIONS (ambient declarations - types ONLY, no implementations)
// ============================================================================

declare module "next-auth" {
  interface User {
    id: string;
    email?: string;
    name?: string | null;
    image?: string | null;
    plan?: string;
    trialEndsAt?: string | null;
    isAdmin?: boolean;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      plan?: string;
      trialEndsAt?: string | null;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email?: string;
    plan?: string;
    trialEndsAt?: string | null;
    isAdmin?: boolean;
    dbSynced?: boolean;
  }
}

// ============================================================================
// IMPLEMENTATION CODE (outside ambient contexts - this is where functions live)
// ============================================================================

// Ensure user exists in DB
async function ensureUserExists(email: string, name?: string | null) {
  let user = await findUserByEmail(email);
  if (!user) {
    user = await createUser({
      email,
      name: name || "User",
      plan: "starter",
      trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3-day trial
    });
  }
  return user;
}

// Providers
const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Email demo sign in",
    credentials: {
      email: { label: "Email", type: "email" },
      name: { label: "Name", type: "text" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const name = credentials?.name?.trim();
      if (!email) return null;

      const user = await ensureUserExists(email, name);
      return { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        plan: user.plan,
        trialEndsAt: user.trialEndsAt,
        isAdmin: user.isAdmin,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
  providers.push(
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0",
    })
  );
}

// Auth options
export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        await ensureUserExists(user.email, user.name);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email && !token.dbSynced) {
        const dbUser = await findUserByEmail(user.email);
        if (dbUser) {
          token.id = dbUser.id;
          token.plan = dbUser.plan;
          token.trialEndsAt = dbUser.trialEndsAt
            ? new Date(dbUser.trialEndsAt).toISOString()
            : null;
          token.isAdmin = dbUser.isAdmin;
          token.dbSynced = true;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.plan = token.plan;
        session.user.trialEndsAt = token.trialEndsAt;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
};
