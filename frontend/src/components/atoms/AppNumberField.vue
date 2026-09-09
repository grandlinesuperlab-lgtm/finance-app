<script setup lang="ts">
/**
 * A labelled amount input.
 *
 * `inputmode="decimal"` rather than `type="number"`: number inputs scroll to a
 * different value when a mouse wheel passes over them, reject commas that many
 * keyboards produce, and vary between browsers in what they allow at all.
 * Text plus a decimal keypad behaves the same everywhere, and the value is
 * parsed and validated in the domain layer regardless.
 */

import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    error?: string
    hint?: string
    /** Rendered inside the field, before the value. */
    prefix?: string
  }>(),
  { error: undefined, hint: undefined, prefix: '€' },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const id = useId()
const errorId = `${id}-error`
const hintId = `${id}-hint`

const describedBy = computed(() =>
  [props.error ? errorId : null, props.hint ? hintId : null].filter(Boolean).join(' ') || undefined,
)
</script>

<template>
  <p class="c-app-number-field">
    <label class="c-app-number-field__label" :for="id">{{ props.label }}</label>

    <span class="c-app-number-field__control-wrap">
      <span class="c-app-number-field__prefix" aria-hidden="true">{{ props.prefix }}</span>
      <input
        :id="id"
        class="c-app-number-field__control"
        :class="{ 'c-app-number-field__control--invalid': props.error }"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        :value="props.modelValue"
        :aria-invalid="props.error ? true : undefined"
        :aria-describedby="describedBy"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </span>

    <span v-if="props.hint" :id="hintId" class="c-app-number-field__hint">{{ props.hint }}</span>
    <span v-if="props.error" :id="errorId" class="c-app-number-field__error">{{ props.error }}</span>
  </p>
</template>

<style scoped lang="scss">
.c-app-number-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.c-app-number-field__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
}

.c-app-number-field__control-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.c-app-number-field__prefix {
  position: absolute;
  inset-inline-start: var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--color-text-subtle);
}

.c-app-number-field__control {
  @include mx.numeric;
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

.c-app-number-field__control--invalid {
  border-color: var(--color-error);
}

.c-app-number-field__hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.c-app-number-field__error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
}
</style>
