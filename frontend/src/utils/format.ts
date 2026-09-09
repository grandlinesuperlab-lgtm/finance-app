/**
 * Presentation formatting.
 *
 * Every user-visible number and date passes through here. Components never
 * call `Intl` themselves: keeping the formatting in one place means the locale
 * is a single decision, the output is consistent, and this file is a plain
 * seam that can be tested without rendering anything.
 */

// Die Oberfläche ist deutsch, also auch das Zahlenformat: Punkt als
// Tausendertrennung, Komma für Nachkommastellen, Währungszeichen hinter dem
// Betrag — "6.692,52 €". Das weicht vom Layout der Design-Vorlage ab, die das
// Zeichen voranstellt, entspricht aber dem, was ein deutscher Nutzer erwartet.
const LOCALE = 'de-DE'
const CURRENCY = 'EUR'

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

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
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

/**
 * `19.` — der Tag, an dem ein Dauerauftrag fällig wird.
 *
 * Im Deutschen ist die Ordnungszahl schlicht die Ziffer mit einem Punkt, ohne
 * die englischen Sonderfälle für 1, 2 und 3.
 */
export function formatOrdinalDay(day: number): string {
  return `${day}.`
}

/**
 * Initials for the generated avatars: "Harvest Market" -> "HM".
 *
 * Only words that begin with a letter count, so "Rivet & Thread" gives "RT"
 * rather than "R&". Falls back to the first character of the name when a
 * counterparty has no letters at all.
 */
export function initialsFor(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter((word) => /^\p{L}/u.test(word))
    .slice(0, 2)
    .map((word) => word.slice(0, 1).toUpperCase())
    .join('')

  return initials || name.trim().slice(0, 1).toUpperCase()
}
