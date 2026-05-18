"use client";

import { useState } from "react";
import { fetchPiPrice, calculatePiAmount } from "@/lib/pi";
import { getPlanPriceUSD } from "@/lib/payments";

interface PaymentBlockProps {
  planId: string;
  planName: string;
  priceUSD: number;
  userEmail: string;
}

export default function PaymentBlock({
  planId,
  planName,
  priceUSD,
  userEmail,
}: PaymentBlockProps) {
  const [method, setMethod] = useState<"dodo" | "pi">("dodo");
  const [piPrice, setPiPrice] = useState<number>(0);
  const [piAmount, setPiAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [txid, setTxid] = useState("");

  async function loadPiPrice() {
    try {
      const price = await fetchPiPrice();
      setPiPrice(price);
      setPiAmount(calculatePiAmount(priceUSD, price, 50));
    } catch {
      setError("Failed to fetch Pi price");
    }
  }

  async function handlePiPay() {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/payment/pi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, txid, amount: piAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  const dodoLink = `https://dodo.pe/checkout/${planId}?email=${encodeURIComponent(userEmail)}`;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-bg-card p-6 max-w-md mx-auto">
      <h3 className="text-lg font-bold">{planName}</h3>
      <p className="text-2xl font-black mt-2">${priceUSD}</p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setMethod("dodo")}
          className={`flex-1 text-sm py-2 rounded-lg transition-all ${
            method === "dodo"
              ? "bg-gold-500/15 text-gold-500 border border-gold-500/30"
              : "text-[#5a5870] border border-white/[0.06]"
          }`}
        >
          Credit Card (Dodo)
        </button>
        <button
          onClick={() => {
            setMethod("pi");
            loadPiPrice();
          }}
          className={`flex-1 text-sm py-2 rounded-lg transition-all ${
            method === "pi"
              ? "bg-gold-500/15 text-gold-500 border border-gold-500/30"
              : "text-[#5a5870] border border-white/[0.06]"
          }`}
        >
          Pay with Pi (-50%)
        </button>
      </div>

      {method === "dodo" && (
        <a
          href={dodoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-teal w-full text-sm py-3 mt-4 block text-center"
        >
          Pay ${priceUSD} via Dodo
        </a>
      )}

      {method === "pi" && (
        <div className="mt-4 space-y-3">
          {piPrice > 0 && (
            <div className="text-sm text-[#8a88a0]">
              Pi Price: ${piPrice.toFixed(4)} →{" "}
              <span className="text-gold-500 font-bold">{piAmount} Pi</span>
              <span className="text-xs ml-1">(50% discount applied)</span>
            </div>
          )}

          <input
            type="text"
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
            placeholder="Enter Pi transaction ID"
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
          />

          <button
            onClick={handlePiPay}
            disabled={loading || !txid.trim()}
            className="btn-teal w-full text-sm py-3 disabled:opacity-40"
          >
            {loading ? "Verifying..." : "Verify & Activate"}
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-3 p-2 rounded bg-red-500/10">{error}</p>
      )}
      {success && (
        <p className="text-xs text-teal-400 mt-3 p-2 rounded bg-teal-500/10">
          Plan upgraded! Refresh the page.
        </p>
      )}
    </div>
  );
}
