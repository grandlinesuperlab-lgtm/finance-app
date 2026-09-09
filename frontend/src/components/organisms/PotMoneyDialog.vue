<script setup lang="ts">
/**
 * Move money into or out of a pot.
 *
 * One component for both directions: the arithmetic differs by a sign and the
 * wording by a verb, and splitting it would duplicate the preview logic.
 *
 * The dialog states its own limit — "You can add up to €6,692.52" — rather
 * than waiting for the user to guess wrong and then correcting them. The
 * preview shows where the bar will land before anything is committed.
 */

import { computed, ref, watch } from 'vue'

import type { Balance, Pot } from '@shared/types/finance'
import AppNumberField from '@/components/atoms/AppNumberField.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import AppDialog from '@/components/molecules/AppDialog.vue'
import { deposit, potProgress, withdraw } from '@/domain/pots'
import { formatCurrency, formatPercent } from '@/utils/format'

const props = defineProps<{
  open: boolean
  pot?: Pot
  balance: Balance
  direction: 'in' | 'out'
}>()

const emit = defineEmits<{ submit: [amount: number]; close: [] }>()

const amount = ref('')
const error = ref<string | undefined>()

const isDeposit = computed(() => props.direction === 'in')

const limit = computed(() =>
  isDeposit.value ? props.balance.current : (props.pot?.total ?? 0),
)

const parsed = computed(() => Number.parseFloat(amount.value.replace(',', '.')))

/**
 * The preview runs the same domain function the store will run, so what the
 * user is shown and what actually happens cannot diverge.
 */
const preview = computed(() => {
  if (!props.pot || !Number.isFinite(parsed.value) || parsed.value <= 0) return props.pot
  const booking = isDeposit.value
    ? deposit(props.balance, props.pot, parsed.value)
    : withdraw(props.balance, props.pot, parsed.value)
  return booking.ok ? booking.pot : props.pot
})

watch(
  () => props.open,
  (open) => {
    if (!open) return
    amount.value = ''
    error.value = undefined
  },
  { immediate: true },
)

function onSubmit() {
  if (!props.pot) return
  const booking = isDeposit.value
    ? deposit(props.balance, props.pot, parsed.value)
    : withdraw(props.balance, props.pot, parsed.value)

  if (!booking.ok) {
    error.value = booking.error
    return
  }

  emit('submit', parsed.value)
}
</script>

<template>
  <AppDialog
    :open="props.open"
    :title="`${isDeposit ? 'Add to' : 'Withdraw from'} '${props.pot?.name}'`"
    :description="
      isDeposit
        ? 'Add money to your pot to keep it separate from your balance.'
        : 'Withdraw from your pot to put money back in your main balance.'
    "
    @close="emit('close')"
  >
    <form v-if="props.pot" class="c-pot-money" novalidate @submit.prevent="onSubmit">
      <dl class="c-pot-money__preview">
        <dt class="c-pot-money__preview-label">New Amount</dt>
        <dd class="c-pot-money__preview-value">
          {{ formatCurrency(preview?.total ?? props.pot.total) }}
        </dd>
      </dl>

      <progress
        class="c-pot-money__bar"
        :style="{ '--marker': `var(--theme-${props.pot.theme})` }"
        :aria-label="`${props.pot.name} after this change`"
        :value="Math.min(preview?.total ?? 0, props.pot.target)"
        :max="props.pot.target"
      />

      <p class="c-pot-money__scale">
        <span>{{ formatPercent(potProgress(preview ?? props.pot)) }}</span>
        <span>Target of {{ formatCurrency(props.pot.target) }}</span>
      </p>

      <AppNumberField
        v-model="amount"
        :label="isDeposit ? 'Amount to Add' : 'Amount to Withdraw'"
        :hint="`You can ${isDeposit ? 'add' : 'withdraw'} up to ${formatCurrency(limit)}.`"
        :error="error"
      />

      <BaseButton type="submit" block>
        {{ isDeposit ? 'Confirm Addition' : 'Confirm Withdrawal' }}
      </BaseButton>
    </form>
  </AppDialog>
</template>

<style scoped lang="scss">
.c-pot-money {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.c-pot-money__preview {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
}

.c-pot-money__preview-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.c-pot-money__preview-value {
  @include mx.numeric;

  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.c-pot-money__bar {
  display: block;
  width: 100%;
  height: 0.5rem;
  appearance: none;
  background-color: var(--color-surface-sunken);
  border: 0;
  border-radius: var(--radius-pill);

  &::-webkit-progress-bar {
    background-color: var(--color-surface-sunken);
    border-radius: var(--radius-pill);
  }

  &::-webkit-progress-value {
    background-color: var(--marker);
    border-radius: var(--radius-pill);
  }

  &::-moz-progress-bar {
    background-color: var(--marker);
    border-radius: var(--radius-pill);
  }
}

.c-pot-money__scale {
  display: flex;
  gap: var(--space-4);
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
