# Finance Portal

A portfolio dashboard built as a frontend code sample: Vue 3, TypeScript, and
hand-written SCSS. No component library — the design system is part of the
exercise.

> **Status:** scaffolding and design system in place. The dashboard screen is
> next. This README grows with the project.

## Running it

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

Other commands:

```bash
npm run check    # type-check + eslint + stylelint
npm run build    # production build
```

## Why it is built this way

**Two-layer design tokens.** `_variables.scss` holds compile-time scales
(breakpoints, spacing, type). `_theme.scss` emits CSS custom properties in two
layers: a raw palette, and a semantic layer (`--color-text`,
`--color-positive`) that components consume. Dark mode redefines only the
semantic layer — about twenty lines instead of a parallel stylesheet.

**Atomic Design with a mechanical rule.** The usual failure of Atomic Design is
arguing about whether something is a molecule or an organism. Here the layer is
decided by what a component may import and whether it may touch a store, so the
answer is looked up rather than debated. See `frontend/CLAUDE.md`.

**BEM alongside scoped styles.** Both solve name collisions, so using both
needs a reason. The reason: the block name is derived from the component's file
name, which makes every class name globally unique and greppable, and `scoped`
becomes a safety net rather than the mechanism. Full class names are written
out instead of `&__element`, so every class can be found by searching for it.

**Conventions as lint rules, not prose.** BEM naming, nesting depth, raw hex
colours, hardcoded spacing, Options API, `v-html`, untyped props — all are
build errors, not guidelines. A rule nobody can accidentally break is worth
more than a rule written down.

**A shared API contract.** `shared/types/` describes the data crossing the
network boundary. The mock layer implements those types today; a backend can
implement the same types later without the frontend changing.

## Accessibility

Semantic markup is a goal of this project, not an afterthought: tabular data in
tables, key figures in definition lists, one `h1` per view, visible focus, gains
and losses never signalled by colour alone. The full checklist lives in
`.claude/skills/component-conventions/SKILL.md`.

## Credits

Visual design based on a [Frontend Mentor](https://www.frontendmentor.io)
challenge, extended with additional features and states.
