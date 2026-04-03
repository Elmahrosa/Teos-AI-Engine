import { createHmac, timingSafeEqual } from "crypto";

export const TAP_INVOICES = {
  pro:
    process.env.TAP_PRO_INVOICE_LINK ||
    process.env.TAP_PRO_LINK ||
    "",
  agency:
    process.env.TAP_AGENCY_INVOICE_LINK ||
    process.env.TAP_AGENCY_LINK ||
    "",
};

export function verifyTapWebhook(
  signature: string | null,
  rawBody: string,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  const expected = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const actual = signature.replace(/^sha256=/, "");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(actual, "utf8");

  if (expectedBuffer.length !== actualBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, actualBuffer);
}

export function normalizeTapEmail(payload: any): string | null {
  return (
    payload?.customer_email ||
    payload?.customer?.email ||
    payload?.charges?.data?.[0]?.customer?.email ||
    null
  );
}

export function normalizeTapPlan(payload: any): "pro" | "agency" {
  return payload?.metadata?.plan === "agency" ? "agency" : "pro";
}

export function normalizeTapPaid(payload: any): boolean {
  return (
    payload?.status === "PAID" ||
    payload?.status === "paid" ||
    payload?.transaction?.status === "success" ||
    payload?.charges?.data?.[0]?.status === "CAPTURED"
  );
}

export function normalizeTapEventId(payload: any): string | null {
  return payload?.id || payload?.event?.id || payload?.transaction?.id || null;
}

export function normalizeTapInvoiceId(payload: any): string | null {
  return (
    payload?.invoice?.id ||
    payload?.reference?.invoice ||
    payload?.reference?.payment ||
    null
  );
}
