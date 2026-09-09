# Services

All I/O lives here. Components never call `fetch` directly.

- `api/` — talks to the network. Implements the types in `shared/types/`.
- `mock/` — implements the same interface from fixtures, with artificial
  latency and switchable failure, so every loading, empty and error state can
  be developed and demonstrated without the network.

Both sides satisfy one interface, so swapping them is a single line in the
composition root — not a change spread through the components.
