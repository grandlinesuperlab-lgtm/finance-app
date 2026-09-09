<script setup lang="ts">
/**
 * A modal dialog, built on the native `<dialog>` element.
 *
 * That choice is the whole point of this component. `showModal()` gives four
 * behaviours for free that a hand-rolled modal has to reimplement:
 *
 *   1. focus moves into the dialog,
 *   2. focus cannot leave it while it is open,
 *   3. Escape closes it,
 *   4. focus returns to the element that opened it.
 *
 * The fourth is the one custom modals almost always forget, and it is the one
 * a keyboard user notices immediately — without it they are dropped back at
 * the top of the document with no idea where they were.
 */

import { useId, useTemplateRef, watch } from 'vue'

import AppIcon from '@/components/atoms/AppIcon.vue'

const props = defineProps<{
  open: boolean
  title: string
  /** Shown under the heading, for the sentence a dialog needs before its form. */
  description?: string
}>()

const emit = defineEmits<{ close: [] }>()

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const titleId = useId()

watch(
  () => props.open,
  (open) => {
    const element = dialog.value
    if (!element) return
    // Guarded both ways: calling showModal on an open dialog throws, and
    // calling close on a closed one fires a spurious close event.
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
  },
)

/**
 * Fires however the dialog was dismissed — Escape, the close button, or a
 * form submit. The parent owns `open`, so it is told rather than assumed.
 */
function onClose() {
  emit('close')
}

/**
 * A click that lands on the dialog element itself is a click on the backdrop:
 * its own content sits in children, so anything inside stops here first.
 */
function onBackdropClick(event: MouseEvent) {
  if (event.target === dialog.value) emit('close')
}
</script>

<template>
  <!--
    Clicking the backdrop dismisses the dialog. The rule below asks for a
    keyboard equivalent on the same element; the platform already provides it,
    because <dialog> closes on Escape natively and that fires @close. Adding a
    key handler here purely to satisfy the linter would be a worse answer than
    saying why it is not needed.
  -->
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <dialog
    ref="dialog"
    class="c-app-dialog"
    :aria-labelledby="titleId"
    @close="onClose"
    @click="onBackdropClick"
  >
    <article class="c-app-dialog__panel">
      <header class="c-app-dialog__header">
        <h2 :id="titleId" class="c-app-dialog__title">{{ props.title }}</h2>
        <button class="c-app-dialog__close" type="button" @click="emit('close')">
          <AppIcon name="close" />
          <span class="u-visually-hidden">Close</span>
        </button>
      </header>

      <p v-if="props.description" class="c-app-dialog__description">
        {{ props.description }}
      </p>

      <slot />
    </article>
  </dialog>
</template>

<style scoped lang="scss">
.c-app-dialog {
  width: min(35rem, calc(100vw - var(--space-8)));
  padding: 0;
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 0;
  border-radius: var(--radius-md);

  &::backdrop {
    background-color: rgb(32 31 36 / 50%);
  }
}

.c-app-dialog__panel {
  padding: var(--space-6) var(--space-5);

  @include mx.from('md') {
    padding: var(--space-8);
  }
}

.c-app-dialog__header {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
  justify-content: space-between;
  margin-block-end: var(--space-5);
}

.c-app-dialog__title {
  font-size: var(--font-size-lg);
}

.c-app-dialog__close {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  margin: calc(var(--space-3) * -1);
  color: var(--color-text-muted);
  background: none;
  border: 0;
  border-radius: var(--radius-sm);

  @include mx.focus-ring;

  &:hover {
    color: var(--color-text);
  }
}

.c-app-dialog__description {
  margin-block-end: var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
