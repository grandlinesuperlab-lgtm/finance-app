<script setup lang="ts">
/**
 * The recurring bills table.
 *
 * A real `<table>`, like the transactions page and for the same reason: three
 * columns you compare across rows. Below `md` the due-date column is dropped
 * and repeated as a second line under the name, so the table keeps its
 * semantics at every width without an ARIA patch.
 *
 * Status is a word first. The tick and the exclamation mark are decoration on
 * top of "Paid" and "Due soon", never the only carrier — a coloured glyph is
 * unreadable to anyone who cannot see it or cannot tell the colours apart.
 */

import AppAvatar from '@/components/atoms/AppAvatar.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import MoneyAmount from '@/components/atoms/MoneyAmount.vue'
import type { RecurringBill } from '@/domain/bills'
import { formatOrdinalDay } from '@/utils/format'

const props = defineProps<{ bills: RecurringBill[]; caption: string }>()

const STATUS_LABEL: Record<RecurringBill['status'], string> = {
  paid: 'Paid',
  'due-soon': 'Due soon',
  upcoming: 'Upcoming',
}
</script>

<template>
  <table class="c-bills-table">
    <caption class="u-visually-hidden">
      {{
        props.caption
      }}
    </caption>

    <thead>
      <tr>
        <th class="c-bills-table__head" scope="col">Bill Title</th>
        <th class="c-bills-table__head c-bills-table__head--wide" scope="col">Due Date</th>
        <th class="c-bills-table__head c-bills-table__head--end" scope="col">Amount</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="bill in props.bills" :key="bill.name" class="c-bills-table__row">
        <th class="c-bills-table__name" scope="row">
          <!--
            A two-column grid rather than a nested text column: the avatar
            spans both rows, so the name and the repeated due date need no
            wrapper of their own.
          -->
          <span class="c-bills-table__name-layout">
            <AppAvatar class="c-bills-table__avatar" :name="bill.name" />
            <span class="c-bills-table__title">{{ bill.name }}</span>
            <span class="c-bills-table__secondary">
              Monthly — {{ formatOrdinalDay(bill.dueDay) }}
            </span>
          </span>
        </th>

        <td class="c-bills-table__due">
          <span class="c-bills-table__due-text" :class="`c-bills-table__due-text--${bill.status}`">
            Monthly — {{ formatOrdinalDay(bill.dueDay) }}
            <!--
              The icon carries the status as its own accessible name, so the
              state is announced without a second hidden copy of the word.
            -->
            <AppIcon
              v-if="bill.status === 'paid'"
              name="check"
              :label="STATUS_LABEL[bill.status]"
            />
            <AppIcon
              v-else-if="bill.status === 'due-soon'"
              name="warning"
              :label="STATUS_LABEL[bill.status]"
            />
          </span>
        </td>

        <td class="c-bills-table__amount" :class="`c-bills-table__amount--${bill.status}`">
          <MoneyAmount :amount="bill.amount" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.c-bills-table {
  width: 100%;
}

.c-bills-table__head {
  padding-block-end: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-muted);
  text-align: start;
  border-block-end: var(--border-width) solid var(--color-border);
}

.c-bills-table__head--wide {
  display: none;

  @include mx.from('md') {
    display: table-cell;
  }
}

.c-bills-table__head--end {
  text-align: end;
}

.c-bills-table__row > * {
  padding-block: var(--space-4);
  vertical-align: middle;
  border-block-end: var(--border-width) solid var(--color-border);
}

.c-bills-table__name {
  font-weight: var(--font-weight-regular);
  text-align: start;
}

.c-bills-table__name-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-1) var(--space-4);
  align-content: center;
}

.c-bills-table__avatar {
  grid-row: 1 / 3;
  align-self: center;
}

.c-bills-table__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

// The repeated due date, shown only while its own column is hidden.
.c-bills-table__secondary {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);

  @include mx.from('md') {
    display: none;
  }
}

.c-bills-table__due {
  display: none;

  @include mx.from('md') {
    display: table-cell;
  }
}

.c-bills-table__due-text {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.c-bills-table__due-text--paid {
  color: var(--color-amount-positive);
}

.c-bills-table__due-text--due-soon {
  color: var(--color-error);
}

.c-bills-table__due-text :deep(.c-app-icon) {
  width: 1rem;
  height: 1rem;
}

.c-bills-table__amount {
  text-align: end;
  white-space: nowrap;
}

.c-bills-table__amount--due-soon {
  color: var(--color-error);
}
</style>
