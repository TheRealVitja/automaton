import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Readable } from "node:stream";
import { lookup } from "node:dns/promises";
import { request } from "node:https";
import { isPrivateAddress, publicFetch, resolvePublicUrl } from "../conway/public-http.js";
import { gitClone } from "../git/tools.js";

vi.mock("node:dns/promises", () => ({ lookup: vi.fn() }));
vi.mock("node:https", () => ({ request: vi.fn() }));

beforeEach(() => {
  vi.mocked(lookup).mockResolvedValue([{ address: "8.8.8.8", family: 4 }] as any);
});
afterEach(() => vi.clearAllMocks());

describe("public network boundary", () => {
  it.each([
    "127.0.0.1", "10.1.2.3", "172.16.2.3", "192.168.1.1", "169.254.169.254",
    "100.64.0.1", "0.0.0.0", "224.0.0.1", "[::1]", "[::ffff:7f00:1]", "[fd00::1]",
    "[fe80::1]", "localhost", "metadata.internal",
  ])("blocks %s", async (host) => {
    await expect(publicFetch(`https://${host}/`)).rejects.toThrow(/Blocked/);
    expect(request).not.toHaveBeenCalled();
  });
  it.each(["2130706433", "0x7f000001", "127.1"])("blocks normalized numeric host %s", async (host) => {
    await expect(resolvePublicUrl(`https://${host}`)).rejects.toThrow(/Blocked/);
  });
  it("rejects a public hostname resolving to a private address", async () => {
    vi.mocked(lookup).mockResolvedValue([{ address: "169.254.169.254", family: 4 }] as any);
    await expect(publicFetch("https://example.com")).rejects.toThrow(/Blocked/);
    expect(request).not.toHaveBeenCalled();
  });
  it("rejects mixed public/private DNS answers", async () => {
    vi.mocked(lookup).mockResolvedValue([
      { address: "8.8.8.8", family: 4 }, { address: "::1", family: 6 },
    ] as any);
    await expect(resolvePublicUrl("https://example.com")).rejects.toThrow(/Blocked/);
  });
  it("aborts while DNS is still unresolved", async () => {
    vi.mocked(lookup).mockReturnValue(new Promise(() => {}) as any);
    const controller = new AbortController();
    const pending = publicFetch("https://example.com", { signal: controller.signal });
    controller.abort(new Error("DNS deadline reached"));
    await expect(pending).rejects.toThrow("DNS deadline reached");
    expect(request).not.toHaveBeenCalled();
  });
  it.each(["http://example.com", "file:///etc/passwd", "https://user:password@example.com"])("rejects %s", async (url) => {
    await expect(resolvePublicUrl(url)).rejects.toThrow(/HTTPS/);
  });
  it("pins the connection to the checked address, with the original TLS hostname", async () => {
    vi.mocked(request).mockImplementation(((url, options, callback) => {
      expect(url.hostname).toBe("example.com");
      options.lookup("example.com", {}, (error, address, family) => {
        expect(error).toBeNull(); expect(address).toBe("8.8.8.8"); expect(family).toBe(4);
      });
      return { on: vi.fn(), end: () => {
        const stream = Readable.from([Buffer.from("hello")]);
        Object.assign(stream, { statusCode: 200, headers: { "content-type": "text/plain" } });
        callback(stream);
      } };
    }) as any);
    const response = await publicFetch("https://example.com");
    expect(await response.text()).toBe("hello");
    expect(lookup).toHaveBeenCalledTimes(1);
  });
  it("refuses redirects before making a second connection", async () => {
    vi.mocked(request).mockImplementation(((_url, _options, callback) => ({
      on: vi.fn(), end: () => callback(Object.assign(Readable.from([]), {
        statusCode: 302, headers: { location: "https://127.0.0.1" },
      })),
    })) as any);
    await expect(publicFetch("https://example.com")).rejects.toThrow(/redirects/);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("accepts public IPv4 and IPv6", () => {
    expect(isPrivateAddress("8.8.8.8")).toBe(false);
    expect(isPrivateAddress("2606:4700:4700::1111")).toBe(false);
  });
  it("restricts git transport and pins libcurl DNS", async () => {
    const conway = { exec: vi.fn().mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" }) };
    await gitClone(conway as any, "https://example.com/repo.git", "/tmp/repo", 2);
    const command = conway.exec.mock.calls[0][0];
    expect(command).toContain("protocol.allow=never");
    expect(command).toContain("http.followRedirects=false");
    expect(command).toContain("http.curloptResolve=example.com:443:8.8.8.8");
    expect(command).toContain("clone --depth 2 --");
  });
});
