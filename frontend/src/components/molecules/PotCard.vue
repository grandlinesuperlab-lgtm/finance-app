<script setup lang="ts">
/**
 * One savings pot: what is in it, how far that is towards the target, and the
 * two ways to change it.
 *
 * The percentage is rendered as text beside the bar rather than left to the
 * bar alone — a length is hard to read precisely, and impossible to read at
 * all without seeing it.
 */

import { computed } from 'vue'

import type { Pot } from '@shared/types/finance'
import AppCard from '@/components/atoms/AppCard.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import { potProgress } from '@/domain/pots'
import { formatCurrency, formatPercent } from '@/utils/format'

const props = defineProps<{ pot: Pot }>()

const emit = defineEmits<{ edit: []; remove: []; add: []; withdraw: [] }>()

const progress = computed(() => potProgress(props.pot))
</script>

<template>
  <AppCard as="article">
    <header class="c-pot-card__header">
      <h2 class="c-pot-card__title">
        <span
          class="c-pot-card__marker"
          :style="{ '--marker': `var(--theme-${props.pot.theme})` }"
          aria-hidden="true"
        />
        {{ props.pot.name }}
      </h2>

      <p class="c-pot-card__actions">
        <button
          class="c-pot-card__action"
          type="button"
          :aria-label="`Sparziel ${props.pot.name} bearbeiten`"
          @click="emit('edit')"
        >
          <AppIcon name="edit" />
        </button>
        <button
          class="c-pot-card__action"
          type="button"
          :aria-label="`Sparziel ${props.pot.name} löschen`"
          @click="emit('remove')"
        >
          <AppIcon name="trash" />
        </button>
      </p>
    </header>

    <dl class="c-pot-card__total">
      <dt class="c-pot-card__total-label">Gespart</dt>
      <dd><MoneyAmount :amount="props.pot.total" size="lg" /></dd>
    </dl>

    <progress
      class="c-pot-card__bar"
      :style="{ '--marker': `var(--theme-${props.pot.theme})` }"
      :aria-label="`${props.pot.name}: Fortschritt zum Ziel`"
      :value="Math.min(props.pot.total, props.pot.target)"
      :max="props.pot.target"
    >
      {{ formatPercent(progress) }}
    </progress>

    <p class="c-pot-card__scale">
      <span class="c-pot-card__percent">{{ formatPercent(progress) }}</span>
      <span>Ziel: {{ formatCurrency(props.pot.target) }}</span>
    </p>

    <p class="c-pot-card__buttons">
      <BaseButton variant="secondary" block @click="emit('add')">+ Einzahlen</BaseButton>
      <BaseButton variant="secondary" block @click="emit('withdraw')">Auszahlen</BaseButton>
    </p>
  </AppCard>
</template>

<style scoped lang="scss">
.c-pot-card__header {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  margin-block-end: var(--space-8);
}

.c-pot-card__title {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  font-size: var(--font-size-lg);
}

.c-pot-card__marker {
  width: 1rem;
  height: 1rem;
  background-color: var(--marker);
  border-radius: var(--radius-pill);
}

.c-pot-card__actions {
  display: flex;
  gap: var(--space-1);
}

.c-pot-card__action {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  color: var(--color-text-muted);
  background: none;
  border: 0;
  border-radius: var(--radius-sm);

  @include mx.focus-ring;

  &:hover {
    color: var(--color-text);
  }
}

.c-pot-card__total {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  margin-block-end: var(--space-4);
}

.c-pot-card__total-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.c-pot-card__bar {
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

.c-pot-card__scale {
  display: flex;
  gap: var(--space-4);
  justify-content: space-between;
  margin-block: var(--space-3) var(--space-8);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.c-pot-card__percent {
  font-weight: var(--font-weight-bold);
}

.c-pot-card__buttons {
  display: flex;
  gap: var(--space-4);
}
</style>
