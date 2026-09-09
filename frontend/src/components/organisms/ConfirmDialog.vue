<script setup lang="ts">
/**
 * Confirmation before something irreversible.
 *
 * The confirming button names the consequence — "Yes, delete this budget" —
 * rather than "OK". Someone who reaches that button by tabbing hears only the
 * button, not the sentence above it, and "OK" tells them nothing about what
 * they are agreeing to.
 */

import AppDialog from '@/components/molecules/AppDialog.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps<{
  open: boolean
  title: string
  description: string
  confirmLabel: string
}>()

const emit = defineEmits<{ confirm: []; close: [] }>()
</script>

<template>
  <AppDialog
    :open="props.open"
    :title="props.title"
    :description="props.description"
    @close="emit('close')"
  >
    <div class="c-confirm-dialog__actions">
      <BaseButton variant="primary" block @click="emit('confirm')">
        {{ props.confirmLabel }}
      </BaseButton>
      <BaseButton variant="tertiary" block @click="emit('close')">No, go back</BaseButton>
    </div>
  </AppDialog>
</template>

<style scoped lang="scss">
.c-confirm-dialog__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
</style>
