<script setup lang="ts">
// Application shell. Owns the page landmarks and nothing else: no data
// fetching, no feature state. Screens are rendered by the router below.
</script>

<template>
  <a class="u-skip-link" href="#main">Skip to main content</a>

  <div class="l-app">
    <header class="l-app__header">
      <div class="l-container">
        <p class="l-app__brand">finance</p>
      </div>
    </header>

    <main id="main" class="l-app__main" tabindex="-1">
      <div class="l-container">
        <RouterView />
      </div>
    </main>

    <footer class="l-app__footer">
      <div class="l-container">
        <p>Demo application. Data is stored in your browser only.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.l-app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.l-app__header {
  padding-block: var(--space-4);
  background-color: var(--color-surface);
  border-bottom: var(--border-width) solid var(--color-border);
}

.l-app__brand {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.l-app__main {
  flex: 1;
  padding-block: var(--space-6);
}

.l-app__footer {
  padding-block: var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  border-top: var(--border-width) solid var(--color-border);
}
</style>
