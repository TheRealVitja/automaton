/**
 * automaton-cli fund <amount> [--to 0x...]
 *
 * Buy credits with wallet USDC, or transfer credits to another wallet.
 */

import { loadConfig, resolvePath } from "@conway/automaton/config.js";

const args = process.argv.slice(3);
const amount = args[0];
const toIndex = args.indexOf("--to");
const toAddress = toIndex >= 0 ? args[toIndex + 1] : undefined;
if (toIndex >= 0 && !toAddress) throw new Error("--to requires a destination address");

if (!amount) {
  console.log("Usage: automaton-cli fund <amount> [--to 0x...]");
  console.log("Examples:");
  console.log("  automaton-cli fund 5.00");
  console.log("  automaton-cli fund 500 --to 0xabc...");
  process.exit(1);
}

const config = loadConfig();
if (!config) {
  console.log("No automaton configuration found.");
  process.exit(1);
}

if (!config.conwayApiKey && toAddress && toAddress.toLowerCase() !== config.walletAddress.toLowerCase()) {
  console.log("No Conway API key found in automaton config.");
  process.exit(1);
}

const amountCents = parseAmountToCents(amount);
if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
  console.log(`Invalid amount: ${amount}`);
  process.exit(1);
}

const destination = toAddress || config.walletAddress;

if (destination.toLowerCase() === config.walletAddress.toLowerCase()) {
  // This key belongs to the agent: transferring its credits back to itself
  // cannot fund it. Convert wallet USDC to credits through the topup path.
  const { getWallet } = await import("@conway/automaton/identity/wallet.js");
  const { topupCredits, TOPUP_TIERS } = await import("@conway/automaton/conway/topup.js");
  const { createDatabase } = await import("@conway/automaton/state/database.js");
  const amountUsd = amountCents / 100;
  if (!TOPUP_TIERS.includes(amountUsd)) {
    throw new Error(`Self-funding uses USDC topup tiers: ${TOPUP_TIERS.join(", ")} USD`);
  }
  const { account, chainType } = await getWallet();
  if (chainType !== "evm") throw new Error("USDC x402 topup requires an EVM wallet");
  if (account.address.toLowerCase() !== destination.toLowerCase()) throw new Error("Configured wallet does not match the loaded wallet");
  const db = createDatabase(resolvePath(config.dbPath));
  try {
    const result = await topupCredits(config.conwayApiUrl, account, amountUsd, undefined, db);
    if (!result.success) throw new Error(result.error || "Credit topup failed");
    console.log(`Purchased $${amountUsd.toFixed(2)} Conway credits using wallet USDC.`);
  } finally {
    db.close();
  }
  process.exit(0);
}

const payload = {
  to_address: destination,
  amount_cents: amountCents,
  note: `fund via automaton-cli (${config.name})`,
};

const apiUrl = config.conwayApiUrl || "https://api.conway.tech";
const paths = ["/v1/credits/transfer", "/v1/credits/transfers"];

let success: any | null = null;
let lastError = "";

for (const path of paths) {
  const resp = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: config.conwayApiKey,
    },
    body: JSON.stringify(payload),
    redirect: "error",
  });

  if (!resp.ok) {
    const text = await resp.text();
    lastError = `${resp.status}: ${text}`;
    if (resp.status === 404) {
      continue;
    }
    console.log(`Credit transfer failed (${path}): ${lastError}`);
    process.exit(1);
  }

  success = await resp.json().catch(() => ({}));
  break;
}

if (!success) {
  console.log(`Credit transfer failed: ${lastError || "unknown error"}`);
  process.exit(1);
}

const transferId = success.transfer_id || success.id || "n/a";
const status = success.status || "submitted";
const balanceAfter = success.balance_after_cents ?? success.new_balance_cents;

console.log(`
Transfer submitted.
From key:  ${maskKey(config.conwayApiKey)}
To:        ${destination}
Amount:    $${(amountCents / 100).toFixed(2)} (${amountCents} cents)
Status:    ${status}
Transfer:  ${transferId}
${balanceAfter !== undefined ? `Balance:   $${(Number(balanceAfter) / 100).toFixed(2)} after transfer` : ""}
`);

function parseAmountToCents(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed) return 0;

  // If user provides integer >= 100, treat as cents.
  if (/^\d+$/.test(trimmed) && Number(trimmed) >= 100) {
    return Number(trimmed);
  }

  const dollars = Number(trimmed);
  if (!Number.isFinite(dollars)) return 0;
  return Math.round(dollars * 100);
}

function maskKey(key: string): string {
  if (key.length < 8) return "***";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}
