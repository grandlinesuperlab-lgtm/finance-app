<script setup lang="ts">
/**
 * A monetary amount.
 *
 * The sign is always part of the text, never conveyed by colour alone: colour
 * is an enhancement for people who can see it, the sign is the fact.
 */

import { computed } from 'vue'

import { formatCurrency, formatCurrencyWhole, formatSignedCurrency } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    amount: number
    /** Render a leading + or -. Off for totals, where direction is implied. */
    signed?: boolean
    /** Drop the cents, for headline figures where they are noise. */
    whole?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { signed: false, whole: false, size: 'sm' },
)

const text = computed(() => {
  if (props.signed) return formatSignedCurrency(props.amount)
  return props.whole ? formatCurrencyWhole(props.amount) : formatCurrency(props.amount)
})
</script>

<template>
  <span
    class="c-money-amount"
    :class="[
      `c-money-amount--${props.size}`,
      { 'c-money-amount--positive': props.signed && props.amount > 0 },
    ]"
    >{{ text }}</span
  >
</template>

<style scoped lang="scss">
.c-money-amount {
  @include mx.numeric;

  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.c-money-amount--sm {
  font-size: var(--font-size-sm);
}

.c-money-amount--md {
  font-size: var(--font-size-md);
}

.c-money-amount--lg {
  font-size: var(--font-size-xl);
}

.c-money-amount--positive {
  color: var(--color-amount-positive);
}
</style>
