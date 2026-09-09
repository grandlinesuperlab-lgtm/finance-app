import { nextTick, useTemplateRef } from 'vue'

/**
 * Moves focus to the first field a validation run rejected.
 *
 * Without it the rejection is silent for anyone not looking at the screen: the
 * submit button keeps the focus, the message appears somewhere above it, and
 * nothing announces that anything happened at all. Landing on the field reads
 * its label, its value and — through `aria-describedby` — the error, in one
 * go, which is why this is preferred over shouting the message from a live
 * region.
 *
 * It relies on the field atoms setting `aria-invalid` when they carry an
 * error, which all of them do.
 */
export function useInvalidFocus(refName: string) {
  const form = useTemplateRef<HTMLFormElement>(refName)

  async function focusFirstInvalid(): Promise<void> {
    await nextTick()
    form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }

  return { focusFirstInvalid }
}
