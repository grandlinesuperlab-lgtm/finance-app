import { customRef, onScopeDispose } from 'vue'

/**
 * A ref whose writes settle after a pause.
 *
 * Used by the search field: without it, every keystroke would rewrite the URL
 * and re-run the query. Reads are immediate — the input stays responsive and
 * shows what was typed — only the propagation of the new value waits.
 *
 * The timer is cleared when the owning scope is disposed, so a component that
 * unmounts mid-typing cannot write into a dead scope.
 */
export function useDebouncedRef<T>(initial: T, delayMs = 300) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let value = initial

  const debounced = customRef<T>((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(next) {
      value = next
      clearTimeout(timeout)
      timeout = setTimeout(() => trigger(), delayMs)
    },
  }))

  onScopeDispose(() => clearTimeout(timeout))

  return debounced
}
