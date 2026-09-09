import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { CATEGORIES } from '@shared/types/finance'
import {
  SORT_OPTIONS,
  type CategoryFilter,
  type SortOption,
  type TransactionQuery,
} from '@/domain/transactions'
import { useDebouncedRef } from './useDebouncedRef'

/**
 * The transactions query, kept in the URL.
 *
 * The filter is part of the address, not hidden component state: a filtered
 * view can be linked, survives a reload, and the back button undoes a filter
 * the way people expect it to.
 *
 * Everything read from the URL is validated. A query string is user input —
 * hand-edited, stale from an old link, or simply wrong — and an unknown sort
 * value must fall back to the default rather than reach the domain layer.
 */

export const ALL_CATEGORIES = 'All Transactions' as const
export const CATEGORY_FILTERS: readonly CategoryFilter[] = [ALL_CATEGORIES, ...CATEGORIES]

const DEFAULT_SORT: SortOption = 'Latest'
const PER_PAGE = 10

function firstValue(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : ''
  return typeof value === 'string' ? value : ''
}

export function useTransactionQuery() {
  const route = useRoute()
  const router = useRouter()

  // Reads are immediate so the input never lags; the write to the URL waits
  // for a pause in typing.
  const searchInput = useDebouncedRef(firstValue(route.query.search))

  const query = computed<TransactionQuery>(() => {
    const sort = firstValue(route.query.sort)
    const category = firstValue(route.query.category)
    const page = Number.parseInt(firstValue(route.query.page), 10)

    return {
      search: firstValue(route.query.search),
      category: (CATEGORY_FILTERS as readonly string[]).includes(category)
        ? (category as CategoryFilter)
        : ALL_CATEGORIES,
      sort: (SORT_OPTIONS as readonly string[]).includes(sort)
        ? (sort as SortOption)
        : DEFAULT_SORT,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      perPage: PER_PAGE,
    }
  })

  /**
   * Writes the query back to the URL.
   *
   * Default values are omitted, so an untouched page keeps a clean address and
   * `?sort=Latest&page=1` never appears just because the page was opened.
   */
  function apply(patch: Partial<TransactionQuery>, mode: 'push' | 'replace' = 'replace') {
    const next = { ...query.value, ...patch }

    // Any change to what is being searched invalidates the page number: page 4
    // of a now shorter result is an empty screen.
    if (patch.search !== undefined || patch.category !== undefined || patch.sort !== undefined) {
      next.page = 1
    }

    const params: Record<string, string> = {}
    if (next.search) params.search = next.search
    if (next.category !== ALL_CATEGORIES) params.category = next.category
    if (next.sort !== DEFAULT_SORT) params.sort = next.sort
    if (next.page > 1) params.page = String(next.page)

    void router[mode]({ query: params })
  }

  // Typing writes with `replace`: `push` would put a history entry behind every
  // debounced keystroke and turn the back button into a rewind of the search.
  watch(searchInput, (value) => apply({ search: value }, 'replace'))

  // Keeps the field in step when the URL changes from elsewhere — the back
  // button, or a link opened with a search already in it.
  watch(
    () => query.value.search,
    (value) => {
      if (value !== searchInput.value) searchInput.value = value
    },
  )

  const isFiltered = computed(
    () => query.value.search !== '' || query.value.category !== ALL_CATEGORIES,
  )

  function clearFilters() {
    searchInput.value = ''
    apply({ search: '', category: ALL_CATEGORIES }, 'push')
  }

  return { query, searchInput, isFiltered, apply, clearFilters }
}
