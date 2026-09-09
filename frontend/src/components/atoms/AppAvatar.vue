<script setup lang="ts">
/**
 * A generated avatar: initials on a coloured disc.
 *
 * Inline SVG rather than an image, because the source data has no avatar
 * files. It is decorative — the name it stands for is always rendered beside
 * it — so it is hidden from assistive technology instead of repeating the name.
 */

import { computed } from 'vue'

import { avatarThemeFor } from '@/domain/avatars'
import { initialsFor } from '@/utils/format'

const props = defineProps<{ name: string }>()

const initials = computed(() => initialsFor(props.name))
const theme = computed(() => avatarThemeFor(props.name))
</script>

<template>
  <svg
    class="c-app-avatar"
    viewBox="0 0 40 40"
    aria-hidden="true"
    focusable="false"
    :style="{ '--avatar-color': `var(--theme-${theme})` }"
  >
    <circle cx="20" cy="20" r="20" fill="var(--avatar-color)" />
    <text
      class="c-app-avatar__initials"
      x="20"
      y="20"
      text-anchor="middle"
      dominant-baseline="central"
    >
      {{ initials }}
    </text>
  </svg>
</template>

<style scoped lang="scss">
.c-app-avatar {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
}

.c-app-avatar__initials {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  fill: var(--palette-white);
}
</style>
