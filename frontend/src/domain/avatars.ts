import { THEMES, type Theme } from '@shared/types/finance'

/**
 * Avatar colours.
 *
 * The source data has no avatar images, so an avatar is generated from the
 * counterparty name: initials on a coloured disc. The colour must be stable —
 * the same name always looks the same, across reloads and across pages — so it
 * is derived from the name rather than assigned at random or stored.
 *
 * A pure function with no Vue and no state, which is why it lives in domain/.
 */

/**
 * FNV-1a, 32-bit. A tiny non-cryptographic hash: it only has to spread names
 * evenly across fifteen buckets, which it does far better than summing char
 * codes (that clusters badly on similar names).
 */
function hash(value: string): number {
  let result = 0x811c9dc5
  for (let i = 0; i < value.length; i++) {
    result ^= value.charCodeAt(i)
    result = Math.imul(result, 0x01000193)
  }
  return result >>> 0
}

/** One of the fifteen design-system themes, chosen deterministically. */
export function avatarThemeFor(name: string): Theme {
  const index = hash(name) % THEMES.length
  return THEMES[index] ?? 'green'
}
