import type { Budget, Category, Transaction } from '@shared/types/finance'

/**
 * Budget arithmetic. Pure functions, no Vue.
 *
 * Every figure a reviewer might question — how much is spent in a category,
 * how much is left, how full the donut is — is computed here and nowhere else.
 */

export interface BudgetSummary {
  budget: Budget
  /** Positive number: how much has been spent against this budget. */
  spent: number
  /** Never negative; an overspent budget reports 0 remaining. */
  remaining: number
  /** Spent as a fraction of the maximum, clamped to 1 for display. */
  ratio: number
  /** True when spending exceeded the maximum. */
  overspent: boolean
}

/** `2024-08-19T…` -> `2024-08`. */
export function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

/**
 * The month the app treats as "now".
 *
 * The dataset is fixed in August 2024, so deriving the current month from the
 * system clock would make every figure go blank in September. It is derived
 * from the newest transaction instead — the demo stays correct forever, and
 * swapping in live data changes nothing.
 */
export function currentMonth(transactions: Transaction[]): string {
  return transactions.reduce(
    (latest, transaction) =>
      transaction.date > latest ? transaction.date : latest,
    transactions[0]?.date ?? new Date().toISOString(),
  )
}

export function transactionsInMonth(
  transactions: Transaction[],
  month: string,
): Transaction[] {
  return transactions.filter((transaction) => monthKey(transaction.date) === month)
}

/** Total spent in a category. Income in that category is ignored. */
export function spentInCategory(
  transactions: Transaction[],
  category: Category,
): number {
  return transactions
    .filter((transaction) => transaction.category === category && transaction.amount < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)
}

export function summariseBudget(
  budget: Budget,
  monthTransactions: Transaction[],
): BudgetSummary {
  const spent = spentInCategory(monthTransactions, budget.category)
  return {
    budget,
    spent,
    remaining: Math.max(0, budget.maximum - spent),
    ratio: budget.maximum === 0 ? 0 : Math.min(1, spent / budget.maximum),
    overspent: spent > budget.maximum,
  }
}

export function summariseBudgets(
  budgets: Budget[],
  transactions: Transaction[],
): BudgetSummary[] {
  const month = monthKey(currentMonth(transactions))
  const monthTransactions = transactionsInMonth(transactions, month)
  return budgets.map((budget) => summariseBudget(budget, monthTransactions))
}

/** The three most recent transactions in a category, newest first. */
export function latestInCategory(
  transactions: Transaction[],
  category: Category,
  limit = 3,
): Transaction[] {
  return transactions
    .filter((transaction) => transaction.category === category)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
}
