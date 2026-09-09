import { createRouter, createWebHistory } from 'vue-router'

/**
 * The five screens of the app.
 *
 * Overview is eager because it is the entry point; the rest are split, so a
 * visitor downloads only the screen they asked for. Each route carries the
 * title used for the document title.
 */
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: () => import('@/views/OverviewView.vue'),
      meta: { title: 'Overview' },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/TransactionsView.vue'),
      meta: { title: 'Transactions' },
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: () => import('@/views/BudgetsView.vue'),
      meta: { title: 'Budgets' },
    },
    {
      path: '/pots',
      name: 'pots',
      component: () => import('@/views/PotsView.vue'),
      meta: { title: 'Pots' },
    },
    {
      path: '/recurring-bills',
      name: 'recurring-bills',
      component: () => import('@/views/RecurringBillsView.vue'),
      meta: { title: 'Recurring Bills' },
    },
    {
      // Anything else lands on the overview rather than a blank screen.
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})

// A single-page app does not change the document title on its own, and the
// title is what a screen reader announces after a route change.
router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : null
  document.title = title ? `${title} · Finance` : 'Finance'
})
