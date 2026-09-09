<script setup lang="ts">
/**
 * Primary navigation.
 *
 * One component renders both layouts the design calls for — a bottom tab bar
 * below the desktop breakpoint, a sidebar above it. Same markup, same DOM
 * order, same tab order; only CSS differs. Two components would mean two
 * sources of truth for the nav items and a hidden duplicate in the tab order.
 */

import AppIcon from '@/components/atoms/AppIcon.vue'
import type { IconName } from '@/components/atoms/icon-paths'
import { useSidebarCollapsed } from '@/composables/useSidebarCollapsed'

interface NavItem {
  to: string
  label: string
  icon: IconName
}

const items: NavItem[] = [
  { to: '/', label: 'Übersicht', icon: 'overview' },
  { to: '/transactions', label: 'Transaktionen', icon: 'transactions' },
  { to: '/budgets', label: 'Budgets', icon: 'budgets' },
  { to: '/pots', label: 'Sparziele', icon: 'pots' },
  { to: '/recurring-bills', label: 'Daueraufträge', icon: 'bills' },
]

const { collapsed, toggle } = useSidebarCollapsed()
</script>

<template>
  <nav
    class="c-app-navigation"
    :class="{ 'c-app-navigation--collapsed': collapsed }"
    aria-label="Hauptnavigation"
  >
    <p class="c-app-navigation__brand">
      <span :class="collapsed ? 'u-visually-hidden' : undefined">finance</span>
      <span v-if="collapsed" aria-hidden="true">f</span>
    </p>

    <ul class="c-app-navigation__list" role="list">
      <li v-for="item in items" :key="item.to">
        <RouterLink class="c-app-navigation__link" :to="item.to">
          <AppIcon :name="item.icon" />
          <span class="c-app-navigation__label">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>

    <button
      class="c-app-navigation__toggle"
      type="button"
      :aria-pressed="collapsed"
      @click="toggle"
    >
      <AppIcon :name="collapsed ? 'chevronRight' : 'chevronLeft'" />
      <span class="c-app-navigation__label">Menü einklappen</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.c-app-navigation {
  // --- Mobile and tablet: a fixed tab bar at the foot of the viewport ------
  position: fixed;
  inset-block-end: 0;
  inset-inline: 0;
  z-index: var(--z-sticky);
  display: flex;
  padding-inline: var(--space-2);
  color: var(--color-nav-text);
  background-color: var(--color-nav-surface);
  border-start-start-radius: var(--radius-lg);
  border-start-end-radius: var(--radius-lg);

  // --- Desktop: a sidebar that stays put while the content scrolls ---------
  @include mx.from('lg') {
    position: sticky;
    inset-block-start: 0;
    inset-inline: auto;
    flex-direction: column;
    width: var(--layout-sidebar-width);
    height: 100dvh;
    padding-block: var(--space-10) var(--space-8);
    padding-inline: 0;
    border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
    transition: width var(--duration-base) var(--easing-standard);
  }
}

.c-app-navigation--collapsed {
  @include mx.from('lg') {
    width: var(--layout-sidebar-width-compact);
  }
}

// Collapsed, the rail is only wide enough for the icon: the generous inline
// padding of the expanded sidebar would push the icon straight out of it.
.c-app-navigation--collapsed .c-app-navigation__list {
  @include mx.from('lg') {
    padding-inline-end: 0;
  }
}

.c-app-navigation--collapsed .c-app-navigation__link,
.c-app-navigation--collapsed .c-app-navigation__toggle {
  @include mx.from('lg') {
    gap: 0;
    justify-content: center;
    padding-inline: var(--space-4);
  }
}

.c-app-navigation--collapsed .c-app-navigation__link[aria-current='page'] {
  @include mx.from('lg') {
    padding-inline-start: calc(var(--space-4) - 4px);
  }
}

.c-app-navigation__brand {
  display: none;

  @include mx.from('lg') {
    display: block;
    padding-block-end: var(--space-12);
    padding-inline: var(--space-8);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
  }
}

.c-app-navigation__list {
  display: flex;
  flex: 1;

  @include mx.from('lg') {
    flex: 0;
    flex-direction: column;
    gap: var(--space-1);
    padding-inline-end: var(--space-6);
  }
}

.c-app-navigation__list > li {
  flex: 1;

  @include mx.from('lg') {
    flex: none;
  }
}

.c-app-navigation__link {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  align-items: center;
  justify-content: center;
  min-height: 3.25rem;
  padding-block: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-nav-text-muted);
  text-decoration: none;
  border-start-start-radius: var(--radius-sm);
  border-start-end-radius: var(--radius-sm);

  @include mx.focus-ring(-2px);

  &:hover {
    color: var(--color-nav-text);
  }

  // The router marks the active route with aria-current, so the styling hangs
  // off the same attribute assistive technology uses — they cannot drift apart.
  &[aria-current='page'] {
    color: var(--color-text);
    background-color: var(--color-surface-sunken);
    border-block-end: 4px solid var(--color-accent);
  }

  @include mx.from('lg') {
    flex-direction: row;
    gap: var(--space-4);
    justify-content: flex-start;
    min-height: 3.5rem;
    padding-inline: var(--space-8);
    font-size: var(--font-size-md);
    border-radius: 0 var(--radius-md) var(--radius-md) 0;

    &[aria-current='page'] {
      padding-inline-start: calc(var(--space-8) - 4px);
      border-block-end: 0;
      border-inline-start: 4px solid var(--color-accent);
    }
  }
}

// The label is hidden visually, never with `display: none` — an icon-only
// link with no accessible name is unusable with a screen reader, and that is
// exactly what the narrowest layout and the collapsed rail would produce.
.c-app-navigation__label {
  @include mx.visually-hidden;

  @include mx.from('sm') {
    @include mx.visually-shown;
    @include mx.truncate;
  }
}

.c-app-navigation--collapsed .c-app-navigation__label {
  @include mx.from('lg') {
    @include mx.visually-hidden;
  }
}

.c-app-navigation__toggle {
  display: none;

  @include mx.from('lg') {
    display: flex;
    gap: var(--space-4);
    align-items: center;
    padding-block: var(--space-4);
    padding-inline: var(--space-8);
    margin-block-start: auto;
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    color: var(--color-nav-text-muted);
    background: none;
    border: 0;

    @include mx.focus-ring(-2px);

    &:hover {
      color: var(--color-nav-text);
    }
  }
}
</style>
