/**
 * API contract for the personal finance domain.
 *
 * This is the single source of truth for the shape of the data. The local
 * repository seeds it from `finance-seed.json` today; a backend can implement
 * the same types later without the frontend changing.
 *
 * Money is stored as a plain number of dollars. That is a deliberate
 * simplification for a demo dataset — a system handling real money would use
 * integer minor units to avoid floating point drift, and that trade-off is
 * noted here rather than hidden.
 */

/** ISO 8601 timestamp, e.g. "2024-08-19T14:23:11Z". */
export type IsoDateTime = string;

/** The ten spending categories the app knows about. */
export const CATEGORIES = [
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
  "Education",
  "Lifestyle",
  "Shopping",
  "General",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * The fifteen theme colours a budget or pot can carry.
 *
 * Stored as a token name rather than a hex value: the colour itself belongs to
 * the design system, so a re-theme never has to touch stored data.
 */
export const THEMES = [
  "green",
  "yellow",
  "cyan",
  "navy",
  "red",
  "purple",
  "light-purple",
  "turquoise",
  "brown",
  "magenta",
  "blue",
  "grey",
  "army",
  "gold",
  "orange",
] as const;

export type Theme = (typeof THEMES)[number];

/** Headline figures for the account. */
export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

/**
 * One movement of money. A negative `amount` is a payment, a positive one is
 * income — the same convention the source data uses.
 */
export interface Transaction {
  id: string;
  /** Counterparty name; also the source of the generated avatar initials. */
  name: string;
  category: Category;
  date: IsoDateTime;
  amount: number;
  /** True when this is one instalment of a repeating payment. */
  recurring: boolean;
}

/** A spending cap for one category. */
export interface Budget {
  id: string;
  category: Category;
  /** The cap for the current month. */
  maximum: number;
  theme: Theme;
}

/** A savings goal money can be moved into and out of. */
export interface Pot {
  id: string;
  name: string;
  target: number;
  /** Amount saved so far. */
  total: number;
  theme: Theme;
}

/** Everything the app holds. This is what the repository reads and writes. */
export interface FinanceData {
  balance: Balance;
  transactions: Transaction[];
  budgets: Budget[];
  pots: Pot[];
}
