<script setup lang="ts">
/**
 * Pagination.
 *
 * A navigation landmark with a list of buttons, not a row of clickable
 * elements: the list tells a screen reader how many pages there are, and
 * `aria-current` marks which one is open — the same attribute that carries the
 * styling, so the two cannot disagree.
 *
 * Previous and Next are disabled at the ends rather than removed. A control
 * that disappears takes the keyboard focus with it and drops the user at the
 * top of the document.
 */

import { computed } from 'vue'

import AppIcon from '@/components/atoms/AppIcon.vue'

const props = defineProps<{ page: number; pageCount: number }>()

const emit = defineEmits<{ change: [page: number] }>()

/** A gap in the number sequence, rendered as an ellipsis. */
const GAP = 'gap' as const
type Slot = number | typeof GAP

/**
 * Which page numbers to show.
 *
 * Everything up to seven pages; beyond that, the first, the last, and the
 * current page with one neighbour on each side. Five numbers do not fit side
 * by side on a 375px screen, so the narrow layout shows fewer still — handled
 * in CSS, because it is a question of available width, not of state.
 */
const slots = computed<Slot[]>(() => {
  const { page, pageCount } = props
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const result: Slot[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)

  if (start > 2) result.push(GAP)
  for (let index = start; index <= end; index++) result.push(index)
  if (end < pageCount - 1) result.push(GAP)
  result.push(pageCount)

  return result
})

function go(page: number) {
  if (page >= 1 && page <= props.pageCount && page !== props.page) emit('change', page)
}
</script>

<template>
  <nav v-if="props.pageCount > 1" class="c-app-pagination" aria-label="Pagination">
    <ul class="c-app-pagination__list" role="list">
      <li>
        <button
          class="c-app-pagination__step"
          type="button"
          :disabled="props.page <= 1"
          @click="go(props.page - 1)"
        >
          <AppIcon name="chevronLeft" />
          <span class="c-app-pagination__step-label">Prev</span>
        </button>
      </li>

      <li v-for="(slot, index) in slots" :key="`${slot}-${index}`">
        <span v-if="slot === 'gap'" class="c-app-pagination__gap" aria-hidden="true">…</span>
        <button
          v-else
          class="c-app-pagination__page"
          type="button"
          :aria-current="slot === props.page ? 'page' : undefined"
          @click="go(slot)"
        >
          <span class="u-visually-hidden">Page </span>{{ slot }}
        </button>
      </li>

      <li>
        <button
          class="c-app-pagination__step"
          type="button"
          :disabled="props.page >= props.pageCount"
          @click="go(props.page + 1)"
        >
          <span class="c-app-pagination__step-label">Next</span>
          <AppIcon name="chevronRight" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.c-app-pagination {
  margin-block-start: var(--space-8);
}

.c-app-pagination__list {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: space-between;

  @include mx.from('md') {
    justify-content: flex-end;
  }
}

.c-app-pagination__step,
.c-app-pagination__page,
.c-app-pagination__gap {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding-inline: var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-sm);
}

.c-app-pagination__step,
.c-app-pagination__page {
  @include mx.focus-ring;

  &:hover:not(:disabled, [aria-current]) {
    color: var(--color-text-inverse);
    background-color: var(--color-text-muted);
    border-color: transparent;
  }

  &:disabled {
    color: var(--color-text-subtle);
    cursor: not-allowed;
  }
}

.c-app-pagination__page[aria-current='page'] {
  color: var(--color-text-inverse);
  background-color: var(--color-surface-inverse);
  border-color: transparent;
}

.c-app-pagination__gap {
  border-color: transparent;
}

// The numbers are the first thing to go when width runs out — except the
// current one, which is the only thing telling you where you are. Prev and
// Next still reach every page from there.
.c-app-pagination__list > li:not(:first-child, :last-child) {
  display: none;

  @include mx.from('sm') {
    display: block;
  }
}

.c-app-pagination__list > li:has(.c-app-pagination__page[aria-current='page']) {
  display: block;
}

.c-app-pagination__step-label {
  display: none;

  @include mx.from('md') {
    display: block;
  }
}
</style>
