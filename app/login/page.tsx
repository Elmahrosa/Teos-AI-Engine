"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required."); return; }
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        name: "",
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        setError("Account not found. Please sign up first.");
      } else if (res?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            Teos <span className="text-gold-500">AI</span>
          </Link>
          <h1 className="text-xl font-bold mt-6">Welcome back</h1>
          <p className="text-sm text-[#8a88a0] mt-1">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            autoFocus
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
          />

          {error && (
            <p className="text-xs text-red-400 px-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="btn-teal w-full text-sm py-3 disabled:opacity-40"
          >
            {loading ? "Signing in..." : "Sign in with email"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[#5a5870] space-y-2">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-gold-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
