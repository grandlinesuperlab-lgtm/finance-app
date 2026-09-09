import type { Balance, Pot, Theme } from '@shared/types/finance'

/**
 * Moving money in and out of savings pots.
 *
 * This is the only place in the app where money changes hands, and every
 * function here returns *both* sides of the booking. Putting money into a pot
 * lowers the account balance and raises the pot; taking it out does the
 * reverse. Splitting that across two call sites is how the two halves end up
 * disagreeing, so the pair is produced together or not at all.
 *
 * Pure functions: no Vue, no store, no side effects.
 */

/** Amounts are floats, so every result is rounded back to cents. */
function round2(value: number): number {
  return Math.round(value * 100) / 100
}

export type Booking =
  | { ok: true; balance: Balance; pot: Pot }
  | { ok: false; error: string }

function invalidAmount(amount: number): string | null {
  if (!Number.isFinite(amount)) return 'Gib einen Betrag ein.'
  if (amount <= 0) return 'Gib einen Betrag größer als null ein.'
  return null
}

/** Move money from the account into a pot. */
export function deposit(balance: Balance, pot: Pot, amount: number): Booking {
  const problem = invalidAmount(amount)
  if (problem) return { ok: false, error: problem }

  if (amount > balance.current) {
    return { ok: false, error: 'Das ist mehr als dein aktueller Kontostand.' }
  }

  return {
    ok: true,
    balance: { ...balance, current: round2(balance.current - amount) },
    pot: { ...pot, total: round2(pot.total + amount) },
  }
}

/** Move money from a pot back into the account. */
export function withdraw(balance: Balance, pot: Pot, amount: number): Booking {
  const problem = invalidAmount(amount)
  if (problem) return { ok: false, error: problem }

  if (amount > pot.total) {
    return { ok: false, error: 'Das ist mehr, als in diesem Sparziel liegt.' }
  }

  return {
    ok: true,
    balance: { ...balance, current: round2(balance.current + amount) },
    pot: { ...pot, total: round2(pot.total - amount) },
  }
}

/**
 * Deleting a pot returns everything saved in it to the account.
 *
 * Money never disappears because a container was removed.
 */
export function releasePot(balance: Balance, pot: Pot): Balance {
  return { ...balance, current: round2(balance.current + pot.total) }
}

/**
 * How full a pot is, as a fraction.
 *
 * Clamped at 1: saving past the target is allowed and is not a failure, but a
 * progress bar beyond full is a rendering bug waiting to happen.
 */
export function potProgress(pot: Pot): number {
  if (pot.target <= 0) return 0
  return Math.min(1, pot.total / pot.target)
}

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

export interface PotInput {
  name: string
  target: number
  theme: Theme
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>

/**
 * `existingId` is the pot being edited, so it does not clash with itself.
 */
export function validatePot(
  input: PotInput,
  existing: Pot[],
  existingId?: string,
): FieldErrors<PotInput> {
  const errors: FieldErrors<PotInput> = {}
  const others = existing.filter((pot) => pot.id !== existingId)

  const name = input.name.trim()
  if (!name) errors.name = 'Gib dem Sparziel einen Namen.'
  else if (others.some((pot) => pot.name.toLowerCase() === name.toLowerCase())) {
    errors.name = 'Ein Sparziel mit diesem Namen existiert bereits.'
  }

  if (!Number.isFinite(input.target) || input.target <= 0) {
    errors.target = 'Setze ein Ziel größer als null.'
  }

  if (others.some((pot) => pot.theme === input.theme)) {
    errors.theme = 'Diese Farbe ist bereits für ein anderes Sparziel vergeben.'
  }

  return errors
}

/** True when nothing was rejected. */
export function isValid<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length === 0
}
