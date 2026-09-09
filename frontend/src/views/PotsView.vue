<script setup lang="ts">
/**
 * Pots.
 *
 * As on the budgets page, the view owns which dialog is open and about what.
 * Money movements go through the store, which runs the domain functions —
 * nothing here does arithmetic of its own.
 */

import { ref } from 'vue'

import type { Pot } from '@shared/types/finance'
import BaseButton from '@/components/atoms/BaseButton.vue'
import OverviewSkeleton from '@/components/molecules/OverviewSkeleton.vue'
import PotCard from '@/components/molecules/PotCard.vue'
import ConfirmDialog from '@/components/organisms/ConfirmDialog.vue'
import PotFormDialog from '@/components/organisms/PotFormDialog.vue'
import PotMoneyDialog from '@/components/organisms/PotMoneyDialog.vue'
import type { PotInput } from '@/domain/pots'
import { formatCurrency } from '@/utils/format'
import { useFinanceStore } from '@/stores/finance'

const finance = useFinanceStore()

type Dialog =
  | { kind: 'form'; pot?: Pot }
  | { kind: 'delete'; pot: Pot }
  | { kind: 'money'; pot: Pot; direction: 'in' | 'out' }

const dialog = ref<Dialog | null>(null)

function close() {
  dialog.value = null
}

function submitForm(input: PotInput) {
  const editing = dialog.value?.kind === 'form' ? dialog.value.pot : undefined
  if (editing) finance.updatePot(editing.id, input)
  else finance.addPot(input)
  close()
}

function submitMoney(amount: number) {
  if (dialog.value?.kind !== 'money') return
  const { pot, direction } = dialog.value
  if (direction === 'in') finance.depositToPot(pot.id, amount)
  else finance.withdrawFromPot(pot.id, amount)
  close()
}

function confirmDelete() {
  if (dialog.value?.kind === 'delete') finance.removePot(dialog.value.pot.id)
  close()
}
</script>

<template>
  <header class="c-page-header">
    <h1 class="c-page-title">Pots</h1>
    <BaseButton @click="dialog = { kind: 'form' }">+ Add New Pot</BaseButton>
  </header>

  <p v-if="finance.status === 'error'" class="c-page-message">
    We could not load your pots.
    <BaseButton variant="secondary" @click="finance.load()">Try again</BaseButton>
  </p>

  <OverviewSkeleton v-else-if="finance.isLoading" />

  <p v-else-if="!finance.pots.length" class="c-page-message">
    No pots yet. Add one to start saving towards something.
  </p>

  <div v-else class="l-pots">
    <PotCard
      v-for="pot in finance.pots"
      :key="pot.id"
      :pot="pot"
      @edit="dialog = { kind: 'form', pot }"
      @remove="dialog = { kind: 'delete', pot }"
      @add="dialog = { kind: 'money', pot, direction: 'in' }"
      @withdraw="dialog = { kind: 'money', pot, direction: 'out' }"
    />
  </div>

  <PotFormDialog
    :open="dialog?.kind === 'form'"
    :pot="dialog?.kind === 'form' ? dialog.pot : undefined"
    :existing="finance.pots"
    @submit="submitForm"
    @close="close"
  />

  <PotMoneyDialog
    :open="dialog?.kind === 'money'"
    :pot="dialog?.kind === 'money' ? dialog.pot : undefined"
    :balance="finance.balance"
    :direction="dialog?.kind === 'money' ? dialog.direction : 'in'"
    @submit="submitMoney"
    @close="close"
  />

  <ConfirmDialog
    :open="dialog?.kind === 'delete'"
    :title="`Delete '${dialog?.kind === 'delete' ? dialog.pot.name : ''}'?`"
    :description="`Are you sure you want to delete this pot? The ${
      dialog?.kind === 'delete' ? formatCurrency(dialog.pot.total) : ''
    } saved in it will be returned to your balance. This action cannot be reversed.`"
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

.l-pots {
  display: grid;
  gap: var(--space-6);

  @include mx.from('md') {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
