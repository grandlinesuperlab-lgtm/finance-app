import type { Category, Transaction } from '@shared/types/finance'

/**
 * Transaction querying: search, filter, sort, paginate.
 *
 * Pure functions over plain arrays — no Vue, no store, no side effects. That
 * is what lets the transactions page stay a thin rendering layer, and what
 * makes this file testable on its own.
 */

export const SORT_OPTIONS = [
  'Neueste',
  'Älteste',
  'A bis Z',
  'Z bis A',
  'Höchster Betrag',
  'Niedrigster Betrag',
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]

/** The category filter, widened by the "all categories" case. */
export type CategoryFilter = Category | 'Alle Transaktionen'

export interface TransactionQuery {
  search: string
  category: CategoryFilter
  sort: SortOption
  page: number
  perPage: number
}

export interface Page<T> {
  items: T[]
  page: number
  pageCount: number
  total: number
}

/** Case-insensitive match on the counterparty name. */
export function searchTransactions(
  transactions: Transaction[],
  query: string,
): Transaction[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return transactions
  return transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(needle),
  )
}

export function filterByCategory(
  transactions: Transaction[],
  category: CategoryFilter,
): Transaction[] {
  if (category === 'Alle Transaktionen') return transactions
  return transactions.filter((transaction) => transaction.category === category)
}

/** Returns a new array; the input is never mutated. */
export function sortTransactions(
  transactions: Transaction[],
  sort: SortOption,
): Transaction[] {
  const sorted = [...transactions]

  switch (sort) {
    case 'Neueste':
      return sorted.sort((a, b) => b.date.localeCompare(a.date))
    case 'Älteste':
      return sorted.sort((a, b) => a.date.localeCompare(b.date))
    case 'A bis Z':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'Z bis A':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    // "Highest" and "Lowest" rank by the size of the movement, so an income of
    // 2500 and a payment of -2500 are equally large. Ranking by signed value
    // would put every payment below every income, which is not what the sort
    // is asking about.
    case 'Höchster Betrag':
      return sorted.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    case 'Niedrigster Betrag':
      return sorted.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount))
  }
}

export function paginate<T>(items: T[], page: number, perPage: number): Page<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / perPage))
  const safePage = Math.min(Math.max(1, page), pageCount)
  const start = (safePage - 1) * perPage

  return {
    items: items.slice(start, start + perPage),
    page: safePage,
    pageCount,
    total: items.length,
  }
}

/** The whole query in one call, in the order the UI implies. */
export function queryTransactions(
  transactions: Transaction[],
  query: TransactionQuery,
): Page<Transaction> {
  const matched = filterByCategory(
    searchTransactions(transactions, query.search),
    query.category,
  )
  return paginate(sortTransactions(matched, query.sort), query.page, query.perPage)
}

/** The newest transactions, for the overview's recent-activity list. */
export function latestTransactions(
  transactions: Transaction[],
  limit: number,
): Transaction[] {
  return sortTransactions(transactions, 'Neueste').slice(0, limit)
}
