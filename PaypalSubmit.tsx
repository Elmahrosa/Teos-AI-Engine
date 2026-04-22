"use client";

import { useState } from "react";

type Props = {
  plan?: "pro" | "agency";
};

export default function PaypalSubmit({ plan = "pro" }: Props) {
  const [txId, setTxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const amounts = { pro: 29, agency: 99 };
  const amount = amounts[plan];

  const paypalLink =
    (process.env.NEXT_PUBLIC_PAYPAL_ME || "https://paypal.me/ElmahrosaTEOS") +
    `/${amount}USD`;

  async function submit() {
    if (!txId.trim()) {
      setError("Paste your PayPal Transaction ID first.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/activate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          txHash: txId.trim(),
          network: undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed. Please try again.");
        return;
      }
      setMessage(
        "✓ Payment submitted. Your upgrade will be activated within a few hours after manual verification."
      );
      setTxId("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <a
        href={paypalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-xl bg-[#0070ba] hover:bg-[#003087] py-2.5 text-center text-sm font-semibold text-white transition-colors"
      >
        Pay ${amount} with PayPal →
      </a>
      <div className="space-y-2">
        <input
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder="Paste PayPal Transaction ID (from receipt email)"
          className="w-full rounded-lg border border-white/20 bg-[#111118] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
        />
        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit payment proof"}
        </button>
      </div>
      {message && (
        <p className="text-xs text-emerald-400">{message}</p>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
