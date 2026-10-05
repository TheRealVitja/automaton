import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fixtures = vi.hoisted(() => {
  const account = { address: "0x1234567890123456789012345678901234567890" };
  return {
    account,
    config: { walletAddress: account.address, conwayApiKey: "test-key", conwayApiUrl: "https://example.com", dbPath: "/tmp/fund-test.db" },
    db: { close: vi.fn() },
    topup: vi.fn(),
  };
});
vi.mock("@conway/automaton/config.js", () => ({ loadConfig: () => fixtures.config, resolvePath: (value: string) => value }));
vi.mock("@conway/automaton/identity/wallet.js", () => ({ getWallet: async () => ({ account: fixtures.account, chainType: "evm" }) }));
vi.mock("@conway/automaton/conway/topup.js", () => ({ topupCredits: fixtures.topup, TOPUP_TIERS: [5, 25, 100, 500, 1000, 2500] }));
vi.mock("@conway/automaton/state/database.js", () => ({ createDatabase: () => fixtures.db }));

const originalArgv = process.argv;
beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  fixtures.topup.mockResolvedValue({ success: true, amountUsd: 5 });
  vi.stubGlobal("fetch", vi.fn());
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`exit:${code}`); });
});
afterEach(() => {
  process.argv = originalArgv;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const run = (...args: string[]) => {
  process.argv = ["node", "automaton-cli", "fund", ...args];
  return import("../../packages/cli/src/commands/fund.js");
};

describe("creator CLI funding", () => {
  it("self-funding uses the wallet and persistent topup guard", async () => {
    await expect(run("5.00")).rejects.toThrow("exit:0");
    expect(fixtures.topup).toHaveBeenCalledWith("https://example.com", fixtures.account, 5, undefined, fixtures.db);
    expect(fixtures.db.close).toHaveBeenCalledOnce();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("an explicit other wallet transfers existing credits", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{"status":"submitted","id":"transfer-1"}'));
    await run("5.00", "--to", "0xabcdef");
    expect(fixtures.topup).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith("https://example.com/v1/credits/transfer", expect.objectContaining({
      body: expect.stringContaining('"amount_cents":500'), redirect: "error",
    }));
  });
  it("a missing destination cannot accidentally trigger a purchase", async () => {
    await expect(run("5.00", "--to")).rejects.toThrow("requires a destination");
    expect(fixtures.topup).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects amounts beyond safe integer precision before payment", async () => {
    await expect(run("9".repeat(400))).rejects.toThrow("exit:1");
    expect(fixtures.topup).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
