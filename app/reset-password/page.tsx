"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else if (data.emailSent) {
        setSuccess("Check your email for a reset link.");
      } else if (data.token) {
        router.push(`/reset-password?token=${data.token}&email=${encodeURIComponent(email.trim().toLowerCase())}`);
      } else {
        setSuccess("If an account exists, you'll receive a reset email.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password) { setError("New password is required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed");
      } else {
        setSuccess("Password reset successfully!");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("Network error. Try again.");
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
          <h1 className="text-xl font-bold mt-6">
            {token ? "Reset Password" : "Forgot Password"}
          </h1>
          <p className="text-sm text-[#8a88a0] mt-1">
            {token ? "Enter your new password" : "Enter your email to receive a reset link"}
          </p>
        </div>

        {error && <p className="text-xs text-red-400 px-1 mb-4 text-center">{error}</p>}
        {success && <p className="text-xs text-green-400 px-1 mb-4 text-center">{success}</p>}

        {token ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="New password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
            />
            <button
              type="submit"
              disabled={loading || !password}
              className="btn-teal w-full text-sm py-3 disabled:opacity-40"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
              autoFocus
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="btn-teal w-full text-sm py-3 disabled:opacity-40"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-xs text-[#5a5870]">
          <Link href="/login" className="text-gold-500 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-sm text-[#8a88a0]">Loading...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
