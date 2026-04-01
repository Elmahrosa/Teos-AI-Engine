import { Resend } from "resend";

export async function sendWelcomeEmail(email: string, name: string, plan: string) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return { skipped: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Welcome to X-Teos Pro ${plan === "starter" ? "" : plan.toUpperCase()}`.trim(),
    html: `
      <h2>Hi ${name}</h2>
      <p>Your account is active on the <strong>${plan}</strong> plan.</p>
      <p><a href="${process.env.APP_URL || "http://localhost:3000"}/dashboard">Open dashboard</a></p>
    `,
  });
}
