<script setup lang="ts">
/**
 * A labelled text input.
 *
 * The error is tied to the field with `aria-describedby` and `aria-invalid`,
 * so a screen reader announces the problem when focus reaches the field —
 * rather than a summary at the top of the form that the person has already
 * scrolled past.
 */

import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    error?: string
    hint?: string
    placeholder?: string
    maxlength?: number
  }>(),
  { error: undefined, hint: undefined, placeholder: '', maxlength: undefined },
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
  <p class="c-app-field">
    <label class="c-app-field__label" :for="id">{{ props.label }}</label>

    <input
      :id="id"
      class="c-app-field__control"
      :class="{ 'c-app-field__control--invalid': props.error }"
      type="text"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :maxlength="props.maxlength"
      :aria-invalid="props.error ? true : undefined"
      :aria-describedby="describedBy"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <span v-if="props.hint" :id="hintId" class="c-app-field__hint">{{ props.hint }}</span>
    <span v-if="props.error" :id="errorId" class="c-app-field__error">{{ props.error }}</span>
  </p>
</template>

<style scoped lang="scss">
.c-app-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.c-app-field__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
}

.c-app-field__control {
  min-height: 2.8125rem;
  padding-inline: var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border-input);
  border-radius: var(--radius-sm);

  @include mx.focus-ring;

  &::placeholder {
    color: var(--color-text-subtle);
  }
}

.c-app-field__control--invalid {
  border-color: var(--color-error);
}

.c-app-field__hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.c-app-field__error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
}
</style>
