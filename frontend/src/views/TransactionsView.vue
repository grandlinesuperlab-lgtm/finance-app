<script setup lang="ts">
/**
 * Transactions.
 *
 * The view owns the query state and hands plain data down. No component below
 * it reads the store, so there is exactly one answer to "what is being shown
 * right now" and it lives here.
 */

import { computed } from 'vue'

import AppCard from '@/components/atoms/AppCard.vue'
import TransactionsTable from '@/components/organisms/TransactionsTable.vue'
import { queryTransactions } from '@/domain/transactions'
import { useTransactionQuery } from '@/composables/useTransactionQuery'
import { useFinanceStore } from '@/stores/finance'

const finance = useFinanceStore()
const { query } = useTransactionQuery()

const page = computed(() => queryTransactions(finance.transactions, query.value))

const caption = computed(
  () => `Transactions, page ${page.value.page} of ${page.value.pageCount}`,
)
</script>

<template>
  <h1 class="c-page-title">Transactions</h1>

  <AppCard as="section" :busy="finance.isLoading">
    <TransactionsTable :transactions="page.items" :caption="caption" />
  </AppCard>
</template>

<style scoped lang="scss">
.c-page-title {
  margin-block-end: var(--space-8);
  font-size: var(--font-size-xl);
}
</style>
