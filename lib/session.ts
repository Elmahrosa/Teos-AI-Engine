import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getSessionEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

export async function setSession(_email: string): Promise<void> {
  return;
}
