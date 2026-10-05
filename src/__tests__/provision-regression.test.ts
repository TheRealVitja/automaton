import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { provision } from "../identity/provision.js";
import type { ChainIdentity } from "../identity/chain.js";

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

describe("SIWS authentication domain", () => {
  it.each([
    ["https://api.conway.tech", "api.conway.tech"],
    ["https://auth.example.com:8443", "auth.example.com:8443"],
  ])("signs the API authority for %s", async (apiUrl, domain) => {
    const signMessage = vi.fn().mockResolvedValue("test-signature");
    const identity = {
      address: "11111111111111111111111111111111", chainType: "solana", signMessage,
    } as unknown as ChainIdentity;
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{"nonce":"s123456789"}'))
      .mockResolvedValueOnce(new Response('{"error":"Invalid signature"}', { status: 401 }));
    await expect(provision(apiUrl, identity)).rejects.toThrow("SIWS verification failed: 401");
    const body = JSON.parse(vi.mocked(fetch).mock.calls[1][1]!.body as string);
    expect(body.chain_type).toBe("solana");
    expect(body.message).toMatch(new RegExp(`^${domain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} wants you to sign in`));
    expect(body.message).toContain(`URI: ${apiUrl}/v1/auth/verify`);
    expect(body.signature).toBe("test-signature");
    expect(signMessage).toHaveBeenCalledWith(body.message);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("preserves the EVM SIWE application domain", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{"nonce":"e123456789"}'))
      .mockResolvedValueOnce(new Response('{"error":"Invalid signature"}', { status: 401 }));
    await expect(provision("https://api.conway.tech")).rejects.toThrow("SIWE verification failed: 401");
    const body = JSON.parse(vi.mocked(fetch).mock.calls[1][1]!.body as string);
    expect(body.message.startsWith("conway.tech wants you to sign in with your Ethereum account:")).toBe(true);
    expect(body.chain_type).toBeUndefined();
  });
});
