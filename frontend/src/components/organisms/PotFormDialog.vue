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
import { useInvalidFocus } from '@/composables/useInvalidFocus'
import { isValid, validatePot, type FieldErrors, type PotInput } from '@/domain/pots'

const props = defineProps<{
  open: boolean
  /** Absent when creating. */
  pot?: Pot
  existing: Pot[]
}>()

const emit = defineEmits<{ submit: [input: PotInput]; close: [] }>()

const { focusFirstInvalid } = useInvalidFocus('form')

const NAME_LIMIT = 30

const name = ref('')
const target = ref('')
const theme = ref<Theme>('green')
const errors = ref<FieldErrors<PotInput>>({})

const isEditing = computed(() => Boolean(props.pot))

const takenThemes = computed(() =>
  props.existing
    .filter((entry) => entry.id !== props.pot?.id)
    .map((entry) => entry.theme),
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
  if (!isValid(errors.value)) return focusFirstInvalid()

  emit('submit', input)
}
</script>

<template>
  <AppDialog
    :open="props.open"
    :title="isEditing ? 'Sparziel bearbeiten' : 'Neues Sparziel'"
    :description="
      isEditing
        ? 'Passe dein Sparziel an, wenn sich etwas ändert.'
        : 'Lege ein Sparziel an, um gezielt auf eine Anschaffung hinzusparen.'
    "
    @close="emit('close')"
  >
    <form ref="form" class="c-pot-form" novalidate @submit.prevent="onSubmit">
      <AppTextField
        v-model="name"
        label="Name"
        placeholder="z. B. Notgroschen"
        :maxlength="NAME_LIMIT"
        :hint="`Noch ${remaining} Zeichen`"
        :error="errors.name"
      />

      <AppNumberField v-model="target" label="Sparziel" :error="errors.target" />

      <AppThemeSelect
        v-model="theme"
        label="Farbe"
        :taken="takenThemes"
        :error="errors.theme"
      />

      <BaseButton type="submit" block>
        {{ isEditing ? 'Änderungen speichern' : 'Sparziel anlegen' }}
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
