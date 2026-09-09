/**
 * Icon path data.
 *
 * A plain module rather than part of the component, because `<script setup>`
 * cannot expose named exports — and other components need the `IconName` type
 * to declare their own props.
 */

export const ICON_PATHS = {
  overview: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  transactions: 'M7 4v13m0 0-3-3m3 3 3-3M17 20V7m0 0-3 3m3-3 3 3',
  budgets: 'M12 3a9 9 0 1 0 9 9h-9zM14 3.5A9 9 0 0 1 20.5 10H14z',
  pots: 'M6 9h12l-1 10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zM9 9V6a3 3 0 0 1 6 0v3',
  bills: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  chevronLeft: 'm14 6-6 6 6 6',
  chevronRight: 'm10 6 6 6-6 6',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5 12 4 4',
  caret: 'm6 9 6 6 6-6',
  jar: 'M8 3h8v3H8zM6 6h12l-1.2 13a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8zM9 13h6',
} as const

export type IconName = keyof typeof ICON_PATHS
