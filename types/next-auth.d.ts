import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      plan?: string;
      trialEndsAt?: string;
      isAdmin?: boolean;  // ← Add this
    } & DefaultSession["user"];
  }
}
