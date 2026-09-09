# Frontend

Vue 3 (`<script setup>`) + TypeScript + Vite. SCSS with BEM. Pinia + Vue Router.

Most conventions here are enforced by `eslint.config.js` and `.stylelintrc.json`.
This file covers only what a linter cannot check.

## Component layers

`src/components/atoms|molecules|organisms/`, then `src/views/`. The layer is
decided by one mechanical rule, not by taste:

| Layer     | May import          | May touch stores / services |
| --------- | ------------------- | --------------------------- |
| atom      | nothing             | no                          |
| molecule  | atoms               | no                          |
| organism  | atoms, molecules    | yes                         |
| view      | anything            | yes                         |

Atoms and molecules are pure: props in, events out. If a component needs data
it cannot receive as a prop, it is an organism.

Each layer folder has a README stating its rule. `atoms/BaseButton.vue` is the
reference implementation — new components follow its shape.

## Semantic HTML

This is enforced, not requested:

- `local/div-budget` (a custom rule in `eslint-rules/`) caps `div` and `span`
  at four per template. Over budget means an element with meaning was skipped —
  `section`, `article`, `ul`, `dl`, `table`, `figure`. Raise the budget for a
  file only with a reason, and never as a way around rethinking the markup.
- `eslint-plugin-vuejs-accessibility` errors on click handlers without keyboard
  equivalents, form controls without labels, images without `alt`, empty
  headings, and invalid ARIA.
- `vue/no-restricted-html-elements` blocks `b`, `i` and the obsolete elements.

The full element-by-element guidance is in the `component-conventions` skill.

## Styling

- **Mobile-first, enforced.** Base styles are the small-screen case. Larger
  screens are added with `@include mx.from('sm'|'md'|'lg'|'xl')`, which only
  ever emits `min-width`. `max-width` and `max-height` queries are a stylelint
  error — they invert the cascade and make the small-screen case the exception
  instead of the default.
- Every component's styles live in its own `<style scoped lang="scss">`.
- Block name = component file name in kebab-case, prefixed `c-`
  (`StatCard.vue` → `.c-stat-card`). This makes every block name unique by
  construction, so `scoped` is a safety net rather than the mechanism.
- `l-` prefix for layout-only classes, `u-` for utilities.
- `_variables.scss` and `_mixins.scss` are injected into every component's
  style block by `vite.config.ts` — do not `@use` them again.
- Write out full class names (`.c-stat-card__label`), not `&__label`. The
  ampersand form makes the class unsearchable in the codebase.

## Data flow

- Components never call `fetch` directly. All I/O goes through `src/services/`.
- `src/services/api/` implements the types in `shared/types/`. `src/services/mock/`
  implements the same interface for local development and failure states.
- Pinia stores hold state shared across routes. Anything local to one screen
  stays in that screen or in a composable.

## Non-obvious things

- The dev server runs on the user's machine, not the agent's — ask the user
  to start `npm run dev` when a change needs visual confirmation.
- `noUncheckedIndexedAccess` is on: indexing an array yields `T | undefined`.

For the semantic-HTML and accessibility checklist that applies when building
components, use the `component-conventions` skill.
