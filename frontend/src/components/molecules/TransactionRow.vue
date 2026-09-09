<script setup lang="ts">
/**
 * One row of the transactions table.
 *
 * Below the `md` layout there is no room for four columns, so Category and
 * Transaction Date are dropped as columns and repeated as a second line inside
 * the two columns that remain. Both variants carry the same text and exactly
 * one of them is ever displayed — the hidden one is removed from the
 * accessibility tree with `display: none`, so nothing is announced twice.
 *
 * The alternative would be to switch the table to `display: block` on small
 * screens, which strips the table semantics and then needs them patched back
 * in with ARIA. This keeps a real table at every width instead.
 */

import type { Transaction } from '@shared/types/finance'
import AppAvatar from '@/components/atoms/AppAvatar.vue'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import { formatDate } from '@/utils/format'

const props = defineProps<{ transaction: Transaction }>()
</script>

<template>
  <tr class="c-transaction-row">
    <!--
      The layout lives on an inner wrapper, never on the <th> itself: giving a
      table cell `display: flex` strips its cell semantics in every browser,
      which is exactly what this component exists to avoid.
    -->
    <th class="c-transaction-row__party" scope="row">
      <span class="c-transaction-row__party-layout">
        <AppAvatar :name="props.transaction.name" />
        <span class="c-transaction-row__name">{{ props.transaction.name }}</span>
        <span class="c-transaction-row__secondary">{{ props.transaction.category }}</span>
      </span>
    </th>

    <td class="c-transaction-row__category">{{ props.transaction.category }}</td>

    <td class="c-transaction-row__date">
      <time :datetime="props.transaction.date">{{ formatDate(props.transaction.date) }}</time>
    </td>

    <td class="c-transaction-row__amount">
      <MoneyAmount :amount="props.transaction.amount" signed />
      <time class="c-transaction-row__secondary" :datetime="props.transaction.date">{{
        formatDate(props.transaction.date)
      }}</time>
    </td>
  </tr>
</template>

<style scoped lang="scss">
.c-transaction-row > * {
  padding-block: var(--space-4);
  vertical-align: middle;
  border-block-end: var(--border-width) solid var(--color-border);
}

.c-transaction-row__party {
  font-weight: var(--font-weight-regular);
  text-align: start;
}

.c-transaction-row__party-layout {
  display: flex;
  flex-wrap: wrap;

  // Column gap separates avatar from name; the row gap only applies once the
  // secondary line wraps, and wants to be much tighter than the column gap.
  gap: var(--space-1) var(--space-4);
  align-items: center;
}

.c-transaction-row__name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

// The repeated value. Shown only while its own column is hidden, and hidden
// with display:none so it never reaches assistive technology twice.
.c-transaction-row__secondary {
  display: block;
  margin-block-start: var(--space-1);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-muted);

  @include mx.from('md') {
    display: none;
  }
}

.c-transaction-row__party-layout .c-transaction-row__secondary {
  flex-basis: 100%;
  margin-block-start: 0;
  margin-inline-start: calc(2.5rem + var(--space-4));
}

.c-transaction-row__category,
.c-transaction-row__date {
  display: none;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);

  @include mx.from('md') {
    display: table-cell;
  }
}

.c-transaction-row__amount {
  text-align: end;
  white-space: nowrap;
}
</style>
