<script setup lang="ts">
/**
 * One budget: how much is allowed, how much is gone, and what went.
 *
 * Overspending is shown twice — the bar turns red and the text says
 * "over by …". Colour explains, text informs; anyone who cannot see the red
 * still learns the same fact.
 */

import { computed } from 'vue'

import type { Transaction } from '@shared/types/finance'
import AppAvatar from '@/components/atoms/AppAvatar.vue'
import AppCard from '@/components/atoms/AppCard.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import { latestInCategory, type BudgetSummary } from '@/domain/budgets'
import { formatCurrency, formatDate } from '@/utils/format'

const props = defineProps<{
  summary: BudgetSummary
  transactions: Transaction[]
}>()

const emit = defineEmits<{ edit: []; remove: [] }>()

const LATEST_COUNT = 3

const latest = computed(() =>
  latestInCategory(props.transactions, props.summary.budget.category, LATEST_COUNT),
)

const overspend = computed(() =>
  Math.max(0, props.summary.spent - props.summary.budget.maximum),
)
</script>

<template>
  <AppCard as="article">
    <header class="c-budget-card__header">
      <h2 class="c-budget-card__title">
        <span
          class="c-budget-card__marker"
          :style="{ '--marker': `var(--theme-${props.summary.budget.theme})` }"
          aria-hidden="true"
        />
        {{ props.summary.budget.category }}
      </h2>

      <p class="c-budget-card__actions">
        <button
          class="c-budget-card__action"
          type="button"
          :aria-label="`Edit the ${props.summary.budget.category} budget`"
          @click="emit('edit')"
        >
          <AppIcon name="edit" />
        </button>
        <button
          class="c-budget-card__action"
          type="button"
          :aria-label="`Delete the ${props.summary.budget.category} budget`"
          @click="emit('remove')"
        >
          <AppIcon name="trash" />
        </button>
      </p>
    </header>

    <p class="c-budget-card__maximum">
      Maximum of {{ formatCurrency(props.summary.budget.maximum) }}
    </p>

    <progress
      class="c-budget-card__bar"
      :style="{ '--marker': `var(--theme-${props.summary.budget.theme})` }"
      :aria-label="`${props.summary.budget.category} budget used`"
      :class="{ 'c-budget-card__bar--over': props.summary.overspent }"
      :value="Math.min(props.summary.spent, props.summary.budget.maximum)"
      :max="props.summary.budget.maximum"
    >
      {{ Math.round(props.summary.ratio * 100) }}%
    </progress>

    <p v-if="props.summary.overspent" class="c-budget-card__over">
      Over budget by {{ formatCurrency(overspend) }}.
    </p>

    <dl class="c-budget-card__figures">
      <dt>Spent</dt>
      <dd><MoneyAmount :amount="props.summary.spent" /></dd>
      <dt>Remaining</dt>
      <dd><MoneyAmount :amount="props.summary.remaining" /></dd>
    </dl>

    <section class="c-budget-card__latest">
      <header class="c-budget-card__latest-header">
        <h3 class="c-budget-card__latest-title">Latest Spending</h3>
        <RouterLink
          class="c-budget-card__see-all"
          :to="{ path: '/transactions', query: { category: props.summary.budget.category } }"
          :aria-label="`See all ${props.summary.budget.category} transactions`"
        >
          See All
          <AppIcon name="chevronRight" />
        </RouterLink>
      </header>

      <ul v-if="latest.length" class="c-budget-card__list" role="list">
        <li v-for="transaction in latest" :key="transaction.id">
          <AppAvatar :name="transaction.name" />
          <span class="c-budget-card__name">{{ transaction.name }}</span>
          <span class="c-budget-card__figures-inline">
            <MoneyAmount :amount="transaction.amount" signed />
            <time class="c-budget-card__date" :datetime="transaction.date">
              {{ formatDate(transaction.date) }}
            </time>
          </span>
        </li>
      </ul>

      <p v-else class="c-budget-card__empty">Nothing spent in this category yet.</p>
    </section>
  </AppCard>
</template>

<style scoped lang="scss">
.c-budget-card__header {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  margin-block-end: var(--space-5);
}

.c-budget-card__title {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  font-size: var(--font-size-lg);
}

.c-budget-card__marker {
  width: 1rem;
  height: 1rem;
  background-color: var(--marker);
  border-radius: var(--radius-pill);
}

.c-budget-card__actions {
  display: flex;
  gap: var(--space-1);
}

.c-budget-card__action {
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

.c-budget-card__maximum {
  margin-block-end: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

// A native <progress>: it carries the value and the maximum for assistive
// technology, so the bar is not a decorative div pretending to mean something.
.c-budget-card__bar {
  display: block;
  width: 100%;
  height: 2rem;
  appearance: none;
  background-color: var(--color-surface-sunken);
  border: 0;
  border-radius: var(--radius-sm);

  &::-webkit-progress-bar {
    background-color: var(--color-surface-sunken);
    border-radius: var(--radius-sm);
  }

  &::-webkit-progress-value {
    background-color: var(--marker, var(--color-accent));
    border-radius: var(--radius-sm);
  }

  &::-moz-progress-bar {
    background-color: var(--marker, var(--color-accent));
    border-radius: var(--radius-sm);
  }
}

.c-budget-card__bar--over {
  &::-webkit-progress-value {
    background-color: var(--color-error);
  }

  &::-moz-progress-bar {
    background-color: var(--color-error);
  }
}

.c-budget-card__over {
  margin-block-start: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-error);
}

// Two rows, filled column by column, so each label sits above its own value
// without a wrapper element around every pair.
.c-budget-card__figures {
  display: grid;
  grid-template-rows: auto auto;
  grid-auto-flow: column;
  gap: var(--space-1) var(--space-4);
  margin-block-start: var(--space-4);

  > dt {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }
}

.c-budget-card__latest {
  padding: var(--space-5);
  margin-block-start: var(--space-5);
  background-color: var(--color-surface-sunken);
  border-radius: var(--radius-sm);
}

.c-budget-card__latest-header {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  margin-block-end: var(--space-3);
}

.c-budget-card__latest-title {
  font-size: var(--font-size-md);
}

.c-budget-card__see-all {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-2);
  margin: calc(var(--space-2) * -1);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-decoration: none;

  @include mx.focus-ring;

  &:hover {
    color: var(--color-text);
  }
}

.c-budget-card__list > li {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  padding-block: var(--space-3);
}

.c-budget-card__list > li + li {
  border-block-start: var(--border-width) solid var(--color-border);
}

.c-budget-card__name {
  @include mx.truncate;

  flex: 1;
  min-width: 0;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.c-budget-card__figures-inline {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  align-items: flex-end;
}

.c-budget-card__date {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.c-budget-card__empty {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
