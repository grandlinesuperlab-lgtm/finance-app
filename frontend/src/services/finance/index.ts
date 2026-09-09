import type { FinanceData } from '@shared/types/finance'

/**
 * The seam between the app and wherever its data lives.
 *
 * Everything above this line — store, components — talks only to this
 * interface. Today the only implementation reads a seed file and persists to
 * localStorage; a backend later implements the same three methods and nothing
 * above has to change.
 */
export interface FinanceRepository {
  /** Full state. Rejects with a readable message on failure. */
  load(): Promise<FinanceData>
  /** Persists full state. */
  save(data: FinanceData): Promise<void>
  /** Drops any local changes and returns the untouched seed. */
  reset(): Promise<FinanceData>
}

export { localFinanceRepository } from './localRepository'
