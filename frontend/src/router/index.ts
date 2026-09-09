import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      // Eager: this is the entry screen, so there is nothing to gain by splitting it.
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: 'Übersicht' },
    },
  ],
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})
