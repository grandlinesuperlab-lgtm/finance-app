<script setup lang="ts">
/**
 * The transactions table.
 *
 * A real `<table>` at every width — this is tabular data, and a grid of
 * generic elements would give a screen reader nothing to navigate by. The
 * caption names the table and carries the focus target used after paging.
 */

import { useTemplateRef } from 'vue'

import type { Transaction } from '@shared/types/finance'
import TransactionRow from '@/components/molecules/TransactionRow.vue'

const props = withDefaults(
  defineProps<{
    transactions: Transaction[]
    /** Announced by the caption, so the table says what is currently in it. */
    caption: string
    /** Renders placeholder rows in place of data. */
    loading?: boolean
    skeletonRows?: number
  }>(),
  { loading: false, skeletonRows: 10 },
)

const captionElement = useTemplateRef('captionElement')

/**
 * Moves focus to the caption.
 *
 * Called after a page change: without it the focus stays on a Next button that
 * now belongs to different content, and a keyboard user has no idea the table
 * beneath them was replaced.
 */
function focusCaption(): void {
  captionElement.value?.focus()
}

defineExpose({ focusCaption })
</script>

<template>
  <table class="c-transactions-table">
    <caption ref="captionElement" class="u-visually-hidden" tabindex="-1">
      {{
        props.caption
      }}
    </caption>

    <thead>
      <tr>
        <th class="c-transactions-table__head" scope="col">Recipient / Sender</th>
        <th class="c-transactions-table__head c-transactions-table__head--wide" scope="col">
          Category
        </th>
        <th class="c-transactions-table__head c-transactions-table__head--wide" scope="col">
          Transaction Date
        </th>
        <th class="c-transactions-table__head c-transactions-table__head--end" scope="col">
          Amount
        </th>
      </tr>
    </thead>

    <tbody v-if="props.loading">
      <tr v-for="row in props.skeletonRows" :key="row" class="c-transactions-table__skeleton">
        <td><span class="c-transactions-table__bar" /></td>
        <td class="c-transactions-table__head--wide"><span class="c-transactions-table__bar" /></td>
        <td class="c-transactions-table__head--wide"><span class="c-transactions-table__bar" /></td>
        <td><span class="c-transactions-table__bar" /></td>
      </tr>
    </tbody>

    <tbody v-else>
      <TransactionRow
        v-for="transaction in props.transactions"
        :key="transaction.id"
        :transaction="transaction"
      />
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.c-transactions-table {
  width: 100%;
}

.c-transactions-table__head {
  padding-block-end: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-muted);
  text-align: start;
  border-block-end: var(--border-width) solid var(--color-border);
}

// Hidden together with the matching cells in the row, so the header row and
// the body always agree on how many columns exist.
.c-transactions-table__head--wide {
  display: none;

  @include mx.from('md') {
    display: table-cell;
  }
}

.c-transactions-table__head--end {
  text-align: end;
}

// Placeholder rows keep the table at roughly its final height, so nothing
// jumps when the data arrives.
.c-transactions-table__skeleton > td {
  padding-block: var(--space-5);
  border-block-end: var(--border-width) solid var(--color-border);
}

.c-transactions-table__bar {
  display: block;
  height: 0.75rem;
  background-color: var(--color-surface-sunken);
  border-radius: var(--radius-pill);
}
</style>
