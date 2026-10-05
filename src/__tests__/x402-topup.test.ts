import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { publicFetch } from "../conway/public-http.js";
import { x402Fetch } from "../conway/x402.js";
import { createDatabase } from "../state/database.js";
import { topupCredits } from "../conway/topup.js";
import { createTestDb } from "./mocks.js";
import type { AutomatonDatabase } from "../types.js";

const readContract = vi.hoisted(() => vi.fn());
vi.mock("viem", async (original) => ({
  ...await original<typeof import("viem")>(),
  createPublicClient: () => ({ readContract }),
}));
vi.mock("../conway/public-http.js", () => ({ publicFetch: vi.fn() }));
const account = {
  address: "0x1234567890123456789012345678901234567890",
  signTypedData: vi.fn().mockResolvedValue("0xsignature"),
} as any;
const requirement = () => new Response(JSON.stringify({ x402Version: 1, accepts: [{
  scheme: "exact", network: "eip155:8453", maxAmountRequired: "5000000",
  payTo: "0x1234567890123456789012345678901234567891", maxTimeoutSeconds: 300,
}] }), { status: 402 });
let db: AutomatonDatabase;
beforeEach(() => { db = createTestDb(); vi.clearAllMocks(); });
afterEach(() => db.close());

describe("x402 payment regression", () => {
  it("reads a plain-text response without consuming its body twice", async () => {
    vi.mocked(publicFetch).mockResolvedValueOnce(new Response("hello"));
    const result = await x402Fetch("https://example.com", account);
    expect(result).toMatchObject({ success: true, response: "hello" });
  });
  it("carries the same intent key on both legs and sends a paid request once", async () => {
    vi.mocked(publicFetch).mockResolvedValueOnce(requirement())
      .mockResolvedValueOnce(new Response("Database error", { status: 500 }));
    const result = await x402Fetch("https://example.com", account, "GET", undefined, undefined, 500, "evm", "intent-1");
    expect(result).toMatchObject({ success: false, status: 500, paymentAttempted: true });
    expect(publicFetch).toHaveBeenCalledTimes(2);
    for (const [, options] of vi.mocked(publicFetch).mock.calls) {
      expect(new Headers(options?.headers).get("Idempotency-Key")).toBe("intent-1");
    }
  });
  it("does not retry the unpaid mutating request", async () => {
    vi.mocked(publicFetch).mockRejectedValueOnce(new Error("timeout"));
    const result = await x402Fetch("https://example.com", account, "POST", "{}");
    expect(result).toMatchObject({ success: false, paymentAttempted: false });
    expect(publicFetch).toHaveBeenCalledTimes(1);
  });
  it("refuses an excessive topup authorization before signing", async () => {
    vi.mocked(publicFetch).mockResolvedValueOnce(requirement());
    const result = await x402Fetch("https://example.com", account, "GET", undefined, undefined, 100);
    expect(result.success).toBe(false);
    expect(account.signTypedData).not.toHaveBeenCalled();
  });
  it.each([0n, 14_000_000n])("refuses payment before signing when USDC reserve would be breached (%s)", async (balance) => {
    readContract.mockResolvedValue(balance);
    vi.mocked(publicFetch).mockResolvedValueOnce(requirement());
    const result = await x402Fetch("https://example.com", account, "GET", undefined, undefined, 500, "evm", undefined, 1000);
    expect(result.success).toBe(false);
    expect(account.signTypedData).not.toHaveBeenCalled();
    expect(publicFetch).toHaveBeenCalledTimes(1);
  });
  it("allows a payment leaving exactly the configured USDC reserve", async () => {
    readContract.mockResolvedValue(15_000_000n);
    vi.mocked(publicFetch).mockResolvedValueOnce(requirement()).mockResolvedValueOnce(new Response("ok"));
    expect((await x402Fetch("https://example.com", account, "GET", undefined, undefined, 500, "evm", undefined, 1000)).success).toBe(true);
    expect(account.signTypedData).toHaveBeenCalledOnce();
  });
});

describe("durable topup intent", () => {
  it("deduplicates concurrent bootstrap and heartbeat purchases", async () => {
    vi.mocked(publicFetch).mockResolvedValueOnce(requirement())
      .mockResolvedValueOnce(new Response(JSON.stringify({ credits_cents: 500 })));
    const results = await Promise.all([
      topupCredits("https://example.com", account, 5, undefined, db),
      topupCredits("https://example.com", account, 5, undefined, db),
    ]);
    expect(results.filter((result) => result.success)).toHaveLength(1);
    expect(account.signTypedData).toHaveBeenCalledTimes(1);
    expect(publicFetch).toHaveBeenCalledTimes(2);
  });
  it("blocks another purchase after a paid timeout across database reopen", async () => {
    vi.mocked(publicFetch).mockResolvedValueOnce(requirement()).mockRejectedValueOnce(new Error("timeout"));
    const result = await topupCredits("https://example.com", account, 5, undefined, db);
    expect(result.success).toBe(false);
    // Reloading from persistent state represents a runtime restart, rather than
    // relying on process-local promise caching.
    const dbPath = db.raw.name;
    db.close();
    db = createDatabase(dbPath);
    const second = await topupCredits("https://example.com", account, 25, undefined, db);
    expect(second.error).toContain("unresolved payment outcome");
    expect(publicFetch).toHaveBeenCalledTimes(2);
    expect(account.signTypedData).toHaveBeenCalledTimes(1);
    const row = db.raw.prepare("SELECT value FROM kv WHERE key LIKE 'topup_intent:%'").get() as any;
    expect(JSON.parse(row.value).state).toBe("unknown");
  });
  it("enforces one cooldown across different purchase triggers", async () => {
    vi.mocked(publicFetch).mockResolvedValueOnce(new Response(JSON.stringify({ credits_cents: 500 })));
    expect((await topupCredits("https://example.com", account, 5, undefined, db)).success).toBe(true);
    expect((await topupCredits("https://example.com", account, 5, undefined, db)).error).toContain("cooldown");
    expect(publicFetch).toHaveBeenCalledTimes(1);
  });
});
