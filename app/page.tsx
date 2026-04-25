"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [idea, setIdea] = useState("Launch a new AI SaaS product");
  const [output, setOutput] = useState("");

  const generateDemo = () => {
    setOutput(`🚀 AI That Sees What Others Miss

Struggling to get engagement?

This post is optimized across X, LinkedIn, and Instagram using TEOS AI Engine.

🔥 Try it free and generate high-performing content instantly.`);
  };

  return (
    <main className="bg-black text-white min-h-screen">

      {/* URGENCY BAR */}
      <div className="text-center text-sm bg-yellow-500 text-black py-2">
        🔥 37 / 50 Lifetime Seats Remaining — prices increase after TikTok + AI video upgrades.
      </div>

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="w-10 h-10" />
          <span className="font-bold">TEOS AI Engine</span>
        </div>

        <div className="flex gap-4 text-sm">
          <Link href="/login">Login</Link>
          <Link href="/signup" className="bg-purple-600 px-4 py-2 rounded">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-6">
        <img src="/logo.png" className="mx-auto w-28 mb-6" />

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          AI That Sees What Others Miss.
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto mb-6">
          Generate stronger content across X, Facebook, Instagram and LinkedIn — with built-in visibility scoring.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/signup" className="bg-yellow-500 text-black px-6 py-3 rounded font-semibold">
            Generate My First 5 Posts Free
          </Link>

          <a href="#demo" className="border border-gray-600 px-6 py-3 rounded">
            Watch Demo
          </a>
        </div>

        <div className="mt-4 text-purple-400 text-sm">
          π Pi Users Get 50% Launch Discount
        </div>

        <div className="mt-6">
          <Link href="/pay/pi" className="bg-purple-600 px-6 py-2 rounded text-sm">
            Pay with Pi
          </Link>
        </div>
      </section>

      {/* TRUST BLOCK */}
      <section className="text-center py-10 px-6 border-t border-gray-800 border-b border-gray-800">
        <p className="text-gray-400 text-sm">
          Built in Alexandria 🇪🇬 • Founder-led by Elmahrosa International • Early users already generating posts • Pi launch support available
        </p>
      </section>

      {/* DEMO */}
      <section id="demo" className="px-6 py-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          See TEOS In Action
        </h2>

        <div className="bg-gray-900 p-6 rounded-xl">
          <div className="text-gray-400 mb-2">Before:</div>
          <input
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full p-3 bg-black border border-gray-700 rounded mb-4"
          />

          <button
            onClick={generateDemo}
            className="bg-purple-600 px-4 py-2 rounded mb-4"
          >
            Generate
          </button>

          {output && (
            <>
              <div className="text-gray-400 mb-2">After:</div>
              <div className="bg-black p-4 rounded border border-gray-700 whitespace-pre-wrap">
                {output}
              </div>

              <div className="mt-4 text-green-400">
                Visibility Score: 92/100 🚀
              </div>

              <div className="text-yellow-400 mt-2">
                CTA Suggestion: Try it free today
              </div>
            </>
          )}
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">Hot Offers</h2>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Pro Lifetime (Dominant) */}
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-yellow-500">
            <div className="text-yellow-400 text-sm mb-2">🔥 Most Popular</div>
            <h3 className="text-xl font-bold">Pro Lifetime</h3>
            <p className="text-yellow-400 mt-2">$149</p>
            <p className="text-gray-400 text-sm mt-2">Includes all future upgrades</p>
            <a href="https://dodo.pe/relh2gradr9" className="block mt-4 bg-yellow-500 text-black py-2 rounded">
              Claim Pro Lifetime
            </a>
          </div>

          {/* Agency Lifetime */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
            <div className="text-purple-400 text-sm mb-2">Best for agencies</div>
            <h3 className="text-xl font-bold">Agency Lifetime</h3>
            <p className="text-yellow-400 mt-2">$349</p>
            <p className="text-gray-400 text-sm mt-2">
              Includes future TikTok, AI video, automation, and agency upgrades.
            </p>
            <div className="mt-4 bg-gray-700 py-2 rounded text-sm">
              Add Dodo Link
            </div>
          </div>

          {/* Pro Monthly */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold">Pro Monthly</h3>
            <p className="text-yellow-400 mt-2">$29/mo</p>
            <a href="https://dodo.pe/ljkagv2ixcr" className="block mt-4 bg-purple-600 py-2 rounded">
              Get Started
            </a>
          </div>

          {/* Agency Monthly */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold">Agency Monthly</h3>
            <p className="text-yellow-400 mt-2">$69/mo</p>
            <a href="https://dodo.pe/dbvnd9a4pp" className="block mt-4 bg-purple-600 py-2 rounded">
              Get Started
            </a>
          </div>

          {/* Pro Yearly */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold">Pro Yearly</h3>
            <p className="text-yellow-400 mt-2">$290/year</p>
            <a href="https://dodo.pe/ep9cgmojbua" className="block mt-4 bg-purple-600 py-2 rounded">
              Get Started
            </a>
          </div>

          {/* Agency Yearly */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold">Agency Yearly</h3>
            <p className="text-yellow-400 mt-2">$690/year</p>
            <a href="https://dodo.pe/79q4irl1347" className="block mt-4 bg-purple-600 py-2 rounded">
              Get Started
            </a>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-20">
        <h2 className="text-4xl font-bold mb-6">
          Start Free With 5 Posts
        </h2>

        <Link href="/signup" className="bg-purple-600 px-8 py-4 rounded text-lg">
          Get Started Now
        </Link>
      </section>

    </main>
  );
}