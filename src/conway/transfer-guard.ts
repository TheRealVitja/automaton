const transfers = new Map<string, Promise<void>>();

/** Serialize balance-check, transfer and bookkeeping for one payer. */
export async function serializeCreditTransfer<T>(payer: string, action: () => Promise<T>): Promise<T> {
  const previous = transfers.get(payer) ?? Promise.resolve();
  let release!: () => void;
  const next = new Promise<void>((resolve) => { release = resolve; });
  transfers.set(payer, next);
  await previous;
  try { return await action(); } finally {
    release();
    if (transfers.get(payer) === next) transfers.delete(payer);
  }
}

export function isAcceptedTransfer(status: string): boolean {
  return ["completed", "complete", "success", "succeeded", "ok", "submitted", "accepted", "pending"]
    .includes(status.trim().toLowerCase());
}
