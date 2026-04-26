"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
const [email,setEmail]=useState("");
const [sent,setSent]=useState(false);

async function handleSubmit(e:any){
e.preventDefault();

try{
await fetch("/api/auth/reset-request",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({email})
});

setSent(true);

}catch{
alert("Reset request failed.");
}
}

return (
<main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
<div className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-zinc-950 p-8">

<h1 className="text-4xl font-bold mb-3">
🔑 Reset Password
</h1>

<p className="text-zinc-400 mb-6">
Enter your account email and receive a reset link.
</p>

{sent ? (
<div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4">
Reset link sent if account exists.
</div>
):(

<form onSubmit={handleSubmit} className="space-y-4">

<input
type="email"
placeholder="Your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
className="w-full rounded-xl bg-black border border-white/10 p-4"
/>

<button
type="submit"
className="w-full rounded-xl bg-purple-600 py-3 font-bold hover:bg-purple-500"
>
Send Reset Link
</button>

</form>
)}

<a
href="/login"
className="mt-6 block text-center text-zinc-400"
>
Back to login
</a>

</div>
</main>
);
}