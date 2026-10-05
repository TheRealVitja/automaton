/**
 * Credit Topup via x402
 *
 * Converts USDC to Conway credits via the x402 payment protocol.
 *
 * - On startup: bootstraps with the minimum tier ($5) so the agent can run.
 * - At runtime: the agent uses the `topup_credits` tool to choose how much.
 * - Heartbeat: wakes the agent when USDC is available but credits are low.
 *
 * Endpoint: GET /pay/{amountUsd}/{walletAddress}
 * Payment: x402 (USDC on Base, signed TransferWithAuthorization)
 *
 * Valid tiers: 5, 25, 100, 500, 1000, 2500 (USD)
 */

import type { PrivateKeyAccount, Address } from "viem";
import { x402Fetch, getUsdcBalance } from "./x402.js";
import { createLogger } from "../observability/logger.js";
import type { ChainType } from "../identity/chain.js";
import type { AutomatonDatabase } from "../types.js";
import { createHash, randomUUID } from "node:crypto";

const logger = createLogger("topup");
const recentIntents = new Map<string, string>();
const TOPUP_COOLDOWN_MS = 5 * 60_000;

/** Valid topup tier amounts in USD. */
export const TOPUP_TIERS = [5, 25, 100, 500, 1000, 2500];

export interface TopupResult {
  success: boolean;
  amountUsd: number;
  creditsCentsAdded?: number;
  error?: string;
}

/**
 * Execute a credit topup via x402 payment.
 *
 * Calls GET /pay/{amountUsd}/{address} which returns HTTP 402.
 * x402Fetch handles the payment signing and retry automatically.
 */
export async function topupCredits(
  apiUrl: string,
  account: PrivateKeyAccount,
  amountUsd: number,
  recipientAddress?: Address,
  db?: AutomatonDatabase,
): Promise<TopupResult> {
  if (!TOPUP_TIERS.includes(amountUsd)) {
    return { success: false, amountUsd, error: "Invalid credit topup tier" };
  }
  const address = recipientAddress || account.address;
  const url = `${apiUrl}/pay/${amountUsd}/${address}`;
  // Claim before the first await. SQLite serializes claims across processes;
  // all bootstrap, heartbeat and tool paths share the same payer/recipient key.
  const key = `topup_intent:${createHash("sha256").update(`${new URL(apiUrl).origin}:${account.address.toLowerCase()}:${address.toLowerCase()}`).digest("hex")}`;
  const intent = { id: randomUUID(), state: "in_flight", createdAt: Date.now() };
  const claim = () => {
    const saved = db ? db.getKV(key) : recentIntents.get(key);
    if (saved) {
      const previous = JSON.parse(saved);
      if (previous.state === "in_flight" || previous.state === "unknown") {
        return "Previous credit topup has an unresolved payment outcome; reconcile it before another purchase.";
      }
      if (Date.now() - previous.createdAt < TOPUP_COOLDOWN_MS) {
        return "Credit topup cooldown: refresh the credit balance before another purchase.";
      }
    }
    const value = JSON.stringify(intent);
    if (db) db.setKV(key, value); else recentIntents.set(key, value);
    return null;
  };
  const blocked = db ? db.raw.transaction(claim).immediate() : claim();
  if (blocked) return { success: false, amountUsd, error: blocked };

  logger.info(`Attempting credit topup: $${amountUsd} USD for ${address}`);

  const result = await x402Fetch(url, account, "GET", undefined, undefined, amountUsd * 100, "evm", intent.id);
  const state = result.success ? "succeeded" : result.paymentAttempted ? "unknown" : "failed";
  const saved = JSON.stringify({ ...intent, state, amountUsd, error: result.error, status: result.status });
  if (db) db.setKV(key, saved); else recentIntents.set(key, saved);

  if (!result.success) {
    logger.error(`Credit topup failed: ${result.error || `HTTP ${result.status}: ${JSON.stringify(result.response)}`}`);
    return {
      success: false,
      amountUsd,
      error: result.error || `HTTP ${result.status}`,
    };
  }

  const creditsCentsAdded = typeof result.response === "object"
    ? result.response?.credits_cents ?? result.response?.amount_cents ?? amountUsd * 100
    : amountUsd * 100;

  logger.info(`Credit topup successful: $${amountUsd} USD → ${creditsCentsAdded} credits cents`);

  return {
    success: true,
    amountUsd,
    creditsCentsAdded,
  };
}

