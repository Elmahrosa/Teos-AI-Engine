export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-zinc-300">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-6 space-y-4 text-sm text-zinc-400">
        <p>1. You agree to use X-Teos Pro responsibly and in compliance with platform policies.</p>
        <p>2. AI-generated content is yours to use, but you are responsible for its publication.</p>
        <p>3. We reserve the right to suspend accounts that violate these terms.</p>
        <p className="mt-4">Contact: ayman@teosegypt.com</p>
      </div>
    </main>
  );
}
// Copy for privacy/page.tsx with "Privacy Policy" title + basic data usage text
