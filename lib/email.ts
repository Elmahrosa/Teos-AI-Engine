import { Resend } from "resend";

export async function sendWelcomeEmail(email: string, name?: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("Resend not configured, skipping welcome email");
    return;
  }

  try {
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Teos AI Engine <support@teosegypt.com>",
      to: email,
      subject: "Welcome to Teos AI Engine — Your 5 Free Posts Are Ready",
      html: `
        <h2>Welcome ${name || ""}</h2>

        <p>Your account is active.</p>

        <h3>Starter includes:</h3>
        <ul>
          <li>5 free posts</li>
          <li>X / Facebook / Instagram generation</li>
          <li>Visibility score, best time, CTA, and checklist</li>
        </ul>

        <h3>Upgrade tiers</h3>
        <ul>
          <li>Pro — $29/month</li>
          <li>Agency — $69/month</li>
        </ul>

        <p>
          Digital access, SaaS credits, launch offers, and activated plans are generally non-refundable once provisioned.
        </p>

        <p>
          <a href="https://teos-ai-engine.vercel.app/dashboard">Open Dashboard</a>
        </p>

        <p>Support: support@teosegypt.com</p>
      `,
    });
  } catch (e) {
    console.error("WELCOME_EMAIL_FAILED", e);
  }
}