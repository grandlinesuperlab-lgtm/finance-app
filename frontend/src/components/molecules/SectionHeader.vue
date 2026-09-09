<script setup lang="ts">
/**
 * The header every overview card shares: a heading and a link into the page it
 * summarises.
 *
 * The visible link text is the same on all four cards. Someone listing the
 * links on a page would get "See Details" four times with no way to tell them
 * apart, so each carries an aria-label naming its destination while the
 * visible text stays as designed.
 */

import AppIcon from '@/components/atoms/AppIcon.vue'

const props = withDefaults(
  defineProps<{
    title: string
    to: string
    /** Completes "See details for …" as the link's accessible name. */
    destination: string
    linkText?: string
  }>(),
  { linkText: 'See Details' },
)
</script>

<template>
  <header class="c-section-header">
    <h2 class="c-section-header__title">{{ props.title }}</h2>
    <RouterLink
      class="c-section-header__link"
      :to="props.to"
      :aria-label="`${props.linkText} for ${props.destination}`"
    >
      {{ props.linkText }}
      <AppIcon name="chevronRight" />
    </RouterLink>
  </header>
</template>

<style scoped lang="scss">
.c-section-header {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  margin-block-end: var(--space-6);
}

.c-section-header__title {
  font-size: var(--font-size-lg);
}

.c-section-header__link {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-2);
  margin: calc(var(--space-2) * -1);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-decoration: none;

  @include mx.focus-ring;

  &:hover {
    color: var(--color-text);
  }
}

.c-section-header__link :deep(.c-app-icon) {
  width: 1rem;
  height: 1rem;
}
</style>
