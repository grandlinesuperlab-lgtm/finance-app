<script setup lang="ts">
/**
 * Budget allocation as a ring.
 *
 * The ring shows how the total limit is divided between categories — each arc
 * is one budget's maximum as a share of the whole. The figures in the middle
 * are what has actually been spent against that total. Ring = the plan,
 * number = the reality.
 *
 * Drawn with `stroke-dasharray` on one circle per segment. No charting library:
 * the whole thing is a circumference and four offsets, and a dependency would
 * cost more than it saves.
 *
 * Accessibility. The SVG is `aria-hidden`; the legend beside it carries the
 * same numbers as text and is the accessible representation. That is also the
 * relief the palette needs: two of the four brand colours sit below 3:1
 * contrast against a white card (measured, not guessed), so identity may never
 * rest on the colour alone. The figures in the middle deliberately sit outside
 * the hidden SVG so they are still announced.
 */

import { computed } from 'vue'

import type { BudgetSummary } from '@/domain/budgets'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import { formatCurrencyWhole } from '@/utils/format'

const props = defineProps<{
  summaries: BudgetSummary[]
  spent: number
  limit: number
}>()

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
/** A sliver of surface between neighbouring arcs, so they never blend. */
const GAP = 4

const segments = computed(() => {
  const total = props.limit || 1
  let offset = 0

  return props.summaries.map((summary) => {
    const length = (summary.budget.maximum / total) * CIRCUMFERENCE
    const drawn = Math.max(0, length - GAP)
    const segment = {
      id: summary.budget.id,
      theme: summary.budget.theme,
      dashArray: `${drawn} ${CIRCUMFERENCE - drawn}`,
      dashOffset: -offset,
    }
    offset += length
    return segment
  })
})
</script>

<template>
  <div class="c-budget-donut">
    <svg class="c-budget-donut__ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <!-- The empty track, so a partial allocation still reads as a ring. -->
      <circle class="c-budget-donut__track" cx="100" cy="100" :r="RADIUS" />
      <circle
        v-for="segment in segments"
        :key="segment.id"
        class="c-budget-donut__segment"
        cx="100"
        cy="100"
        :r="RADIUS"
        :stroke="`var(--theme-${segment.theme})`"
        :stroke-dasharray="segment.dashArray"
        :stroke-dashoffset="segment.dashOffset"
      />
    </svg>

    <p class="c-budget-donut__centre">
      <MoneyAmount :amount="props.spent" size="lg" whole />
      <span class="c-budget-donut__caption">of {{ formatCurrencyWhole(props.limit) }} limit</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.c-budget-donut {
  position: relative;
  display: grid;
  place-items: center;
  width: min(16rem, 100%);
  margin-inline: auto;
}

.c-budget-donut__ring {
  grid-area: 1 / 1;
  width: 100%;

  // Start at twelve o'clock rather than three, which is where SVG puts angle 0.
  transform: rotate(-90deg);
}

.c-budget-donut__track {
  fill: none;
  stroke: var(--color-surface-sunken);
  stroke-width: 22;
}

.c-budget-donut__segment {
  fill: none;
  stroke-width: 22;
}

.c-budget-donut__centre {
  display: flex;
  flex-direction: column;
  grid-area: 1 / 1;
  gap: var(--space-1);
  align-items: center;
  text-align: center;
}

.c-budget-donut__caption {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
