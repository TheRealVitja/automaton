/**
 * Child Lifecycle State Machine
 *
 * Manages child automaton lifecycle transitions with validation.
 * Every transition is recorded in the child_lifecycle_events table.
 */

import type { Database as DatabaseType } from "better-sqlite3";
import { ulid } from "ulid";
import type { ChildLifecycleState, ChildLifecycleEventRow } from "../types.js";
import { VALID_TRANSITIONS } from "../types.js";
import { createLogger } from "../observability/logger.js";
const logger = createLogger("replication.lifecycle");
import {
  lifecycleInsertEvent,
  lifecycleGetEvents,
  lifecycleGetLatestState,
  getChildrenByStatus,
  updateChildStatus as dbUpdateChildStatus,
} from "../state/database.js";

export class ChildLifecycle {
  constructor(private db: DatabaseType) {}

  /**
   * Initialize a child record and insert the first lifecycle event.
   */
  initChild(childId: string, name: string, sandboxId: string, genesisPrompt: string, chainType?: string): void {
    // Insert child row into children table
    this.db.prepare(
      `INSERT INTO children (id, name, address, sandbox_id, genesis_prompt, status, created_at, chain_type)
       VALUES (?, ?, '', ?, ?, 'requested', datetime('now'), ?)`,
    ).run(childId, name, sandboxId, genesisPrompt, chainType ?? "evm");

    // Record initial event
    const event: ChildLifecycleEventRow = {
      id: ulid(),
      childId,
      fromState: "none",
      toState: "requested",
      reason: "child created",
      metadata: "{}",
      createdAt: new Date().toISOString(),
    };
    lifecycleInsertEvent(this.db, event);
    dbUpdateChildStatus(this.db, childId, "requested");
  }

  /**
   * Transition a child to a new state with validation.
   * Throws on invalid transitions.
   */
  transition(childId: string, toState: ChildLifecycleState, reason?: string, metadata?: Record<string, unknown>): void {
    let current: ChildLifecycleState;
    try {
      current = this.getCurrentState(childId);
    } catch (error) {
      logger.warn("Denied lifecycle transition for missing child", { childId, toState, reason });
      throw error;
    }
    const allowed = VALID_TRANSITIONS[current];

    if (!allowed || !allowed.includes(toState)) {
      // Keep denied attempts out of the state history: its latest event is
      // authoritative for the current state.
      logger.warn("Denied lifecycle transition", { childId, fromState: current, toState, reason });
      throw new Error(`Invalid lifecycle transition: ${current} → ${toState}`);
    }

    // Record transition event
    const event: ChildLifecycleEventRow = {
      id: ulid(),
      childId,
      fromState: current,
      toState,
      reason: reason ?? null,
      metadata: JSON.stringify(metadata ?? {}),
      createdAt: new Date().toISOString(),
    };
    lifecycleInsertEvent(this.db, event);

    // Update children table
    dbUpdateChildStatus(this.db, childId, toState);
  }

  /**
   * Get the current lifecycle state of a child.
   */
  getCurrentState(childId: string): ChildLifecycleState {
    const state = lifecycleGetLatestState(this.db, childId);
    if (!state) {
      throw new Error(`Child ${childId} not found in lifecycle events`);
    }
    return state;
  }

  hasChild(childId: string): boolean {
    return lifecycleGetLatestState(this.db, childId) !== null;
  }

  /**
   * Get the full lifecycle event history for a child.
   */
  getHistory(childId: string): ChildLifecycleEventRow[] {
    return lifecycleGetEvents(this.db, childId);
  }

  /**
   * Get all children in a given lifecycle state.
   */
  getChildrenInState(state: ChildLifecycleState): Array<{ id: string; name: string; sandboxId: string; status: string; createdAt: string; lastChecked: string | null }> {
    const rows = getChildrenByStatus(this.db, state);
    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      sandboxId: row.sandbox_id,
      status: row.status,
      createdAt: row.created_at,
      lastChecked: row.last_checked ?? null,
    }));
  }
}
