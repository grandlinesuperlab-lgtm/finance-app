<script setup lang="ts">
/**
 * Budgets.
 *
 * The view owns which dialog is open and which record it is about; the cards
 * below only report that a button was pressed. Keeping that decision in one
 * place is what stops two dialogs from being open at once.
 */

import { computed, ref } from 'vue'

import type { Budget } from '@shared/types/finance'
import AppCard from '@/components/atoms/AppCard.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import BudgetCard from '@/components/molecules/BudgetCard.vue'
import BudgetDonut from '@/components/molecules/BudgetDonut.vue'
import OverviewSkeleton from '@/components/molecules/OverviewSkeleton.vue'
import BudgetFormDialog from '@/components/organisms/BudgetFormDialog.vue'
import ConfirmDialog from '@/components/organisms/ConfirmDialog.vue'
import { totalsFor, type BudgetInput } from '@/domain/budgets'
import { useFinanceStore } from '@/stores/finance'

const finance = useFinanceStore()

const summaries = computed(() => finance.budgetSummaries)
const totals = computed(() => totalsFor(summaries.value))

/** Which dialog is open, and about what. One value, so only one can be. */
const dialog = ref<{ kind: 'form' | 'delete'; budget?: Budget } | null>(null)

function openCreate() {
  dialog.value = { kind: 'form' }
}

function openEdit(budget: Budget) {
  dialog.value = { kind: 'form', budget }
}

function openDelete(budget: Budget) {
  dialog.value = { kind: 'delete', budget }
}

function close() {
  dialog.value = null
}

function submit(input: BudgetInput) {
  const editing = dialog.value?.budget
  if (editing) finance.updateBudget(editing.id, input)
  else finance.addBudget(input)
  close()
}

function confirmDelete() {
  const budget = dialog.value?.budget
  if (budget) finance.removeBudget(budget.id)
  close()
}
</script>

<template>
  <header class="c-page-header">
    <h1 class="c-page-title">Budgets</h1>
    <BaseButton @click="openCreate">+ Add New Budget</BaseButton>
  </header>

  <p v-if="finance.status === 'error'" class="c-page-message">
    We could not load your budgets.
    <BaseButton variant="secondary" @click="finance.load()">Try again</BaseButton>
  </p>

  <OverviewSkeleton v-else-if="finance.isLoading" />

  <div v-else class="l-budgets">
    <AppCard as="section" class="l-budgets__summary">
      <h2 class="c-summary-title">Spending Summary</h2>

      <BudgetDonut
        v-if="summaries.length"
        :summaries="summaries"
        :spent="totals.spent"
        :limit="totals.limit"
      />

      <dl v-if="summaries.length" class="c-summary-list">
        <div
          v-for="summary in summaries"
          :key="summary.budget.id"
          class="c-summary-item"
          :style="{ '--marker': `var(--theme-${summary.budget.theme})` }"
        >
          <dt class="c-summary-label">{{ summary.budget.category }}</dt>
          <dd class="c-summary-value">
            <MoneyAmount :amount="summary.spent" />
            <span class="c-summary-of">of {{ summary.budget.maximum.toFixed(2) }}</span>
          </dd>
        </div>
      </dl>

      <p v-else class="c-page-message">
        No budgets yet. Add one to start tracking a category.
      </p>
    </AppCard>

    <div class="l-budgets__cards">
      <BudgetCard
        v-for="summary in summaries"
        :key="summary.budget.id"
        :summary="summary"
        :transactions="finance.transactions"
        @edit="openEdit(summary.budget)"
        @remove="openDelete(summary.budget)"
      />
    </div>
  </div>

  <BudgetFormDialog
    :open="dialog?.kind === 'form'"
    :budget="dialog?.budget"
    :existing="finance.budgets"
    @submit="submit"
    @close="close"
  />

  <ConfirmDialog
    :open="dialog?.kind === 'delete'"
    :title="`Delete '${dialog?.budget?.category}'?`"
    description="Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever."
    confirm-label="Yes, confirm deletion"
    @confirm="confirmDelete"
    @close="close"
  />
</template>

<style scoped lang="scss">
.c-page-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  margin-block-end: var(--space-8);
}

.c-page-title {
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

.l-budgets {
  display: grid;
  gap: var(--space-6);

  @include mx.from('lg') {
    grid-template-columns: 1fr 1.2fr;
    align-items: start;
  }
}

.l-budgets__cards {
  display: grid;
  gap: var(--space-6);
  align-content: start;
}

.c-summary-title {
  margin-block-end: var(--space-5);
  font-size: var(--font-size-lg);
}

.c-summary-list {
  display: grid;
  gap: var(--space-4);
  margin-block-start: var(--space-6);
}

.c-summary-item {
  display: flex;
  gap: var(--space-4);
  align-items: baseline;
  justify-content: space-between;
  padding-inline-start: var(--space-4);
  border-inline-start: 4px solid var(--marker);
  border-radius: var(--radius-sm);
}

.c-summary-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.c-summary-value {
  display: flex;
  gap: var(--space-2);
  align-items: baseline;
}

.c-summary-of {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
