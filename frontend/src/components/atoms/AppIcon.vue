<script setup lang="ts">
/**
 * Inline SVG icons.
 *
 * Inline rather than an icon font or a sprite sheet: the icons inherit
 * `currentColor`, scale with the surrounding text, and cost no extra request.
 *
 * Icons are decorative by default and hidden from assistive technology. When
 * an icon is the only content of a control, the control carries the accessible
 * name — not the icon.
 */

import { ICON_PATHS, type IconName } from './icon-paths'

const props = withDefaults(
  defineProps<{
    name: IconName
    /** Set only when the icon carries meaning nothing else on screen conveys. */
    label?: string
  }>(),
  { label: undefined },
)
</script>

<template>
  <svg
    class="c-app-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="props.label ? undefined : true"
    :role="props.label ? 'img' : undefined"
    focusable="false"
  >
    <title v-if="props.label">{{ props.label }}</title>
    <path :d="ICON_PATHS[props.name]" />
  </svg>
</template>

<style scoped lang="scss">
.c-app-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
}
</style>
