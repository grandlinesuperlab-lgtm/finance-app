import type { FinanceData } from '@shared/types/finance'
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

const STORAGE_KEY = 'finance-app:data:v1'

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
    console.warn('Could not persist finance data; changes will be lost on reload.')
  }
}

/** A fresh copy of the seed, so callers can never mutate the import. */
function freshSeed(): FinanceData {
  return structuredClone(seed) as FinanceData
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
