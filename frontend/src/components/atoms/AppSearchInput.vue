<script setup lang="ts">
/**
 * A search field.
 *
 * `type="search"`, wrapped in a `role="search"` landmark, with a real label.
 * The placeholder is a hint, never the label: it disappears as soon as
 * anything is typed, and several screen readers do not announce it at all.
 */

import { useId } from 'vue'

import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    placeholder?: string
  }>(),
  { placeholder: '' },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const id = useId()
</script>

<template>
  <search class="c-app-search">
    <label class="u-visually-hidden" :for="id">{{ props.label }}</label>
    <input
      :id="id"
      class="c-app-search__control"
      type="search"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <AppIcon class="c-app-search__icon" name="search" />
  </search>
</template>

<style scoped lang="scss">
.c-app-search {
  position: relative;
  display: flex;
  align-items: center;
}

.c-app-search__control {
  width: 100%;
  min-height: 2.8125rem;
  padding-inline: var(--space-5) var(--space-10);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-sm);

  @include mx.focus-ring;

  &::placeholder {
    color: var(--color-text-subtle);
  }
}

.c-app-search__icon {
  position: absolute;
  inset-inline-end: var(--space-4);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text);
  pointer-events: none;
}
</style>
