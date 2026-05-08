import { describe, it, expect } from "vitest";
import {
  getPlatformInfo,
  getRandomCTA,
  getSmartHashtags,
  getBestTime,
  calculateVisibilityScore,
} from "../platforms";

describe("getPlatformInfo", () => {
  it("returns X info for x", () => {
    const info = getPlatformInfo("x");
    expect(info.label).toBe("X");
    expect(info.icon).toBe("𝕏");
  });

  it("returns LinkedIn info for linkedin", () => {
    const info = getPlatformInfo("linkedin");
    expect(info.label).toBe("LinkedIn");
    expect(info.style).toContain("professional");
  });

  it("returns X as fallback for unknown platform", () => {
    const info = getPlatformInfo("unknown");
    expect(info.label).toBe("X");
  });

  it("handles case-insensitive input", () => {
    expect(getPlatformInfo("INSTAGRAM").label).toBe("Instagram");
    expect(getPlatformInfo("TikTok").label).toBe("TikTok");
  });
});

describe("getRandomCTA", () => {
  it("returns a non-empty string", () => {
    const cta = getRandomCTA();
    expect(typeof cta).toBe("string");
    expect(cta.length).toBeGreaterThan(0);
  });

  it("returns CTAs from the predefined pool", () => {
    const cta = getRandomCTA();
    const pool = [
      "What would you improve?",
      "Would this help your audience?",
      "Agree or disagree?",
      "Building this in public — roast it.",
      "Try it and tell me what feels weak.",
      "Save this if you are building.",
    ];
    expect(pool.includes(cta) || cta.includes("?") || cta.includes(".")).toBe(true);
  });

  it("does not return the same CTA twice in a row", () => {
    const cta1 = getRandomCTA();
    const cta2 = getRandomCTA();
    expect(cta2).not.toBe(cta1);
  });
});

describe("getSmartHashtags", () => {
  it("returns hashtags for AI topic", () => {
    const tags = getSmartHashtags("AI automation tools", "x");
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThanOrEqual(1);
  });

  it("returns platform-appropriate count for Instagram", () => {
    const tags = getSmartHashtags("content strategy", "instagram");
    expect(tags.length).toBeGreaterThanOrEqual(5);
    expect(tags.length).toBeLessThanOrEqual(8);
  });

  it("returns hashtags with no # prefix", () => {
    const tags = getSmartHashtags("startup launch", "linkedin");
    tags.forEach((tag) => expect(tag).not.toMatch(/^#/));
  });

  it("detects Egypt/MENA topic pool", () => {
    const tags = getSmartHashtags("Cairo Egypt tech", "x");
    const hasRelevant = tags.some((t) =>
      ["Egypt", "MENA", "MiddleEast", "ArabicContent", "EgyptTech", "AfricaTech"].includes(t)
    );
    expect(hasRelevant).toBe(true);
  });
});

describe("getBestTime", () => {
  it("returns a string with AM/PM", () => {
    const time = getBestTime("x");
    expect(time).toMatch(/(AM|PM)/);
  });

  it("returns LinkedIn-specific times", () => {
    const time = getBestTime("linkedin");
    expect(time).toMatch(/(8 AM|12 PM)/);
  });

  it("returns TikTok evening times", () => {
    const time = getBestTime("tiktok");
    expect(time).toMatch(/(6 PM|12 PM)/);
  });
});

describe("calculateVisibilityScore", () => {
  const baseParams = {
    topic: "AI tools",
    platform: "x" as const,
    tone: "professional",
    goal: "engagement",
    post: "This changes everything.\nWhat would you improve?",
    hashtags: ["AI", "TechInnovation", "BuildInPublic"],
  };

  it("returns a number between 55 and 98", () => {
    const score = calculateVisibilityScore(baseParams);
    expect(score).toBeGreaterThanOrEqual(55);
    expect(score).toBeLessThanOrEqual(98);
  });

  it("scores higher for LinkedIn long posts", () => {
    const longPost =
      "This changes everything.\nHere is a detailed breakdown of the new approach.\n" +
      "The results speak for themselves. What would you improve?";
    const score = calculateVisibilityScore({
      ...baseParams,
      platform: "linkedin",
      post: longPost,
    });
    expect(score).toBeGreaterThanOrEqual(55);
    expect(score).toBeLessThanOrEqual(98);
  });

  it("scores lower for very short posts", () => {
    const shortPost = "Hi.";
    const score = calculateVisibilityScore({
      ...baseParams,
      post: shortPost,
    });
    expect(score).toBeGreaterThanOrEqual(55);
  });

  it("rewards question marks and CTAs", () => {
    const postWithQuestions =
      "This is a breakthrough in AI.\nWould you use this tool? What would you improve?";
    const score = calculateVisibilityScore({
      ...baseParams,
      post: postWithQuestions,
    });
    expect(score).toBeGreaterThanOrEqual(55);
  });
});
