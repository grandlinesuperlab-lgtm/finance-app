<script setup lang="ts">
/**
 * Overview.
 *
 * A summary of the other four screens. Every figure comes from the store,
 * which computes nothing itself — the arithmetic lives in domain/.
 */

import BaseButton from '@/components/atoms/BaseButton.vue'
import BalanceSummary from '@/components/organisms/BalanceSummary.vue'
import { useFinanceStore } from '@/stores/finance'

const finance = useFinanceStore()
</script>

<template>
  <h1 class="c-page-title">Overview</h1>

  <p v-if="finance.status === 'error'" class="c-page-message">
    We could not load your data.
    <BaseButton variant="secondary" @click="finance.load()">Try again</BaseButton>
  </p>

  <div v-else class="l-overview" :aria-busy="finance.isLoading || undefined">
    <BalanceSummary class="l-overview__balance" :balance="finance.balance" />
  </div>
</template>

<style scoped lang="scss">
.c-page-title {
  margin-block-end: var(--space-8);
  font-size: var(--font-size-xl);
}

.c-page-message {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  align-items: flex-start;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

// One column on small screens, two from lg with the wider one first. DOM order
// is reading order in both, so nothing is repositioned with `order`.
.l-overview {
  display: grid;
  gap: var(--space-6);

  @include mx.from('lg') {
    grid-template-columns: 1.2fr 1fr;
    align-items: start;
  }
}

.l-overview__balance {
  @include mx.from('lg') {
    grid-column: 1 / -1;
  }
}
</style>
