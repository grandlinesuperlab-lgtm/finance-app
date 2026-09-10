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
      <!--
        The wrapper that already carried the page width is what gets keyed and
        animated, so the transition costs no extra element. The key is the path
        and not the full URL: filtering the transactions list changes the query
        string, and that is a change within a page, not a change of page.
      -->
      <RouterView v-slot="{ Component, route }">
        <Transition name="u-page" mode="out-in">
          <div :key="route.path" class="l-app__content">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
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

// The page change: out quickly, in a little more slowly and with a short rise.
// `mode="out-in"` means the two pages never overlap. That is the point — two
// screens fading through each other is where a transition starts to feel like
// a delay, and it would also put two <h1> elements in the document at once.
// The movement is 0.5rem, far too small to be read as an animation and just
// enough to say "this is new content", and the reduced-motion rule in the
// reset switches all of it off for anyone who asked for that.
.u-page-enter-active {
  transition:
    opacity var(--duration-base) var(--easing-standard),
    transform var(--duration-base) var(--easing-travel);
}

.u-page-leave-active {
  transition: opacity var(--duration-fast) var(--easing-standard);
}

.u-page-enter-from {
  opacity: 0;
  transform: translateY(0.5rem);
}

.u-page-leave-to {
  opacity: 0;
}
</style>
