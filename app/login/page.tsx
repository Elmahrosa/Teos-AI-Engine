"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        name: email.split("@")[0],
        redirect: false,
      });

      if (res?.error) {
        setError("Login failed. Check your credentials.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 text-bg text-xs font-black">T</div>
            <span className="text-lg font-bold">Teos <span className="text-gold-500">AI</span></span>
          </Link>
          <h1 className="text-xl font-bold">Welcome back</h1>
          <p className="text-sm text-[#8a88a0] mt-1">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
          />

          {error && (
            <div className="p-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full text-sm py-3 disabled:opacity-40">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-[#5a5870] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gold-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
