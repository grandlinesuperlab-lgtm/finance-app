<script setup lang="ts">
/**
 * Create or edit a budget.
 *
 * One component for both, because the fields and the rules are identical and
 * only the wording differs. Two components would mean two places to change a
 * validation rule, and one of them would be missed.
 *
 * Validation runs in the domain layer, not here: this component collects
 * strings, hands them over, and renders whatever comes back on the field it
 * belongs to.
 */

import { computed, ref, watch } from 'vue'

import type { Budget, Category, Theme } from '@shared/types/finance'
import { CATEGORIES, THEMES } from '@shared/types/finance'
import AppNumberField from '@/components/atoms/AppNumberField.vue'
import AppSelect from '@/components/atoms/AppSelect.vue'
import AppThemeSelect from '@/components/atoms/AppThemeSelect.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import AppDialog from '@/components/molecules/AppDialog.vue'
import { validateBudget, type BudgetInput } from '@/domain/budgets'
import { isValid, type FieldErrors } from '@/domain/pots'

const props = defineProps<{
  open: boolean
  /** Absent when creating. */
  budget?: Budget
  existing: Budget[]
}>()

const emit = defineEmits<{ submit: [input: BudgetInput]; close: [] }>()

const category = ref<Category>('Entertainment')
const maximum = ref('')
const theme = ref<Theme>('green')
const errors = ref<FieldErrors<BudgetInput>>({})

const isEditing = computed(() => Boolean(props.budget))

const takenThemes = computed(() =>
  props.existing.filter((entry) => entry.id !== props.budget?.id).map((entry) => entry.theme),
)

const takenCategories = computed(() =>
  props.existing.filter((entry) => entry.id !== props.budget?.id).map((entry) => entry.category),
)

function firstFreeCategory(): Category {
  return CATEGORIES.find((entry) => !takenCategories.value.includes(entry)) ?? CATEGORIES[0]
}

function firstFreeTheme(): Theme {
  return THEMES.find((entry) => !takenThemes.value.includes(entry)) ?? THEMES[0]
}

// Reset every time the dialog opens, so a cancelled edit does not leak its
// half-typed values into the next one.
watch(
  () => props.open,
  (open) => {
    if (!open) return
    errors.value = {}
    // A new record starts on the first category and colour that are still
    // free. Defaulting to a fixed pair would open the form already invalid and
    // blame the user for a choice they never made.
    category.value = props.budget?.category ?? firstFreeCategory()
    maximum.value = props.budget ? String(props.budget.maximum) : ''
    theme.value = props.budget?.theme ?? firstFreeTheme()
  },
  { immediate: true },
)

function onSubmit() {
  // Commas are what a German keyboard produces; accepting them here beats
  // telling the user their own number is wrong.
  const input: BudgetInput = {
    category: category.value,
    maximum: Number.parseFloat(maximum.value.replace(',', '.')),
    theme: theme.value,
  }

  errors.value = validateBudget(input, props.existing, props.budget?.id)
  if (!isValid(errors.value)) return

  emit('submit', input)
}
</script>

<template>
  <AppDialog
    :open="props.open"
    :title="isEditing ? 'Edit Budget' : 'Add New Budget'"
    :description="
      isEditing
        ? 'As your budgets change, feel free to update your spending limits.'
        : 'Choose a category to set a spending budget. These categories can help you monitor spending.'
    "
    @close="emit('close')"
  >
    <form class="c-budget-form" novalidate @submit.prevent="onSubmit">
      <AppSelect
        v-model="category"
        label="Budget Category"
        :options="CATEGORIES"
        :error="errors.category"
        stacked
      />

      <AppNumberField v-model="maximum" label="Maximum Spend" :error="errors.maximum" />

      <AppThemeSelect
        v-model="theme"
        label="Colour Tag"
        :taken="takenThemes"
        :error="errors.theme"
      />

      <BaseButton type="submit" block>
        {{ isEditing ? 'Save Changes' : 'Add Budget' }}
      </BaseButton>
    </form>
  </AppDialog>
</template>

<style scoped lang="scss">
.c-budget-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
