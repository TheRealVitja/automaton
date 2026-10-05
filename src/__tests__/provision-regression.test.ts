import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { provision } from "../identity/provision.js";

vi.mock("../identity/wallet.js", () => ({
  getWallet: async () => ({
    account: { signMessage: async () => "0xsignature" },
    chainIdentity: { address: "0x1234567890123456789012345678901234567890", chainType: "evm" },
    chainType: "evm",
  }),
  getAutomatonDir: () => "/tmp/provision-regression",
}));

beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
afterEach(() => vi.unstubAllGlobals());

describe("single-use provisioning nonce", () => {
  it("preserves a 500 from verify without replaying the nonce", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ nonce: "a123456789" })))
      .mockResolvedValueOnce(new Response('{"error":"Database error"}', { status: 500 }))
      .mockResolvedValueOnce(new Response('{"error":"Invalid or expired nonce"}', { status: 401 }));
    await expect(provision("https://example.com")).rejects.toThrow('500 {"error":"Database error"}');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("does not replay a verify request after a network timeout", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ nonce: "b123456789" })))
      .mockRejectedValueOnce(new Error("connection lost"));
    await expect(provision("https://example.com")).rejects.toThrow("connection lost");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
