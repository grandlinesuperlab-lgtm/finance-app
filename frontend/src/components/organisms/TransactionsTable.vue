<script setup lang="ts">
/**
 * The transactions table.
 *
 * A real `<table>` at every width — this is tabular data, and a grid of
 * generic elements would give a screen reader nothing to navigate by. The
 * caption names the table and carries the focus target used after paging.
 */

import type { Transaction } from '@shared/types/finance'
import TransactionRow from '@/components/molecules/TransactionRow.vue'

const props = defineProps<{
  transactions: Transaction[]
  /** Announced by the caption, so the table says what is currently in it. */
  caption: string
}>()
</script>

<template>
  <table class="c-transactions-table">
    <caption class="u-visually-hidden" tabindex="-1">
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

    <tbody>
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
</style>
