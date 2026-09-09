<script setup lang="ts">
/**
 * The three recurring-bill totals.
 *
 * Another definition list: each row is a label and the amount under it. The
 * coloured bar repeats the status the label already states, so it stays
 * decorative.
 */

import type { BillTotals } from '@/domain/bills'
import AppCard from '@/components/atoms/AppCard.vue'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import SectionHeader from '@/components/molecules/SectionHeader.vue'

const props = defineProps<{ totals: BillTotals }>()

const rows = [
  { key: 'paid', label: 'Paid Bills', theme: 'green' },
  { key: 'upcoming', label: 'Total Upcoming', theme: 'yellow' },
  { key: 'dueSoon', label: 'Due Soon', theme: 'cyan' },
] as const
</script>

<template>
  <AppCard as="section">
    <SectionHeader
      title="Recurring Bills"
      to="/recurring-bills"
      destination="recurring bills"
    />

    <dl class="c-recurring-bills-summary">
      <div
        v-for="row in rows"
        :key="row.key"
        class="c-recurring-bills-summary__item"
        :style="{ '--marker': `var(--theme-${row.theme})` }"
      >
        <dt>{{ row.label }}</dt>
        <dd><MoneyAmount :amount="props.totals[row.key]" /></dd>
      </div>
    </dl>
  </AppCard>
</template>

<style scoped lang="scss">
.c-recurring-bills-summary {
  display: grid;
  gap: var(--space-3);
}

.c-recurring-bills-summary__item {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  background-color: var(--color-surface-sunken);
  border-inline-start: 4px solid var(--marker);
  border-radius: var(--radius-sm);
}
</style>
