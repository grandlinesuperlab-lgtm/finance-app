import type { Category, Transaction } from '@shared/types/finance'
import { currentMonth, monthKey } from './budgets'

/**
 * Recurring bills.
 *
 * The source data has no "bill" record — only transactions flagged
 * `recurring`. A bill is therefore *derived*: one entry per counterparty, its
 * amount and due day taken from the most recent instalment, its status from
 * whether this month's instalment has already appeared.
 *
 * Deriving rather than storing keeps a single source of truth. Adding a
 * recurring transaction automatically produces the right bill.
 */

export type BillStatus = 'paid' | 'due-soon' | 'upcoming'

export interface RecurringBill {
  /** Counterparty name, which is also the identity of the bill. */
  name: string
  category: Category
  /** Positive number: the amount due each month. */
  amount: number
  /** Day of the month the payment falls due, from the latest instalment. */
  dueDay: number
  status: BillStatus
}

/** A bill counts as "due soon" within this many days of the reference date. */
const DUE_SOON_WINDOW_DAYS = 5

function dayOfMonth(iso: string): number {
  return Number(iso.slice(8, 10))
}

/**
 * One bill per counterparty.
 *
 * `referenceDate` defaults to the newest transaction in the set, for the same
 * reason the budgets do: the dataset is fixed in time and must not depend on
 * the system clock.
 */
export function deriveRecurringBills(
  transactions: Transaction[],
  referenceDate = currentMonth(transactions),
): RecurringBill[] {
  const recurring = transactions.filter((transaction) => transaction.recurring)
  const month = monthKey(referenceDate)
  const referenceDay = dayOfMonth(referenceDate)

  const byName = new Map<string, Transaction[]>()
  for (const transaction of recurring) {
    const existing = byName.get(transaction.name)
    if (existing) existing.push(transaction)
    else byName.set(transaction.name, [transaction])
  }

  const bills: RecurringBill[] = []

  for (const [name, instalments] of byName) {
    const sorted = [...instalments].sort((a, b) => b.date.localeCompare(a.date))
    const latest = sorted[0]
    if (!latest) continue

    const paidThisMonth = sorted.some(
      (instalment) => monthKey(instalment.date) === month,
    )
    const dueDay = dayOfMonth(latest.date)

    bills.push({
      name,
      category: latest.category,
      amount: Math.abs(latest.amount),
      dueDay,
      status: paidThisMonth
        ? 'paid'
        : dueDay - referenceDay <= DUE_SOON_WINDOW_DAYS
          ? 'due-soon'
          : 'upcoming',
    })
  }

  return bills.sort((a, b) => a.dueDay - b.dueDay)
}

export interface BillTotals {
  paid: number
  upcoming: number
  dueSoon: number
}

/** The three figures the summary panel shows. */
export function summariseBills(bills: RecurringBill[]): BillTotals {
  const total = (status: BillStatus) =>
    bills
      .filter((bill) => bill.status === status)
      .reduce((sum, bill) => sum + bill.amount, 0)

  return {
    paid: total('paid'),
    // "Total upcoming" covers everything not yet paid, due-soon included.
    upcoming: total('upcoming') + total('due-soon'),
    dueSoon: total('due-soon'),
  }
}

export const BILL_SORT_OPTIONS = [
  'Latest',
  'Oldest',
  'A to Z',
  'Z to A',
  'Highest',
  'Lowest',
] as const

export type BillSortOption = (typeof BILL_SORT_OPTIONS)[number]

/**
 * Search and sort for the recurring bills page — the mirror image of
 * queryTransactions, minus pagination: one bill per vendor is a short list.
 *
 * "Latest" and "Oldest" order by the day of the month a bill falls due, which
 * is the only date a derived bill has.
 */
export function queryBills(
  bills: RecurringBill[],
  options: { search: string; sort: BillSortOption },
): RecurringBill[] {
  const needle = options.search.trim().toLowerCase()
  const matched = needle
    ? bills.filter((bill) => bill.name.toLowerCase().includes(needle))
    : bills

  const sorted = [...matched]

  switch (options.sort) {
    case 'Latest':
      return sorted.sort((a, b) => b.dueDay - a.dueDay)
    case 'Oldest':
      return sorted.sort((a, b) => a.dueDay - b.dueDay)
    case 'A to Z':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'Z to A':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'Highest':
      return sorted.sort((a, b) => b.amount - a.amount)
    case 'Lowest':
      return sorted.sort((a, b) => a.amount - b.amount)
  }
}
