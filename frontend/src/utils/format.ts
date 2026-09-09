/**
 * Presentation formatting.
 *
 * Every user-visible number and date passes through here. Components never
 * call `Intl` themselves: keeping the formatting in one place means the locale
 * is a single decision, the output is consistent, and this file is a plain
 * seam that can be tested without rendering anything.
 */

const LOCALE = 'en-US'
const CURRENCY = 'USD'

const currency = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 2,
})

const currencyWhole = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
})

// Dates use en-GB rather than en-US: the design writes them day-first
// ("19 Aug 2024"), and en-US would render "Aug 19, 2024". Currency stays
// en-US — the two are separate decisions, so they get separate formatters.
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: 'long',
  year: 'numeric',
})

/** `$1,234.56`. Negative amounts keep their minus sign. */
export function formatCurrency(amount: number): string {
  return currency.format(amount)
}

/** `$1,235` — for figures where cents are noise, such as a pot target. */
export function formatCurrencyWhole(amount: number): string {
  return currencyWhole.format(amount)
}

/**
 * `+$120.00` / `-$75.50`.
 *
 * The sign is always rendered, so the direction of a transaction never depends
 * on colour alone.
 */
export function formatSignedCurrency(amount: number): string {
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : ''
  return `${sign}${currency.format(Math.abs(amount))}`
}

/** `19 Aug 2024`. */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

/** `August 2024`. */
export function formatMonth(iso: string): string {
  return monthFormatter.format(new Date(iso))
}

/** `72%` — takes a fraction, not an already-multiplied number. */
export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`
}

/** `19th` — for the day a recurring bill falls due. */
export function formatOrdinalDay(day: number): string {
  const remainderTen = day % 10
  const remainderHundred = day % 100
  if (remainderTen === 1 && remainderHundred !== 11) return `${day}st`
  if (remainderTen === 2 && remainderHundred !== 12) return `${day}nd`
  if (remainderTen === 3 && remainderHundred !== 13) return `${day}rd`
  return `${day}th`
}

/** Initials for the generated avatars: "Harvest Market" -> "HM". */
export function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}
