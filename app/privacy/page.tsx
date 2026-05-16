export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] p-6 text-white max-w-3xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <p className="text-zinc-300">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="mt-6 space-y-4 text-sm text-zinc-400">
        <h2 className="text-lg font-semibold text-white mt-6">1. Information We Collect</h2>
        <p>We collect the following data to provide the Service:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account information: name, email address, and profile data</li>
          <li>Subscription plan and payment status (processed via Dodo Payments — we never store full card details)</li>
          <li>Content generated through the Service (posts, prompts, hashtags)</li>
          <li>Usage analytics: posts generated, platforms used, daily activity</li>
          <li>Session data via cookies for authentication (NextAuth.js)</li>
        </ul>

        <h2 className="text-lg font-semibold text-white mt-6">2. How We Use Your Data</h2>
        <p>Your data is used to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide and maintain the Service</li>
          <li>Process payments and manage subscriptions</li>
          <li>Improve AI generation quality and platform features</li>
          <li>Send service-related communications (billing, updates, security)</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-lg font-semibold text-white mt-6">3. Data Storage &amp; Sovereignty</h2>
        <p>All user data is stored on Neon PostgreSQL, hosted on AWS servers located in Europe. The Service is designed to keep your data within sovereign infrastructure. We do not transfer data to servers outside Egypt&apos;s legal jurisdiction for processing. AI generation requests may be routed through OpenAI&apos;s API (US-based) but no identifying user data is transmitted beyond the content prompt.</p>

        <h2 className="text-lg font-semibold text-white mt-6">4. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Dodo Payments</strong> — payment processing. Your payment data is handled by Dodo under their privacy policy.</li>
          <li><strong>NextAuth.js</strong> — authentication and session management.</li>
          <li><strong>Neon (PostgreSQL)</strong> — primary database hosting.</li>
          <li><strong>Vercel</strong> — hosting and deployment platform.</li>
          <li><strong>OpenAI API</strong> — AI content generation (prompts only, no personal data).</li>
          <li><strong>Upstash (Redis)</strong> — seat counter and caching.</li>
        </ul>
        <p>Each third party processes data according to its own privacy policy and applicable data protection laws.</p>

        <h2 className="text-lg font-semibold text-white mt-6">5. Data Retention</h2>
        <p>We retain your account data for as long as your account is active. Generated content is retained for service delivery. Upon account deletion, we delete or anonymize your data within 30 days, except where retention is required by law.</p>

        <h2 className="text-lg font-semibold text-white mt-6">6. Your Rights (GDPR)</h2>
        <p>If you are located in the European Economic Area (EEA), you have the following rights:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Right to access — request a copy of your data</li>
          <li>Right to rectification — correct inaccurate data</li>
          <li>Right to erasure — request deletion of your data</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
        </ul>
        <p>To exercise these rights, contact us at <a href="mailto:ayman@teosegypt.com" className="text-gold-500 hover:underline">ayman@teosegypt.com</a>. We will respond within 30 days.</p>

        <h2 className="text-lg font-semibold text-white mt-6">7. Cookies</h2>
        <p>We use essential cookies for authentication (NextAuth.js session tokens). No tracking or advertising cookies are used. You can control cookies through your browser settings.</p>

        <h2 className="text-lg font-semibold text-white mt-6">8. Data Sharing</h2>
        <p>We do not sell your personal data to third parties. We do not share your data for advertising or marketing purposes. Limited data sharing with the third-party services listed in Section 4 is required to operate the Service.</p>

        <h2 className="text-lg font-semibold text-white mt-6">9. Changes to This Policy</h2>
        <p>We may update this Privacy Policy. Material changes will be notified via email. Continued use after changes constitutes acceptance.</p>

        <h2 className="text-lg font-semibold text-white mt-6">10. Contact</h2>
        <p>For privacy-related inquiries or to exercise your rights, contact us at <a href="mailto:ayman@teosegypt.com" className="text-gold-500 hover:underline">ayman@teosegypt.com</a>.</p>
      </div>
    </main>
  );
}
