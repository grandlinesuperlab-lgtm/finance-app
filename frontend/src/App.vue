<script setup lang="ts">
/**
 * Application shell.
 *
 * Owns the page landmarks and the one-time data load, and nothing else. No
 * feature state, no formatting, no business rules — screens are rendered by
 * the router below.
 */

import { onMounted } from 'vue'

import AppNavigation from '@/components/organisms/AppNavigation.vue'
import { useFinanceStore } from '@/stores/finance'

const finance = useFinanceStore()

// One load for the whole app: every screen reads the same store, so fetching
// per route would repeat work and make figures disagree between pages.
onMounted(() => {
  void finance.load()
})
</script>

<template>
  <a class="u-skip-link" href="#main">Zum Hauptinhalt springen</a>

  <div class="l-app">
    <AppNavigation class="l-app__nav" />

    <main id="main" class="l-app__main" tabindex="-1">
      <div class="l-app__content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.l-app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;

  @include mx.from('lg') {
    flex-direction: row;
  }
}

// Navigation comes first in the DOM on every screen size, so keyboard and
// screen-reader users reach it where they expect it and the skip link above
// gives everyone a way past it. Below the desktop breakpoint it is painted as
// a fixed bar at the foot of the viewport — the established pattern for a tab
// bar — and the main region reserves room for it rather than sliding beneath.
.l-app__main {
  flex: 1;
  min-width: 0;
  padding-block: var(--space-6) calc(var(--space-8) + 4.5rem);

  @include mx.from('lg') {
    padding-block: var(--space-8);
  }
}

.l-app__content {
  width: 100%;
  max-width: var(--layout-max-width);
  padding-inline: var(--space-4);
  margin-inline: auto;

  @include mx.from('md') {
    padding-inline: var(--space-10);
  }
}
</style>
