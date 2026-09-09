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
