"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signIn("credentials", {
      email,
      name,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="mb-2 text-2xl font-bold">Sign in</h1>
        <p className="mb-6 text-sm text-zinc-400">Use the demo provider to create a starter account.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            placeholder="Email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold hover:bg-indigo-500">
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}
