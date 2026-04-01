import "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string | null;
      status?: string | null;
      trialStart?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?: string | null;
    status?: string | null;
    trialStart?: string | null;
  }
}
