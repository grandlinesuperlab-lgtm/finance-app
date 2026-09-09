import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { Budget, FinanceData, Pot, Transaction } from '@shared/types/finance'
import { deposit, releasePot, withdraw, type Booking } from '@/domain/pots'
import type { BudgetInput } from '@/domain/budgets'
import type { PotInput } from '@/domain/pots'
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
      error.value = 'Deine Daten konnten nicht geladen werden. Please try again.'
      status.value = 'error'
    }
  }

  async function resetToSeed(): Promise<void> {
    data.value = await repository.reset()
    status.value = 'ready'
  }

  // --- Writes: budgets -------------------------------------------------------

  function addBudget(input: BudgetInput): void {
    if (!data.value) return
    data.value.budgets.push({ id: crypto.randomUUID(), ...input })
    void persist()
  }

  function updateBudget(id: string, input: BudgetInput): void {
    const budget = data.value?.budgets.find((entry) => entry.id === id)
    if (!budget) return
    Object.assign(budget, input)
    void persist()
  }

  function removeBudget(id: string): void {
    if (!data.value) return
    data.value.budgets = data.value.budgets.filter((budget) => budget.id !== id)
    void persist()
  }

  // --- Writes: pots ----------------------------------------------------------

  function addPot(input: PotInput): void {
    if (!data.value) return
    data.value.pots.push({ id: crypto.randomUUID(), total: 0, ...input })
    void persist()
  }

  function updatePot(id: string, input: PotInput): void {
    const pot = data.value?.pots.find((entry) => entry.id === id)
    if (!pot) return
    Object.assign(pot, input)
    void persist()
  }

  /**
   * Removing a pot returns everything saved in it to the balance. Money does
   * not vanish because its container was deleted.
   */
  function removePot(id: string): void {
    if (!data.value) return
    const pot = data.value.pots.find((entry) => entry.id === id)
    if (!pot) return

    data.value.balance = releasePot(data.value.balance, pot)
    data.value.pots = data.value.pots.filter((entry) => entry.id !== id)
    void persist()
  }

  /**
   * Both money movements go through one path, because both change the balance
   * and the pot together. The booking either applies in full or not at all;
   * the caller gets the reason back and shows it on the field.
   */
  function moveMoney(id: string, amount: number, direction: 'in' | 'out'): Booking {
    if (!data.value) return { ok: false, error: 'Deine Daten werden noch geladen.' }

    const pot = data.value.pots.find((entry) => entry.id === id)
    if (!pot) return { ok: false, error: 'Dieses Sparziel existiert nicht mehr.' }

    const booking =
      direction === 'in'
        ? deposit(data.value.balance, pot, amount)
        : withdraw(data.value.balance, pot, amount)

    if (!booking.ok) return booking

    data.value.balance = booking.balance
    Object.assign(pot, booking.pot)
    void persist()
    return booking
  }

  const depositToPot = (id: string, amount: number) => moveMoney(id, amount, 'in')
  const withdrawFromPot = (id: string, amount: number) => moveMoney(id, amount, 'out')

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
    addBudget,
    updateBudget,
    removeBudget,
    addPot,
    updatePot,
    removePot,
    depositToPot,
    withdrawFromPot,
    useRepository,
  }
})
