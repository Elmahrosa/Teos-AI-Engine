import { describe, it, expect } from "vitest";
import {
  normalizePlan,
  canGenerate,
  canUseLinkedIn,
  getRemainingPosts,
  isAtLimit,
} from "../limits";

describe("normalizePlan", () => {
  it("returns starter for null", () => {
    expect(normalizePlan(null)).toBe("starter");
  });

  it("returns starter for undefined", () => {
    expect(normalizePlan(undefined)).toBe("starter");
  });

  it("returns pro for pro", () => {
    expect(normalizePlan("pro")).toBe("pro");
  });

  it("returns agency for agency", () => {
    expect(normalizePlan("agency")).toBe("agency");
  });

  it("handles case-insensitive input", () => {
    expect(normalizePlan("PRO")).toBe("pro");
    expect(normalizePlan("Agency")).toBe("agency");
  });

  it("defaults unknown plans to starter", () => {
    expect(normalizePlan("enterprise")).toBe("starter");
  });
});

describe("canGenerate", () => {
  it("returns true for admin", () => {
    expect(canGenerate("starter", 100, true)).toBe(true);
  });

  it("returns true for lifetime", () => {
    expect(canGenerate("starter", 100, false, true)).toBe(true);
  });

  it("returns true when under limit", () => {
    expect(canGenerate("starter", 3)).toBe(true);
  });

  it("returns false when at limit", () => {
    expect(canGenerate("starter", 5)).toBe(false);
  });

  it("returns false when over limit", () => {
    expect(canGenerate("pro", 60)).toBe(false);
  });

  it("allows pro plan up to 50", () => {
    expect(canGenerate("pro", 49)).toBe(true);
    expect(canGenerate("pro", 50)).toBe(false);
  });

  it("allows agency plan up to 200", () => {
    expect(canGenerate("agency", 199)).toBe(true);
    expect(canGenerate("agency", 200)).toBe(false);
  });
});

describe("canUseLinkedIn", () => {
  it("returns true for admin", () => {
    expect(canUseLinkedIn("starter", true)).toBe(true);
  });

  it("returns true for lifetime", () => {
    expect(canUseLinkedIn("starter", false, true)).toBe(true);
  });

  it("returns true for agency", () => {
    expect(canUseLinkedIn("agency")).toBe(true);
  });

  it("returns false for starter", () => {
    expect(canUseLinkedIn("starter")).toBe(false);
  });

  it("returns false for pro", () => {
    expect(canUseLinkedIn("pro")).toBe(false);
  });
});

describe("getRemainingPosts", () => {
  it("returns null for admin", () => {
    expect(getRemainingPosts("starter", 10, true)).toBe(null);
  });

  it("returns null for lifetime", () => {
    expect(getRemainingPosts("starter", 10, false, true)).toBe(null);
  });

  it("returns remaining for starter", () => {
    expect(getRemainingPosts("starter", 3)).toBe(2);
  });

  it("returns 0 when at limit", () => {
    expect(getRemainingPosts("pro", 50)).toBe(0);
  });

  it("returns remaining for agency", () => {
    expect(getRemainingPosts("agency", 150)).toBe(50);
  });

  it("never returns negative", () => {
    expect(getRemainingPosts("starter", 100)).toBe(0);
  });
});

describe("isAtLimit", () => {
  it("returns false for admin", () => {
    expect(isAtLimit("starter", 100, true)).toBe(false);
  });

  it("returns false for lifetime", () => {
    expect(isAtLimit("starter", 100, false, true)).toBe(false);
  });

  it("returns false when under limit", () => {
    expect(isAtLimit("pro", 10)).toBe(false);
  });

  it("returns true when at limit", () => {
    expect(isAtLimit("starter", 5)).toBe(true);
  });

  it("returns true when over limit", () => {
    expect(isAtLimit("agency", 250)).toBe(true);
  });
});
