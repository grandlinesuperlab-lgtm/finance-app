<script setup lang="ts">
/**
 * Create or edit a savings pot.
 *
 * Same shape as the budget form and for the same reason: one component for
 * both operations, because the fields and the rules are identical and only
 * the wording differs.
 */

import { computed, ref, watch } from 'vue'

import type { Pot, Theme } from '@shared/types/finance'
import { THEMES } from '@shared/types/finance'
import AppNumberField from '@/components/atoms/AppNumberField.vue'
import AppTextField from '@/components/atoms/AppTextField.vue'
import AppThemeSelect from '@/components/atoms/AppThemeSelect.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import AppDialog from '@/components/molecules/AppDialog.vue'
import { isValid, validatePot, type FieldErrors, type PotInput } from '@/domain/pots'

const props = defineProps<{
  open: boolean
  /** Absent when creating. */
  pot?: Pot
  existing: Pot[]
}>()

const emit = defineEmits<{ submit: [input: PotInput]; close: [] }>()

const NAME_LIMIT = 30

const name = ref('')
const target = ref('')
const theme = ref<Theme>('green')
const errors = ref<FieldErrors<PotInput>>({})

const isEditing = computed(() => Boolean(props.pot))

const takenThemes = computed(() =>
  props.existing.filter((entry) => entry.id !== props.pot?.id).map((entry) => entry.theme),
)

function firstFreeTheme(): Theme {
  return THEMES.find((entry) => !takenThemes.value.includes(entry)) ?? THEMES[0]
}

const remaining = computed(() => NAME_LIMIT - name.value.length)

watch(
  () => props.open,
  (open) => {
    if (!open) return
    errors.value = {}
    name.value = props.pot?.name ?? ''
    target.value = props.pot ? String(props.pot.target) : ''
    theme.value = props.pot?.theme ?? firstFreeTheme()
  },
  { immediate: true },
)

function onSubmit() {
  const input: PotInput = {
    name: name.value.trim(),
    target: Number.parseFloat(target.value.replace(',', '.')),
    theme: theme.value,
  }

  errors.value = validatePot(input, props.existing, props.pot?.id)
  if (!isValid(errors.value)) return

  emit('submit', input)
}
</script>

<template>
  <AppDialog
    :open="props.open"
    :title="isEditing ? 'Edit Pot' : 'Add New Pot'"
    :description="
      isEditing
        ? 'If your saving targets change, feel free to update your pot.'
        : 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.'
    "
    @close="emit('close')"
  >
    <form class="c-pot-form" novalidate @submit.prevent="onSubmit">
      <AppTextField
        v-model="name"
        label="Pot Name"
        placeholder="e.g. Rainy Days"
        :maxlength="NAME_LIMIT"
        :hint="`${remaining} characters left`"
        :error="errors.name"
      />

      <AppNumberField v-model="target" label="Target" :error="errors.target" />

      <AppThemeSelect
        v-model="theme"
        label="Colour Tag"
        :taken="takenThemes"
        :error="errors.theme"
      />

      <BaseButton type="submit" block>
        {{ isEditing ? 'Save Changes' : 'Add Pot' }}
      </BaseButton>
    </form>
  </AppDialog>
</template>

<style scoped lang="scss">
.c-pot-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
