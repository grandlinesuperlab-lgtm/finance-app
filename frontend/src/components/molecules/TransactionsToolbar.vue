<script setup lang="ts">
/**
 * Search, sort and category filter.
 *
 * Presentational: it receives values and emits changes, and knows nothing
 * about the store or the URL. That keeps a single owner for the query — the
 * view — and makes this component usable anywhere the same three controls fit.
 */

import AppSearchInput from '@/components/atoms/AppSearchInput.vue'
import AppSelect from '@/components/atoms/AppSelect.vue'
import { SORT_OPTIONS, type CategoryFilter, type SortOption } from '@/domain/transactions'
import { CATEGORY_FILTERS } from '@/composables/useTransactionQuery'

const props = defineProps<{
  search: string
  sort: SortOption
  category: CategoryFilter
}>()

defineEmits<{
  'update:search': [value: string]
  'update:sort': [value: SortOption]
  'update:category': [value: CategoryFilter]
}>()
</script>

<template>
  <div class="c-transactions-toolbar">
    <AppSearchInput
      class="c-transactions-toolbar__search"
      :model-value="props.search"
      label="Search transactions by name"
      placeholder="Search transaction"
      @update:model-value="$emit('update:search', $event)"
    />

    <AppSelect
      :model-value="props.sort"
      label="Sort by"
      :options="SORT_OPTIONS"
      @update:model-value="$emit('update:sort', $event as SortOption)"
    />

    <AppSelect
      :model-value="props.category"
      label="Category"
      :options="CATEGORY_FILTERS"
      @update:model-value="$emit('update:category', $event as CategoryFilter)"
    />
  </div>
</template>

<style scoped lang="scss">
.c-transactions-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
  margin-block-end: var(--space-6);
}

.c-transactions-toolbar__search {
  flex: 1 1 100%;

  @include mx.from('md') {
    flex: 1 1 auto;
    max-width: 20rem;
    margin-inline-end: auto;
  }
}
</style>
