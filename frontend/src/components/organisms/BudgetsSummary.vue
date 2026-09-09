<script setup lang="ts">
/**
 * Budgets at a glance: the ring, and a legend that carries the same numbers.
 *
 * The legend is a definition list, not a decorative caption — it is the
 * accessible version of the chart, so it has to be readable on its own.
 */

import { computed } from 'vue'

import AppCard from '@/components/atoms/AppCard.vue'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import BudgetDonut from '@/components/molecules/BudgetDonut.vue'
import SectionHeader from '@/components/molecules/SectionHeader.vue'
import { totalsFor, type BudgetSummary } from '@/domain/budgets'

const props = defineProps<{ summaries: BudgetSummary[] }>()

const totals = computed(() => totalsFor(props.summaries))
</script>

<template>
  <AppCard as="section">
    <SectionHeader title="Budgets" to="/budgets" destination="budgets" />

    <div v-if="props.summaries.length" class="c-budgets-summary">
      <BudgetDonut
        :summaries="props.summaries"
        :spent="totals.spent"
        :limit="totals.limit"
      />

      <dl class="c-budgets-summary__legend">
        <div
          v-for="summary in props.summaries"
          :key="summary.budget.id"
          class="c-budgets-summary__item"
          :style="{ '--marker': `var(--theme-${summary.budget.theme})` }"
        >
          <dt class="c-budgets-summary__label">{{ summary.budget.category }}</dt>
          <dd><MoneyAmount :amount="summary.budget.maximum" /></dd>
        </div>
      </dl>
    </div>

    <p v-else class="c-budgets-summary__empty">No budgets yet. Set one to start tracking.</p>
  </AppCard>
</template>

<style scoped lang="scss">
.c-budgets-summary {
  display: grid;
  gap: var(--space-6);
  align-items: center;

  @include mx.from('sm') {
    grid-template-columns: 1.2fr 1fr;
  }
}

.c-budgets-summary__legend {
  display: grid;
  gap: var(--space-4);

  @include mx.from('sm') {
    grid-template-columns: 1fr;
  }
}

.c-budgets-summary__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-inline-start: var(--space-4);
  border-inline-start: 4px solid var(--marker);
  border-radius: var(--radius-sm);
}

.c-budgets-summary__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.c-budgets-summary__empty {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
