import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../route";

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  post: {
    create: vi.fn(),
  },
  $transaction: vi.fn(),
};

const mockSession = {
  getSessionEmail: vi.fn(),
};

vi.mock("@/lib/db", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/session", () => ({
  getSessionEmail: mockSession.getSessionEmail,
}));

function createMockRequest(body: Record<string, unknown>, ip = "127.0.0.1") {
  return {
    headers: {
      get: (key: string) => (key === "x-forwarded-for" ? ip : null),
    },
    json: () => Promise.resolve(body),
  } as unknown as Request;
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockSession.getSessionEmail.mockResolvedValue(null);

    const req = createMockRequest({ topic: "test" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 404 when user not found", async () => {
    mockSession.getSessionEmail.mockResolvedValue("test@example.com");
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const req = createMockRequest({ topic: "test" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("User not found");
  });

  it("returns 400 when topic is empty", async () => {
    mockSession.getSessionEmail.mockResolvedValue("test@example.com");
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      plan: "starter",
      postsUsed: 0,
      isAdmin: false,
      isLifetime: false,
    });

    const req = createMockRequest({ topic: "" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Topic required");
  });

  it("returns 403 when plan limit reached", async () => {
    mockSession.getSessionEmail.mockResolvedValue("test@example.com");
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      plan: "starter",
      postsUsed: 5,
      isAdmin: false,
      isLifetime: false,
    });

    const req = createMockRequest({ topic: "AI trends" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toContain("plan limit reached");
  });

  it("bypasses limit for admin users", async () => {
    mockSession.getSessionEmail.mockResolvedValue("admin@example.com");
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
      plan: "starter",
      postsUsed: 100,
      isAdmin: true,
      isLifetime: false,
    });
    mockPrisma.$transaction.mockResolvedValue([
      { postsUsed: 100 },
      { id: "post-1" },
    ]);

    const req = createMockRequest({ topic: "Admin test post" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("returns 403 when LinkedIn used with non-agency plan", async () => {
    mockSession.getSessionEmail.mockResolvedValue("test@example.com");
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      plan: "pro",
      postsUsed: 0,
      isAdmin: false,
      isLifetime: false,
    });

    const req = createMockRequest({ topic: "Professional update", platform: "LinkedIn" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toBe("LinkedIn requires Agency plan");
  });

  it("allows LinkedIn for agency users", async () => {
    mockSession.getSessionEmail.mockResolvedValue("agency@example.com");
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "agency-1",
      email: "agency@example.com",
      plan: "agency",
      postsUsed: 0,
      isAdmin: false,
      isLifetime: false,
    });
    mockPrisma.$transaction.mockResolvedValue([
      { postsUsed: 1 },
      { id: "post-1" },
    ]);

    const req = createMockRequest({ topic: "Industry insight", platform: "LinkedIn" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("normalizes platform from lowercase to proper case", async () => {
    mockSession.getSessionEmail.mockResolvedValue("test@example.com");
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      plan: "pro",
      postsUsed: 0,
      isAdmin: false,
      isLifetime: false,
    });
    mockPrisma.$transaction.mockResolvedValue([
      { postsUsed: 1 },
      { id: "post-1" },
    ]);

    const req = createMockRequest({ topic: "Test post", platform: "instagram" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.platform).toBe("Instagram");
  });

  it("increments postsUsed for non-admin users", async () => {
    mockSession.getSessionEmail.mockResolvedValue("test@example.com");
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      plan: "pro",
      postsUsed: 10,
      isAdmin: false,
      isLifetime: false,
    });
    mockPrisma.$transaction.mockResolvedValue([
      { postsUsed: 11 },
      { id: "post-1" },
    ]);

    const req = createMockRequest({ topic: "Test content" });
    await POST(req);

    expect(mockPrisma.$transaction).toHaveBeenCalled();
    const txCall = mockPrisma.$transaction.mock.calls[0][0];
    const updateCall = txCall.find((c: any) => c?.type === "user" || true);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { postsUsed: 11 },
    });
  });

  it("does not increment postsUsed for admin users", async () => {
    mockSession.getSessionEmail.mockResolvedValue("admin@example.com");
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
      plan: "starter",
      postsUsed: 50,
      isAdmin: true,
      isLifetime: false,
    });
    mockPrisma.$transaction.mockResolvedValue([
      { postsUsed: 50 },
      { id: "post-1" },
    ]);

    const req = createMockRequest({ topic: "Admin post" });
    await POST(req);

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "admin-1" },
      data: { postsUsed: 50 },
    });
  });
});
