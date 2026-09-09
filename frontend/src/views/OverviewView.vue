<script setup lang="ts">
/**
 * Overview.
 *
 * A summary of the other four screens. Every figure comes from the store,
 * which computes nothing itself — the arithmetic lives in domain/.
 */

import { computed } from 'vue'

import BaseButton from '@/components/atoms/BaseButton.vue'
import OverviewSkeleton from '@/components/molecules/OverviewSkeleton.vue'
import BalanceSummary from '@/components/organisms/BalanceSummary.vue'
import PotsSummary from '@/components/organisms/PotsSummary.vue'
import RecentTransactions from '@/components/organisms/RecentTransactions.vue'
import BudgetsSummary from '@/components/organisms/BudgetsSummary.vue'
import RecurringBillsSummary from '@/components/organisms/RecurringBillsSummary.vue'
import { latestTransactions } from '@/domain/transactions'
import { useFinanceStore } from '@/stores/finance'

const RECENT_COUNT = 5

const finance = useFinanceStore()

const recent = computed(() => latestTransactions(finance.transactions, RECENT_COUNT))
</script>

<template>
  <h1 class="c-page-title">Overview</h1>

  <p v-if="finance.status === 'error'" class="c-page-message">
    We could not load your data.
    <BaseButton variant="secondary" @click="finance.load()">Try again</BaseButton>
  </p>

  <OverviewSkeleton v-else-if="finance.isLoading" />

  <div v-else class="l-overview">
    <BalanceSummary class="l-overview__balance" :balance="finance.balance" />

    <!--
      Two column wrappers rather than grid areas: the cards in each column have
      very different heights, and areas would force the two columns onto shared
      rows and open a gap under the shorter card. Purely presentational, and on
      one column they collapse away without changing the reading order.
    -->
    <div class="l-overview__column">
      <PotsSummary :pots="finance.pots" :total-saved="finance.totalSaved" />
      <RecentTransactions :transactions="recent" />
    </div>

    <div class="l-overview__column">
      <BudgetsSummary :summaries="finance.budgetSummaries" />
      <RecurringBillsSummary :totals="finance.billTotals" />
    </div>
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

.l-overview__column {
  display: grid;
  gap: var(--space-6);
  align-content: start;
}

</style>
