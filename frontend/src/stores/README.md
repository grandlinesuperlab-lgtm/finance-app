# Stores

Pinia stores, for state that outlives a single screen or is shared between
unrelated parts of the app.

Stores hold state and the actions that change it. They do not fetch — they call
a service from `src/services/`. Keeping the network out of the store is what
makes both testable.
