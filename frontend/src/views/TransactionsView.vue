<script setup lang="ts">
/**
 * Transactions.
 *
 * The view owns the query state and hands plain data down. Nothing below it
 * reads the store, so there is exactly one answer to "what is being shown
 * right now" and it lives here.
 */

import { computed, nextTick, useTemplateRef } from 'vue'

import AppCard from '@/components/atoms/AppCard.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import AppPagination from '@/components/molecules/AppPagination.vue'
import TransactionsToolbar from '@/components/molecules/TransactionsToolbar.vue'
import TransactionsTable from '@/components/organisms/TransactionsTable.vue'
import { queryTransactions } from '@/domain/transactions'
import { useTransactionQuery } from '@/composables/useTransactionQuery'
import { useFinanceStore } from '@/stores/finance'

const finance = useFinanceStore()
const { query, searchInput, isFiltered, apply, clearFilters } = useTransactionQuery()

const table = useTemplateRef('table')

const page = computed(() => queryTransactions(finance.transactions, query.value))

/**
 * Which of the five states the page is in.
 *
 * "empty" and "no-results" are deliberately separate: an account with no
 * transactions at all and a filter that happens to match nothing need
 * different words and different offers, and treating them as one is the most
 * common mistake on a screen like this.
 */
const state = computed(() => {
  if (finance.status === 'error') return 'error'
  if (finance.status === 'idle' || finance.isLoading) return 'loading'
  if (finance.transactions.length === 0) return 'empty'
  if (page.value.total === 0) return 'no-results'
  return 'ready'
})

const resultSummary = computed(() => {
  const { total } = page.value
  const noun = total === 1 ? 'Transaktion' : 'Transaktionen'
  return isFiltered.value
    ? `${total} passende von ${finance.transactions.length} ${noun}`
    : `${total} ${noun}`
})

const caption = computed(
  () => `Transaktionen, Seite ${page.value.page} von ${page.value.pageCount}`,
)

async function goToPage(next: number) {
  // A page change is a real navigation, so it goes into history with push and
  // the back button returns to the previous page of results.
  apply({ page: next }, 'push')
  await nextTick()
  table.value?.focusCaption()
}
</script>

<template>
  <h1 class="c-page-title">Transaktionen</h1>

  <AppCard as="section" :busy="state === 'loading'">
    <TransactionsToolbar
      v-model:search="searchInput"
      :sort="query.sort"
      :category="query.category"
      @update:sort="apply({ sort: $event })"
      @update:category="apply({ category: $event })"
    />

    <p class="c-page-status" role="status">{{ resultSummary }}</p>

    <TransactionsTable
      v-if="state === 'loading' || state === 'ready'"
      ref="table"
      :transactions="page.items"
      :caption="caption"
      :loading="state === 'loading'"
    />

    <p v-else-if="state === 'error'" class="c-page-message">
      Deine Transaktionen konnten nicht geladen werden.
      <BaseButton variant="secondary" @click="finance.load()">Erneut versuchen</BaseButton>
    </p>

    <p v-else-if="state === 'empty'" class="c-page-message">
      Noch keine Transaktionen. Sobald Geld fließt, erscheint es hier.
    </p>

    <p v-else class="c-page-message">
      Keine Transaktion passt zu deiner Suche.
      <BaseButton variant="secondary" @click="clearFilters">Filter zurücksetzen</BaseButton>
    </p>

    <AppPagination
      v-if="state === 'ready'"
      :page="page.page"
      :page-count="page.pageCount"
      @change="goToPage"
    />
  </AppCard>
</template>

<style scoped lang="scss">
.c-page-title {
  margin-block-end: var(--space-8);
  font-size: var(--font-size-xl);
}

// Announced politely whenever the count changes, so a filter that removes
// everything is not silent for someone who cannot see the table empty out.
.c-page-status {
  margin-block-end: var(--space-4);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.c-page-message {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  align-items: flex-start;
  padding-block: var(--space-10);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
