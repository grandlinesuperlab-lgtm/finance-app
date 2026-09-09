# Finance Portal

Portfolio dashboard. Frontend-first; a backend may be added later.

## Layout

| Path        | What it is                                                     |
| ----------- | -------------------------------------------------------------- |
| `frontend/` | Vue 3 + Vite + TypeScript app. See `frontend/CLAUDE.md`.        |
| `shared/`   | API contract types. Source of truth for both sides. No runtime code. |
| `backend/`  | Empty. Nothing here yet — do not scaffold it without being asked. |

## Commands

Run from `frontend/`:

```bash
npm run dev          # dev server on :5173
npm run check        # type-check + eslint + stylelint — run this before every commit
npm run build        # type-check + production build
npm run format       # prettier
```

## Rules

- Code, comments, commit messages and identifiers are **English**. UI copy is **German**.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`).
  One logical change per commit.
- `npm run check` must pass before a commit. Never disable a lint rule to make
  something pass — fix the code, or raise the rule as a decision to be made.
- Types describing data that crosses the API boundary live in `shared/types/`.
  Neither side defines its own parallel shape for that data.
- No secrets in the repo. API keys go in `frontend/.env.local` (gitignored).

## Environment quirk — read before running npm

`frontend/node_modules` belongs to **macOS**. Several dependencies (rolldown,
sass-embedded) ship platform-specific native binaries, so an install performed
anywhere else leaves bindings this machine cannot load and `npm run dev` fails
with "Cannot find native binding".

An agent working through a Linux shell on this folder must therefore **never**
run `npm install`, `npm run dev` or `npm run build` here. Ask the user to run
them in their own terminal instead. Pure-JavaScript checks (`eslint`,
`stylelint`, `vue-tsc`) are safe.
