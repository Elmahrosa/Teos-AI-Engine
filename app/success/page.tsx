import Link from "next/link";

export default function SuccessPage({ searchParams }: { searchParams: { plan?: string } }) {
  const plan = searchParams.plan || "pro";
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-zinc-300 mb-6">
          Your <strong>{plan}</strong> plan is active. Check your email for details.
        </p>
        <Link href="/dashboard" className="inline-block bg-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-500">
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
