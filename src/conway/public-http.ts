import { lookup } from "node:dns/promises";
import type { LookupAddress } from "node:dns";
import { isIP } from "node:net";
import { request as httpsRequest } from "node:https";

/** Public destinations only. URL parsing normalizes numeric IPv4 spellings. */
export function isPrivateAddress(host: string): boolean {
  const address = host.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  if (address === "localhost" || /\.(localhost|local|internal)$/.test(address)) return true;
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224
      || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && [0, 168].includes(b))
      || (a === 198 && [18, 19, 51].includes(b)) || (a === 203 && b === 0);
  }
  if (isIP(address) === 6) {
    // Restrict to global unicast; also excludes mapped IPv4, ULA, link-local,
    // unspecified, loopback, multicast and translation/tunnel prefixes.
    return !/^[23][0-9a-f]{3}:/.test(address)
      || /^2001:(?:db8|0|10|20):/.test(address) || /^2002:/.test(address);
  }
  return false;
}

export async function resolvePublicUrl(raw: string, signal = AbortSignal.timeout(30_000)): Promise<{
  url: URL; address: string; family: number;
}> {
  signal.throwIfAborted();
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("Public requests require HTTPS without embedded credentials");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (isPrivateAddress(host)) throw new Error("Blocked internal network destination");
  const addresses = isIP(host)
    ? [{ address: host, family: isIP(host) }]
    : await new Promise<LookupAddress[]>((resolve, reject) => {
      const aborted = () => reject(signal.reason);
      signal.addEventListener("abort", aborted, { once: true });
      lookup(host, { all: true, verbatim: true }).then(resolve, reject).finally(() => {
        signal.removeEventListener("abort", aborted);
      });
    });
  if (!addresses.length || addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new Error("Blocked internal or unresolved network destination");
  }
  return { url, ...addresses[0] };
}

/** Resolve once and pin the socket to the validated IP, retaining TLS/SNI.
 * Redirects are refused: payment headers and credentials stay at one origin.
 */
export async function publicFetch(raw: string, options: RequestInit = {}): Promise<Response> {
  const signal = options.signal ?? AbortSignal.timeout(30_000);
  const destination = await resolvePublicUrl(raw, signal);
  signal.throwIfAborted();
  const headers: Record<string, string> = {};
  new Headers(options.headers).forEach((value, key) => { headers[key] = value; });
  delete headers.host;
  headers["accept-encoding"] = "identity";
  if (options.body != null && typeof options.body !== "string") {
    throw new Error("Public request body must be a string");
  }
  return new Promise((resolve, reject) => {
    const req = httpsRequest(destination.url, {
      method: options.method || "GET",
      headers,
      signal,
      agent: false,
      // Never perform another DNS resolution between validation and connect.
      lookup: (_hostname, _options, callback) => {
        callback(null, destination.address, destination.family);
      },
    }, (incoming) => {
      const status = incoming.statusCode ?? 502;
      if (status >= 300 && status < 400) {
        incoming.resume();
        reject(new Error("Public request redirects are disabled"));
        return;
      }
      const chunks: Buffer[] = [];
      let size = 0;
      incoming.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > 2 * 1024 * 1024) {
          incoming.destroy(new Error("Public response exceeds 2 MiB"));
          return;
        }
        chunks.push(chunk);
      });
      incoming.on("error", reject);
      incoming.on("end", () => {
        const responseHeaders = new Headers();
        for (const [name, value] of Object.entries(incoming.headers)) {
          if (value !== undefined) responseHeaders.set(name, Array.isArray(value) ? value.join(", ") : value);
        }
        const empty = options.method === "HEAD" || [204, 205, 304].includes(status);
        resolve(new Response(empty ? null : Buffer.concat(chunks), { status, headers: responseHeaders }));
      });
    });
    req.on("error", reject);
    req.end(options.body ?? undefined);
  });
}
