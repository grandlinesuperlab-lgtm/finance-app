import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { Budget, FinanceData, Pot, Transaction } from '@shared/types/finance'
import { localFinanceRepository, type FinanceRepository } from '@/services/finance'
import { summariseBudgets } from '@/domain/budgets'
import { deriveRecurringBills, summariseBills } from '@/domain/bills'

/**
 * The application's single source of truth.
 *
 * The store holds state and the actions that change it. It never talks to the
 * network or to localStorage directly — that is the repository's job — and it
 * never computes anything itself: every derived figure comes from `domain/`,
 * so the arithmetic stays testable without a store instance.
 */

type Status = 'idle' | 'loading' | 'ready' | 'error'

export const useFinanceStore = defineStore('finance', () => {
  // Injectable so a test, or a future backend, can swap the source.
  let repository: FinanceRepository = localFinanceRepository

  const data = ref<FinanceData | null>(null)
  const status = ref<Status>('idle')
  const error = ref<string | null>(null)

  // --- Reads -----------------------------------------------------------------

  const transactions = computed<Transaction[]>(() => data.value?.transactions ?? [])
  const budgets = computed<Budget[]>(() => data.value?.budgets ?? [])
  const pots = computed<Pot[]>(() => data.value?.pots ?? [])
  const balance = computed(
    () => data.value?.balance ?? { current: 0, income: 0, expenses: 0 },
  )

  const isLoading = computed(() => status.value === 'loading')
  const isEmpty = computed(() => status.value === 'ready' && transactions.value.length === 0)

  const budgetSummaries = computed(() =>
    summariseBudgets(budgets.value, transactions.value),
  )
  const recurringBills = computed(() => deriveRecurringBills(transactions.value))
  const billTotals = computed(() => summariseBills(recurringBills.value))

  /** Total saved across all pots, shown on the overview. */
  const totalSaved = computed(() =>
    pots.value.reduce((sum, pot) => sum + pot.total, 0),
  )

  // --- Writes ----------------------------------------------------------------

  async function persist(): Promise<void> {
    if (data.value) await repository.save(data.value)
  }

  async function load(): Promise<void> {
    status.value = 'loading'
    error.value = null
    try {
      data.value = await repository.load()
      status.value = 'ready'
    } catch {
      error.value = 'We could not load your data. Please try again.'
      status.value = 'error'
    }
  }

  async function resetToSeed(): Promise<void> {
    data.value = await repository.reset()
    status.value = 'ready'
  }

  /** For tests and for a future backend implementation. */
  function useRepository(next: FinanceRepository): void {
    repository = next
  }

  return {
    // state
    data,
    status,
    error,
    // reads
    transactions,
    budgets,
    pots,
    balance,
    isLoading,
    isEmpty,
    budgetSummaries,
    recurringBills,
    billTotals,
    totalSaved,
    // writes
    load,
    persist,
    resetToSeed,
    useRepository,
  }
})
