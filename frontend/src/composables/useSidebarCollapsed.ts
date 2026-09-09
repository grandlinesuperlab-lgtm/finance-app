import { ref, watch } from 'vue'

/**
 * Whether the desktop sidebar is collapsed to an icon rail.
 *
 * A per-viewer convenience, so it lives in localStorage rather than in the
 * finance store — it is not application data and never needs to reach a
 * server. Reads and writes are guarded: storage throws in private browsing and
 * when a browser is set to block site data, and a UI preference is never worth
 * a blank page.
 */

const STORAGE_KEY = 'finance-app:sidebar-collapsed'

function readInitial(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const collapsed = ref(readInitial())

watch(collapsed, (value) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    // Preference is not persisted; the current session still honours it.
  }
})

export function useSidebarCollapsed() {
  function toggle(): void {
    collapsed.value = !collapsed.value
  }

  return { collapsed, toggle }
}
