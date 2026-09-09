<script setup lang="ts">
/**
 * The three headline figures.
 *
 * One definition list, not three separate blocks: current balance, income and
 * expenses are three label/value pairs of the same set, which is exactly what
 * `<dl>` describes. They only look like three cards.
 */

import type { Balance } from '@shared/types/finance'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'

const props = defineProps<{ balance: Balance }>()
</script>

<template>
  <dl class="c-balance-summary">
    <div class="c-balance-summary__item c-balance-summary__item--inverted">
      <dt class="c-balance-summary__label">Current Balance</dt>
      <dd><MoneyAmount :amount="props.balance.current" size="lg" /></dd>
    </div>

    <div class="c-balance-summary__item">
      <dt class="c-balance-summary__label">Income</dt>
      <dd><MoneyAmount :amount="props.balance.income" size="lg" /></dd>
    </div>

    <div class="c-balance-summary__item">
      <dt class="c-balance-summary__label">Expenses</dt>
      <dd><MoneyAmount :amount="props.balance.expenses" size="lg" /></dd>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.c-balance-summary {
  display: grid;
  gap: var(--space-4);

  @include mx.from('md') {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }
}

.c-balance-summary__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background-color: var(--color-surface);
  border-radius: var(--radius-md);

  @include mx.from('md') {
    padding: var(--space-6);
  }
}

// Dark in both themes, so it uses the non-flipping tokens rather than the
// inverse ones — the same trap the navigation fell into.
.c-balance-summary__item--inverted {
  color: var(--color-inverted-text);
  background-color: var(--color-inverted-surface);
}

.c-balance-summary__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.c-balance-summary__item--inverted .c-balance-summary__label {
  color: var(--color-inverted-text-muted);
}
</style>
