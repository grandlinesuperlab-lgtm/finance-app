# Composables

Reusable stateful logic that is not a component: `useCurrencyFormat`,
`useAsyncData`, `useMediaQuery`.

A composable is the right home for state that belongs to one screen. State
shared across routes belongs in a Pinia store instead.

Named `useX.ts`, returns refs and functions, never renders anything.
