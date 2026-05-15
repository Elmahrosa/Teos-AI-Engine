"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, callbackUrl: "/dashboard" });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            Teos <span className="text-gold-500">AI</span>
          </Link>
          <h1 className="text-xl font-bold mt-6">Welcome back</h1>
          <p className="text-sm text-[#8a88a0] mt-1">Sign in to your account</p>
        </div>

        {sent ? (
          <div className="text-center p-6 rounded-xl border border-gold-500/20 bg-gold-500/5">
            <p className="text-sm text-gold-500">Check your email for the sign-in link.</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="btn-teal w-full text-sm py-3 disabled:opacity-40"
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-[#5a5870] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gold-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
