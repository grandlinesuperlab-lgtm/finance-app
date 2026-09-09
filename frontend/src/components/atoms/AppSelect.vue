<script setup lang="ts">
/**
 * A labelled native select.
 *
 * Native rather than a custom dropdown: keyboard navigation, type-ahead, the
 * platform picker on touch devices and correct announcement all come for free.
 * A hand-built menu would have to reimplement every one of them, and usually
 * reimplements the first two badly.
 *
 * The label can be hidden visually where the design has no room, but it is
 * always in the accessibility tree — a select whose only clue is its current
 * value is unusable without sight.
 */

import { useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    options: readonly string[]
    /** Hide the label visually below the given breakpoint's layout. */
    hideLabel?: boolean
    error?: string
    /** Label above the control instead of beside it, as forms expect. */
    stacked?: boolean
  }>(),
  { hideLabel: false, error: undefined, stacked: false },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const id = useId()
const errorId = `${id}-error`
</script>

<template>
  <p class="c-app-select" :class="{ 'c-app-select--stacked': props.stacked }">
    <label
      class="c-app-select__label"
      :class="{ 'u-visually-hidden': props.hideLabel }"
      :for="id"
      >{{ props.label }}</label
    >
    <select
      :id="id"
      class="c-app-select__control"
      :value="props.modelValue"
      :aria-invalid="props.error ? true : undefined"
      :aria-describedby="props.error ? errorId : undefined"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in props.options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <span v-if="props.error" :id="errorId" class="c-app-select__error">{{ props.error }}</span>
  </p>
</template>

<style scoped lang="scss">
.c-app-select {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}

// In a form the label belongs above its control, so every field in the column
// starts at the same edge. Beside the control is right only in the toolbar,
// where the label reads as part of a sentence.
.c-app-select--stacked {
  flex-direction: column;
  align-items: stretch;
}

.c-app-select--stacked .c-app-select__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.c-app-select__error {
  flex-basis: 100%;
  font-size: var(--font-size-xs);
  color: var(--color-error);
}

.c-app-select__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.c-app-select__control {
  min-height: 2.8125rem;
  padding-inline: var(--space-5) var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-sm);

  @include mx.focus-ring;
}
</style>
