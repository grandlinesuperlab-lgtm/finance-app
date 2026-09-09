<script setup lang="ts">
/**
 * The white surface everything on a page sits on.
 *
 * The element is chosen by the caller rather than fixed here: a card is a
 * visual treatment, not a meaning. A page region passes `section`, a
 * self-contained item passes `article`, and only a genuinely meaningless
 * wrapper leaves the default.
 */

const props = withDefaults(
  defineProps<{
    as?: 'div' | 'section' | 'article' | 'aside'
    /** Removes the inner padding, for cards that hold a full-bleed table. */
    flush?: boolean
    busy?: boolean
  }>(),
  { as: 'div', flush: false, busy: false },
)
</script>

<template>
  <component
    :is="props.as"
    class="c-app-card"
    :class="{ 'c-app-card--flush': props.flush }"
    :aria-busy="props.busy || undefined"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
.c-app-card {
  padding: var(--space-6) var(--space-5);
  background-color: var(--color-surface);
  border-radius: var(--radius-md);

  @include mx.from('md') {
    padding: var(--space-8);
  }
}

.c-app-card--flush {
  padding: 0;
}
</style>
