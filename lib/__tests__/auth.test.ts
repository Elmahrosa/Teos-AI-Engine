import { describe, it, expect, vi, beforeEach } from "vitest";
import { isAdminEmail, canUseLinkedIn } from "../auth";

vi.mock("@/lib/session", () => ({
  getSessionEmail: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe("isAdminEmail", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.ADMIN_EMAILS;
    delete process.env.ADMIN_EMAIL;
  });

  it("returns false for null email", () => {
    expect(isAdminEmail(null)).toBe(false);
  });

  it("returns false for undefined email", () => {
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isAdminEmail("")).toBe(false);
  });

  it("returns true when email matches ADMIN_EMAILS list", () => {
    process.env.ADMIN_EMAILS = "admin@test.com,ceo@test.com";
    expect(isAdminEmail("admin@test.com")).toBe(true);
    expect(isAdminEmail("ceo@test.com")).toBe(true);
  });

  it("handles case-insensitive comparison", () => {
    process.env.ADMIN_EMAILS = "Admin@Test.com";
    expect(isAdminEmail("admin@test.com")).toBe(true);
    expect(isAdminEmail("ADMIN@TEST.COM")).toBe(true);
  });

  it("returns true when email matches ADMIN_EMAIL single env", () => {
    process.env.ADMIN_EMAIL = "founder@test.com";
    expect(isAdminEmail("founder@test.com")).toBe(true);
  });

  it("prefers ADMIN_EMAILS over ADMIN_EMAIL", () => {
    process.env.ADMIN_EMAILS = "ceo@test.com";
    process.env.ADMIN_EMAIL = "founder@test.com";
    expect(isAdminEmail("ceo@test.com")).toBe(true);
    expect(isAdminEmail("founder@test.com")).toBe(false);
  });

  it("trims whitespace from emails", () => {
    process.env.ADMIN_EMAIL = "  admin@test.com  ";
    expect(isAdminEmail("  admin@test.com  ")).toBe(true);
  });
});

describe("canUseLinkedIn", () => {
  it("returns true for admin", () => {
    expect(canUseLinkedIn("starter", true)).toBe(true);
  });

  it("returns true for agency plan", () => {
    expect(canUseLinkedIn("agency", false)).toBe(true);
  });

  it("returns false for starter plan", () => {
    expect(canUseLinkedIn("starter", false)).toBe(false);
  });

  it("returns false for pro plan", () => {
    expect(canUseLinkedIn("pro", false)).toBe(false);
  });

  it("returns false for null plan", () => {
    expect(canUseLinkedIn(null, false)).toBe(false);
  });

  it("returns false for undefined plan", () => {
    expect(canUseLinkedIn(undefined, false)).toBe(false);
  });
});
