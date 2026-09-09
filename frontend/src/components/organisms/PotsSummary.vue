<script setup lang="ts">
/**
 * Savings pots at a glance: the total set aside, and the first few pots.
 *
 * The pot list is a definition list — each entry is a name and the amount
 * saved under it, which is a label/value pair, not a paragraph.
 */

import type { Pot } from '@shared/types/finance'
import AppCard from '@/components/atoms/AppCard.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import SectionHeader from '@/components/molecules/SectionHeader.vue'

const props = withDefaults(
  defineProps<{
    pots: Pot[]
    totalSaved: number
    /** How many pots the card lists before it stops. */
    limit?: number
  }>(),
  { limit: 4 },
)
</script>

<template>
  <AppCard as="section">
    <SectionHeader title="Sparziele" to="/pots" destination="Sparziele" />

    <div class="c-pots-summary">
      <dl class="c-pots-summary__total">
        <AppIcon class="c-pots-summary__icon" name="jar" />
        <dt class="c-pots-summary__total-label">Gesamt gespart</dt>
        <dd><MoneyAmount :amount="props.totalSaved" size="lg" whole /></dd>
      </dl>

      <!--
        Each pot is a <div> wrapping its own <dt>/<dd>. HTML allows that
        grouping inside a <dl>, and it is what lets the grid lay the pots out
        as blocks of name-over-amount instead of interleaving names and
        amounts across the columns.
      -->
      <dl v-if="props.pots.length" class="c-pots-summary__list">
        <div
          v-for="pot in props.pots.slice(0, props.limit)"
          :key="pot.id"
          class="c-pots-summary__item"
          :style="{ '--marker': `var(--theme-${pot.theme})` }"
        >
          <dt class="c-pots-summary__name">{{ pot.name }}</dt>
          <dd><MoneyAmount :amount="pot.total" /></dd>
        </div>
      </dl>

      <p v-else class="c-pots-summary__empty">Noch keine Sparziele. Lege eines an, um loszulegen.</p>
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.c-pots-summary {
  display: grid;
  gap: var(--space-5);

  @include mx.from('sm') {
    grid-template-columns: 1fr 1fr;
  }
}

// Explicit line placement rather than grid-template-areas: the <dd> had no
// area of its own, which pushed the whole template out of shape and collapsed
// the icon column to zero width.
.c-pots-summary__total {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: var(--space-4);
  align-content: center;
  padding: var(--space-5);
  background-color: var(--color-surface-sunken);
  border-radius: var(--radius-md);
}

// The headline drops its cents, as in the design. With them the figure alone
// was wider than the tile's content box, and the auto-sized icon column was
// squeezed to zero — the icon vanished rather than the number wrapping.
.c-pots-summary__icon {
  grid-row: 1 / 3;
  grid-column: 1;
  align-self: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-accent);
}

.c-pots-summary__total-label {
  grid-column: 2;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.c-pots-summary__total > dd {
  grid-column: 2;
}

.c-pots-summary__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5) var(--space-4);
  align-content: center;
}

// The coloured bar is decoration: the name and amount next to it already say
// everything it hints at.
.c-pots-summary__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-inline-start: var(--space-4);
  border-inline-start: 4px solid var(--marker);
  border-radius: var(--radius-sm);
}

.c-pots-summary__name {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.c-pots-summary__empty {
  align-self: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
