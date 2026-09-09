import { CATEGORIES, type FinanceData } from '@shared/types/finance'
import seed from '@/data/finance-seed.json'
import type { FinanceRepository } from './index'

/**
 * Local implementation: seed file first, localStorage on top.
 *
 * A visitor can create a budget, reload the page and still see it — the app
 * behaves like a real one without a server. Reads are wrapped because
 * localStorage throws in private browsing and when site data is blocked; a
 * storage failure degrades to the seed rather than to a blank screen.
 */

// v2: v1 kann noch englische Kategorien enthalten. Ein Schlüsselwechsel
// verwirft solche Stände sauber, statt sie halb falsch einzulesen.
const STORAGE_KEY = 'finance-app:data:v2'

/** Simulated latency, so loading states are real rather than theoretical. */
const LATENCY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readStored(): FinanceData | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FinanceData) : null
  } catch {
    // Unavailable or corrupt: fall back to the seed rather than failing.
    return null
  }
}

function writeStored(data: FinanceData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Quota exceeded or storage blocked. The in-memory state is still correct,
    // so the session continues; only persistence is lost.
    console.warn('Daten konnten nicht gespeichert werden; Änderungen gehen beim Neuladen verloren.')
  }
}

/**
 * The seed is JSON, so TypeScript widens its strings and the cast below is
 * unavoidable — which means the compiler cannot catch a category that is not
 * in the contract. It happened once already: the data was translated while the
 * union still listed the English names, and nothing complained.
 *
 * This turns that silent mismatch into an immediate, readable failure.
 */
function assertKnownCategories(data: FinanceData): void {
  const known = new Set<string>(CATEGORIES)
  const used = new Set<string>([
    ...data.transactions.map((transaction) => transaction.category),
    ...data.budgets.map((budget) => budget.category),
  ])
  const unknown = [...used].filter((category) => !known.has(category))

  if (unknown.length > 0) {
    throw new Error(
      `Seed data uses categories that are not in the contract: ${unknown.join(', ')}`,
    )
  }
}

/** A fresh copy of the seed, so callers can never mutate the import. */
function freshSeed(): FinanceData {
  const data = structuredClone(seed) as FinanceData
  assertKnownCategories(data)
  return data
}

export const localFinanceRepository: FinanceRepository = {
  async load(): Promise<FinanceData> {
    await delay(LATENCY_MS)
    return readStored() ?? freshSeed()
  },

  async save(data: FinanceData): Promise<void> {
    writeStored(data)
  },

  async reset(): Promise<FinanceData> {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nothing to clear if storage is unavailable.
    }
    return freshSeed()
  },
}
