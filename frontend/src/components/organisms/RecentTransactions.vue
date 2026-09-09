<script setup lang="ts">
/**
 * The five most recent movements.
 *
 * A list, not a table — and the difference is deliberate. On the transactions
 * page this data is tabular: you compare it across columns, sort it and filter
 * it, and a <table> is what lets a screen reader navigate it that way. Here it
 * is a short chronicle of what happened last. A single-column table without a
 * header row would be a table in name only.
 */

import type { Transaction } from '@shared/types/finance'
import AppAvatar from '@/components/atoms/AppAvatar.vue'
import AppCard from '@/components/atoms/AppCard.vue'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import SectionHeader from '@/components/molecules/SectionHeader.vue'
import { formatDate } from '@/utils/format'

const props = defineProps<{ transactions: Transaction[] }>()
</script>

<template>
  <AppCard as="section">
    <SectionHeader
      title="Transactions"
      to="/transactions"
      destination="transactions"
      link-text="View All"
    />

    <ul v-if="props.transactions.length" class="c-recent-transactions" role="list">
      <li v-for="transaction in props.transactions" :key="transaction.id">
        <AppAvatar :name="transaction.name" />
        <span class="c-recent-transactions__name">{{ transaction.name }}</span>
        <span class="c-recent-transactions__figures">
          <MoneyAmount :amount="transaction.amount" signed />
          <time class="c-recent-transactions__date" :datetime="transaction.date">
            {{ formatDate(transaction.date) }}
          </time>
        </span>
      </li>
    </ul>

    <p v-else class="c-recent-transactions__empty">Nothing has moved yet.</p>
  </AppCard>
</template>

<style scoped lang="scss">
.c-recent-transactions > li {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  padding-block: var(--space-4);
}

.c-recent-transactions > li + li {
  border-block-start: var(--border-width) solid var(--color-border);
}

.c-recent-transactions__name {
  @include mx.truncate;

  flex: 1;
  min-width: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.c-recent-transactions__figures {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  align-items: flex-end;
}

.c-recent-transactions__date {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.c-recent-transactions__empty {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
