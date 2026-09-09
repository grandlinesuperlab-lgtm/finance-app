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

- Code, comments, commit messages and identifiers are **English**, and so is
  every string a user sees. The design this app reproduces is English and
  denominated in dollars, so German labels would fight the layout and the data.
  Formatting locale is `en-US`.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`).
  One logical change per commit.
- Branches: `main` holds what is presentable at any moment. `develop` collects
  finished work. Neither receives direct commits.
  All work happens on a branch off `develop`, named after its piece of work
  (`setup`, `dashboard`, `weather-widget`). It reaches `develop` through a pull
  request once `npm run check` is green, and is deleted afterwards. `develop`
  reaches `main` the same way, so both branches read as a series of finished
  steps rather than a stream of work in progress.
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
