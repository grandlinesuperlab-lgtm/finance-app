<script setup lang="ts">
/**
 * The reference atom. Every other atom follows this shape.
 *
 * Renders a real <button>, never a styled <div>: that is what gives keyboard
 * activation, focus handling and the correct role for free.
 */

type Variant = 'primary' | 'secondary' | 'ghost'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    /** Renders a spinner and blocks activation. */
    loading?: boolean
    disabled?: boolean
    /** Explicit, because the HTML default ("submit") surprises people. */
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    loading: false,
    disabled: false,
    type: 'button',
  },
)

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    class="c-base-button"
    :class="`c-base-button--${props.variant}`"
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading"
    @click="$emit('click', $event)"
  >
    <!-- Decorative: the accessible state is carried by aria-busy above. -->
    <svg
      v-if="props.loading"
      class="c-base-button__spinner"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>

    <slot />
  </button>
</template>

<style scoped lang="scss">
.c-base-button {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
  min-height: 2.75rem; // 44px touch target
  padding-inline: var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--easing-standard);

  @include mx.focus-ring;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.c-base-button--primary {
  color: var(--color-text-inverse);
  background-color: var(--color-accent);

  &:hover:not(:disabled) {
    background-color: var(--color-accent-hover);
  }
}

.c-base-button--secondary {
  color: var(--color-text);
  background-color: var(--color-surface);
  border-color: var(--color-border-strong);

  &:hover:not(:disabled) {
    background-color: var(--color-surface-sunken);
  }
}

.c-base-button--ghost {
  color: var(--color-accent);
  background-color: transparent;

  &:hover:not(:disabled) {
    background-color: var(--color-accent-subtle);
  }
}

.c-base-button__spinner {
  width: 1em;
  height: 1em;
  stroke-dasharray: 28;
  stroke-dashoffset: 20;
  animation: c-base-button-spin 0.8s linear infinite;
}

@keyframes c-base-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
