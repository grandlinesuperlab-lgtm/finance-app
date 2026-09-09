<script setup lang="ts">
/**
 * Recurring bills.
 *
 * Search and sort live in component state rather than the URL, unlike the
 * transactions page. That is a deliberate difference: a filtered transaction
 * list is linked to from the budget cards and is worth sharing, while nothing
 * links into a filtered bill list. The machinery is the same either way and
 * can be lifted into the URL the day something needs to point here.
 */

import { computed, ref } from 'vue'

import AppCard from '@/components/atoms/AppCard.vue'
import AppSearchInput from '@/components/atoms/AppSearchInput.vue'
import AppSelect from '@/components/atoms/AppSelect.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import OverviewSkeleton from '@/components/molecules/OverviewSkeleton.vue'
import RecurringBillsTable from '@/components/organisms/RecurringBillsTable.vue'
import { BILL_SORT_OPTIONS, queryBills, type BillSortOption } from '@/domain/bills'
import { useFinanceStore } from '@/stores/finance'

const finance = useFinanceStore()

const search = ref('')
const sort = ref<BillSortOption>('Latest')

const visible = computed(() =>
  queryBills(finance.recurringBills, { search: search.value, sort: sort.value }),
)

const total = computed(() =>
  finance.recurringBills.reduce((sum, bill) => sum + bill.amount, 0),
)

/** Counts alongside the amounts, because "2 bills" reads better than a sum alone. */
const counts = computed(() => ({
  paid: finance.recurringBills.filter((bill) => bill.status === 'paid').length,
  upcoming: finance.recurringBills.filter((bill) => bill.status !== 'paid').length,
  dueSoon: finance.recurringBills.filter((bill) => bill.status === 'due-soon').length,
}))

/**
 * The three rows of the summary panel. Built here rather than in the template
 * so the counts and the amounts are paired once instead of three times.
 */
const summaryRows = computed(() => [
  { key: 'paid', label: 'Paid Bills', count: counts.value.paid, amount: finance.billTotals.paid },
  {
    key: 'upcoming',
    label: 'Total Upcoming',
    count: counts.value.upcoming,
    amount: finance.billTotals.upcoming,
  },
  {
    key: 'dueSoon',
    label: 'Due Soon',
    count: counts.value.dueSoon,
    amount: finance.billTotals.dueSoon,
  },
])

const caption = computed(() => `Recurring bills, ${visible.value.length} shown`)
</script>

<template>
  <h1 class="c-page-title">Recurring Bills</h1>

  <p v-if="finance.status === 'error'" class="c-page-message">
    We could not load your bills.
    <BaseButton variant="secondary" @click="finance.load()">Try again</BaseButton>
  </p>

  <OverviewSkeleton v-else-if="finance.isLoading" />

  <div v-else class="l-bills">
    <div class="l-bills__aside">
      <AppCard as="section" class="c-total">
        <h2 class="c-total__label">Total Bills</h2>
        <p class="c-total__value"><MoneyAmount :amount="total" size="lg" /></p>
      </AppCard>

      <AppCard as="section">
        <h2 class="c-summary__title">Summary</h2>
        <dl class="c-summary">
          <div v-for="row in summaryRows" :key="row.key" class="c-summary__row">
            <dt :class="{ 'c-summary__label--alert': row.key === 'dueSoon' }">
              {{ row.label }} ({{ row.count }})
            </dt>
            <dd :class="{ 'c-summary__value--alert': row.key === 'dueSoon' }">
              <MoneyAmount :amount="row.amount" />
            </dd>
          </div>
        </dl>
      </AppCard>
    </div>

    <AppCard as="section" class="l-bills__main">
      <div class="c-bills-toolbar">
        <AppSearchInput
          v-model="search"
          class="c-bills-toolbar__search"
          label="Search bills by name"
          placeholder="Search bills"
        />
        <AppSelect
          v-model="sort"
          label="Sort by"
          :options="BILL_SORT_OPTIONS"
          @update:model-value="sort = $event as BillSortOption"
        />
      </div>

      <p class="c-page-status" role="status">
        {{ visible.length }} of {{ finance.recurringBills.length }} bills
      </p>

      <RecurringBillsTable v-if="visible.length" :bills="visible" :caption="caption" />

      <p v-else class="c-page-message">No bills match your search.</p>
    </AppCard>
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
  padding-block: var(--space-8);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.c-page-status {
  margin-block-end: var(--space-4);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.l-bills {
  display: grid;
  gap: var(--space-6);
  align-items: start;

  @include mx.from('lg') {
    grid-template-columns: 20rem 1fr;
  }
}

.l-bills__aside {
  display: grid;
  gap: var(--space-6);
  align-content: start;
}

.c-total {
  color: var(--color-inverted-text);
  background-color: var(--color-inverted-surface);
}

.c-total__label {
  margin-block-end: var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  color: var(--color-inverted-text-muted);
}

.c-summary__title {
  margin-block-end: var(--space-4);
  font-size: var(--font-size-md);
}

.c-summary {
  display: grid;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
}

.c-summary__row {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  color: var(--color-text-muted);
}

.c-summary__row + .c-summary__row {
  padding-block-start: var(--space-3);
  border-block-start: var(--border-width) solid var(--color-border);
}

// Due soon is the row that needs attention, so it is coloured — and it also
// says "Due Soon", so the colour is never the only signal.
.c-summary__label--alert,
.c-summary__value--alert {
  color: var(--color-error);
}

.c-bills-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
  margin-block-end: var(--space-5);
}

.c-bills-toolbar__search {
  flex: 1 1 100%;

  @include mx.from('md') {
    flex: 1 1 auto;
    max-width: 20rem;
    margin-inline-end: auto;
  }
}
</style>
