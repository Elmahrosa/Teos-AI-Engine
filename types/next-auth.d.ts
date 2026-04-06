import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      plan?: string;
      trialEndsAt?: string;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
  
  interface User extends DefaultUser {
    plan?: string;
    trialEndsAt?: string;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan?: string;
    trialEndsAt?: string;
    isAdmin?: boolean;
  }
}
