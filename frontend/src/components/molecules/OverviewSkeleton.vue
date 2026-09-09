<script setup lang="ts">
/**
 * Placeholder shapes for the overview while its data loads.
 *
 * It mirrors the finished grid so the page does not jump when the real cards
 * arrive, and it exists as its own component because the alternative was ten
 * meaningless boxes inside the view — which is exactly what the div budget is
 * there to catch.
 *
 * This is the one place in the project where generic elements are the honest
 * choice: a placeholder stands for content that is not there yet, so there is
 * no element that carries its meaning. The rule is raised for this file alone,
 * in eslint.config.js.
 */
</script>

<template>
  <div class="c-overview-skeleton" aria-busy="true">
    <div class="c-overview-skeleton__row">
      <span v-for="n in 3" :key="n" class="c-overview-skeleton__tile" />
    </div>

    <div class="c-overview-skeleton__column">
      <span v-for="n in 2" :key="n" class="c-overview-skeleton__card" />
    </div>

    <div class="c-overview-skeleton__column">
      <span v-for="n in 2" :key="n" class="c-overview-skeleton__card" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-overview-skeleton {
  display: grid;
  gap: var(--space-6);

  @include mx.from('lg') {
    grid-template-columns: 1.2fr 1fr;
    align-items: start;
  }
}

.c-overview-skeleton__row {
  display: grid;
  gap: var(--space-4);

  @include mx.from('md') {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }

  @include mx.from('lg') {
    grid-column: 1 / -1;
  }
}

.c-overview-skeleton__column {
  display: grid;
  gap: var(--space-6);
  align-content: start;
}

.c-overview-skeleton__tile,
.c-overview-skeleton__card {
  display: block;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
}

.c-overview-skeleton__tile {
  height: 6.5rem;
}

.c-overview-skeleton__card {
  height: 16rem;
}
</style>
