/**
 * API contract between frontend and backend.
 *
 * This file is the single source of truth for the shape of market data.
 * The frontend's mock layer implements these types today; a real backend
 * implements the same types later. Nothing in either side may define its own
 * parallel shape for this data.
 */

/** ISO 4217 currency code, e.g. "EUR", "USD". */
export type CurrencyCode = string

/** ISO 8601 date, e.g. "2026-09-09". */
export type IsoDate = string

/** ISO 8601 timestamp, e.g. "2026-09-09T08:00:00Z". */
export type IsoDateTime = string

/**
 * A monetary amount. Kept as a number plus its currency rather than a
 * formatted string, so formatting stays a presentation concern.
 */
export interface Money {
  amount: number
  currency: CurrencyCode
}

/** A single point on a price series. */
export interface PricePoint {
  date: IsoDate
  value: number
}

/** An instrument the user can hold or watch. */
export interface Instrument {
  /** Stable identifier used in URLs and as a list key. */
  id: string
  symbol: string
  name: string
  currency: CurrencyCode
}

/** Current quote for an instrument. */
export interface Quote {
  instrumentId: string
  price: Money
  /** Absolute change against the previous close. */
  change: Money
  /** Relative change against the previous close, as a fraction (0.0123 = 1.23%). */
  changePercent: number
  asOf: IsoDateTime
}

/** One line in the user's portfolio. */
export interface Position {
  instrument: Instrument
  quantity: number
  averageCost: Money
  marketValue: Money
  unrealisedGain: Money
  unrealisedGainPercent: number
}

/** Aggregate figures shown at the top of the dashboard. */
export interface PortfolioSummary {
  totalValue: Money
  dayChange: Money
  dayChangePercent: number
  totalGain: Money
  totalGainPercent: number
  asOf: IsoDateTime
}

/** Everything the dashboard needs, in one response. */
export interface DashboardData {
  summary: PortfolioSummary
  positions: Position[]
  history: PricePoint[]
}

/**
 * Error shape every failing endpoint returns. The frontend renders
 * `message` directly, so it must be safe to show to a user.
 */
export interface ApiError {
  code: string
  message: string
}