/**
 * Attempt a credit topup in response to a 402 sandbox creation error.
 *
 * Parses the error response to determine the deficit, picks the smallest
 * tier that covers it, checks USDC balance, and calls topupCredits().
 * Returns null if the error isn't a 402 or topup can't proceed.
 */
export async function topupForSandbox(params: {
  apiUrl: string;
  account: PrivateKeyAccount;
  error: Error & { status?: number; responseText?: string };
  chainType?: ChainType;
  db?: AutomatonDatabase;
}): Promise<TopupResult | null> {
  const { apiUrl, account, error, chainType } = params;

  // Solana wallets cannot use x402 for topup (EVM-only payment protocol)
  if (chainType === "solana") {
    logger.info(
      "Sandbox topup skipped: Solana wallets cannot use x402. Fund via Conway credits API or dashboard.",
    );
    return null;
  }

  if (error.status !== 402 && !error.message?.includes("INSUFFICIENT_CREDITS")) return null;

  // Parse the 402 response body for credit details
  let requiredCents: number | undefined;
  let currentCents: number | undefined;
  try {
    const body = JSON.parse(error.responseText || "{}");
    requiredCents = body.details?.required_cents;
    currentCents = body.details?.current_balance_cents;
  } catch {
    // If we can't parse the body, check for INSUFFICIENT_CREDITS in message
    if (!error.message?.includes("INSUFFICIENT_CREDITS")) return null;
  }

  // Calculate deficit in cents; default to minimum tier if details missing
  const deficitCents = (requiredCents != null && currentCents != null)
    ? requiredCents - currentCents
    : TOPUP_TIERS[0] * 100;

  // Pick smallest tier that covers the deficit (tier is in USD, deficit in cents)
  const selectedTier = TOPUP_TIERS.find((tier) => tier * 100 >= deficitCents)
    ?? TOPUP_TIERS[TOPUP_TIERS.length - 1];

  // Check USDC balance before attempting payment
  let usdcBalance: number;
  try {
    usdcBalance = await getUsdcBalance(account.address);
  } catch (err: any) {
    logger.warn(`Failed to check USDC balance for sandbox topup: ${err.message}`);
    return null;
  }

  if (usdcBalance < selectedTier) {
    logger.info(
      `Sandbox topup skipped: USDC $${usdcBalance.toFixed(2)} < tier $${selectedTier}`,
    );
    return null;
  }

  logger.info(`Sandbox topup: deficit=${deficitCents}c, buying $${selectedTier} tier`);
  return topupCredits(apiUrl, account, selectedTier, undefined, params.db);
}

/**
 * Bootstrap topup: buy the minimum tier ($5) on startup so the agent
 * can run inference. The agent decides larger topups itself via the
 * `topup_credits` tool.
 *
 * Only triggers when credits are below threshold AND USDC covers the
 * minimum tier.
 */
export async function bootstrapTopup(params: {
  apiUrl: string;
  account: PrivateKeyAccount;
  creditsCents: number;
  creditThresholdCents?: number;
  chainType?: ChainType;
  db?: AutomatonDatabase;
}): Promise<TopupResult | null> {
  const { apiUrl, account, creditsCents, creditThresholdCents = 500, chainType } = params;

  // Solana wallets cannot use x402 for topup (EVM-only payment protocol)
  if (chainType === "solana") {
    if (creditsCents < creditThresholdCents) {
      logger.info(
        "Bootstrap topup skipped: Solana wallets cannot use x402. Fund via Conway credits API or dashboard.",
      );
    }
    return null;
  }

  if (creditsCents >= creditThresholdCents) {
    return null;
  }

  let usdcBalance: number;
  try {
    usdcBalance = await getUsdcBalance(account.address);
  } catch (err: any) {
    logger.warn(`Failed to check USDC balance for bootstrap topup: ${err.message}`);
    return null;
  }

  const minTier = TOPUP_TIERS[0];
  if (usdcBalance < minTier) {
    logger.info(
      `Bootstrap topup skipped: USDC balance $${usdcBalance.toFixed(2)} below minimum tier ($${minTier})`,
    );
    return null;
  }

  logger.info(
    `Bootstrap topup: credits=$${(creditsCents / 100).toFixed(2)}, USDC=$${usdcBalance.toFixed(2)}, buying $${minTier}`,
  );

  return topupCredits(apiUrl, account, minTier, undefined, params.db);
}
