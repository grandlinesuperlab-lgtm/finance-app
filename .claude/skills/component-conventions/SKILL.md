---
name: component-conventions
description: Semantic HTML and accessibility checklist for building or reviewing a Vue component in this project. Use when creating a new component, changing a component's markup, or reviewing markup for semantics, landmarks, headings, tables, forms, focus or ARIA.
---

# Component conventions

The point of this project is markup a reviewer can read. A `<div>` is the
element you use when no other element fits — not the default.

## Choosing the element

| Content                        | Element                                     |
| ------------------------------ | -------------------------------------------- |
| Rows and columns of data       | `<table>` with `<caption>`, `<thead>`, `<th scope>` |
| Label/value pairs (key figures)| `<dl>` / `<dt>` / `<dd>`                     |
| A list of anything             | `<ul>` / `<ol>`                              |
| Navigates somewhere            | `<a href>`                                   |
| Does something on this page    | `<button type="button">`                     |
| A date or time                 | `<time :datetime="isoString">`               |
| Self-contained, reusable block | `<article>`                                  |
| Thematic section with a heading| `<section>` + a heading                      |
| Tangential content             | `<aside>`                                    |
| An image plus its caption      | `<figure>` / `<figcaption>`                  |

A price table is a `<table>`. This is the single most common mistake in
financial dashboards — a grid of divs is not a table, and screen readers get
nothing from it.

## Structure

- Landmarks appear once per page: `<header>`, `<nav>`, `<main>`, `<footer>`.
  Multiple `<nav>` or `<aside>` elements each need `aria-label`.
- Exactly one `<h1>` per view. Never skip a level going down.
- A heading describes the section it opens. Do not pick a level for its size —
  size comes from CSS.
- Lists that are styled without markers keep `role="list"` so Safari does not
  drop the semantics.

## Interaction and focus

- Focus must always be visible: use the `focus-ring` mixin, never
  `outline: none` on its own.
- Anything clickable is a `<button>` or `<a>`. Never a `<div>` with `@click`.
- Order in the DOM matches visual order. Do not reorder with CSS in a way that
  breaks tab order.
- Touch targets are at least 44×44 CSS px.

## Accessible names and live data

- Every form control has a `<label for>`. Placeholder text is not a label.
- Icon-only buttons carry an accessible name (`aria-label` or a
  `.u-visually-hidden` span).
- Decorative icons are `aria-hidden="true"`.
- Values that update on their own (quotes, totals) sit in a container with
  `aria-live="polite"`. Never `assertive` for routine updates.
- `aria-busy="true"` on a region while it loads.

## Colour and meaning

- A gain or a loss is never signalled by colour alone. Pair the colour with a
  sign (`+1,24 %` / `−0,87 %`) or a text label. Roughly 8% of men cannot
  distinguish the two colours.
- Body text needs 4.5:1 contrast, large text and UI borders 3:1.
- Monetary values use the `numeric` mixin so digits align in columns.

## Every state, every time

A component that fetches data is not done until all four exist:

1. **Loading** — a skeleton or spinner with `aria-busy`, not a blank screen.
2. **Empty** — says what is missing and what to do about it.
3. **Error** — a human sentence and a retry affordance. Never a raw stack trace.
4. **Success**.

## Formatting

Use `Intl.NumberFormat` and `Intl.DateTimeFormat` with the `de-DE` locale, via
the helpers in `src/utils/format.ts`. Never hand-roll currency, percentage or
date formatting, and never call `Intl` directly inside a component — the
helpers are the seam the later test session needs.

User-facing text is German. Code, comments and identifiers stay English.

## Before calling a component done

- `npm run check` passes.
- Tab through it: every interactive element is reachable and visibly focused.
- Zoom the browser to 200%: nothing is clipped or overlapping.
- Toggle `data-theme="dark"` on `<html>`: colours still legible.
