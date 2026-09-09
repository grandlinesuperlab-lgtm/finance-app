<script setup lang="ts">
/**
 * Colour picker for a budget or pot.
 *
 * A native `<select>` listing the theme names, with a swatch beside it showing
 * the current choice. The name is the information and the colour is the
 * addition — a picker made only of coloured squares is unusable to anyone who
 * cannot distinguish them, and unreadable to a screen reader.
 *
 * Themes already taken are `disabled` and say so in their label, rather than
 * being hidden: seeing that a colour exists but is spoken for explains the
 * absence, where a silently shortened list just looks incomplete.
 */

import { computed, useId } from 'vue'

import { THEMES, type Theme } from '@shared/types/finance'

const props = withDefaults(
  defineProps<{
    modelValue: Theme
    label: string
    /** Themes in use by other records, which cannot be picked again. */
    taken?: Theme[]
    error?: string
  }>(),
  { taken: () => [], error: undefined },
)

defineEmits<{ 'update:modelValue': [value: Theme] }>()

const id = useId()
const errorId = `${id}-error`

/** "light-purple" reads better as "Light purple" in a menu. */
function labelFor(theme: Theme): string {
  const words = theme.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

const options = computed(() =>
  THEMES.map((theme) => ({
    value: theme,
    label: labelFor(theme),
    // The currently selected theme is never disabled, even while in use — it
    // is in use by this very record.
    disabled: props.taken.includes(theme) && theme !== props.modelValue,
  })),
)
</script>

<template>
  <p class="c-app-theme-select">
    <label class="c-app-theme-select__label" :for="id">{{ props.label }}</label>

    <span class="c-app-theme-select__control-wrap">
      <span
        class="c-app-theme-select__swatch"
        :style="{ '--swatch': `var(--theme-${props.modelValue})` }"
        aria-hidden="true"
      />
      <select
        :id="id"
        class="c-app-theme-select__control"
        :value="props.modelValue"
        :aria-invalid="props.error ? true : undefined"
        :aria-describedby="props.error ? errorId : undefined"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value as Theme)"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}{{ option.disabled ? ' — already used' : '' }}
        </option>
      </select>
    </span>

    <span v-if="props.error" :id="errorId" class="c-app-theme-select__error">{{
      props.error
    }}</span>
  </p>
</template>

<style scoped lang="scss">
.c-app-theme-select {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.c-app-theme-select__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
}

.c-app-theme-select__control-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.c-app-theme-select__swatch {
  position: absolute;
  inset-inline-start: var(--space-5);
  width: 1rem;
  height: 1rem;
  background-color: var(--swatch);
  border-radius: var(--radius-pill);
}

.c-app-theme-select__control {
  @include mx.focus-ring;

  width: 100%;
  min-height: 2.8125rem;
  padding-inline: var(--space-10) var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border-input);
  border-radius: var(--radius-sm);
}

.c-app-theme-select__error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
}
</style>
