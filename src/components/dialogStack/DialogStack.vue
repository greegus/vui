<template>
  <Teleport to="body">
    <div class="DialogStack">
      <Transition name="DialogStack__backdrop">
        <div v-if="dialogs.length" class="DialogStack__backdrop" />
      </Transition>

      <TransitionGroup name="DialogStack__dialog">
        <div
          v-for="dialog in dialogs"
          :key="dialog.id"
          class="DialogStack__dialogWrapper"
          @click="closeDialogByBackdropClick($event, dialog)"
        >
          <component
            v-bind="dialog.props"
            :is="dialog.component"
            :data-dialog-id="dialog.id"
            class="DialogStack__dialog"
            :class="{ isActive: activeDialog?.id === dialog.id }"
            @close="closeDialog(dialog, $event)"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { useOnKeyPress } from '@/composables/useOnKeyPress'
import type { Dialog } from '@/dialogStack'
import { activeDialog, closeDialog, dialogs } from '@/dialogStack'

const closeDialogByBackdropClick = (e: MouseEvent, dialog: Dialog) => {
  if (e.target === e.currentTarget) {
    closeDialog(dialog)
  }
}

useOnKeyPress('Escape', (e) => {
  if (dialogs.value.length && !e.defaultPrevented) {
    closeDialog(activeDialog.value)
    e.preventDefault()
  }
})
</script>

<style lang="postcss" scoped>
.DialogStack {
  position: fixed;
  z-index: var(--vuiii-zIndex-dialog);
}

.DialogStack__backdrop {
  background: var(--vuiii-dialog-backdropBgColor);

  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.DialogStack__dialogWrapper {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  height: auto;
  padding: 1.5rem;

  overflow: auto;
}

.DialogStack__dialogScroller {
  overflow: auto;
  position: relative;
  height: calc(100vh);
  display: flex;
  justify-content: center;
  width: 100%;
}

.DialogStack__dialog {
  transition: filter 0.15s;

  &:not(.isActive) {
    filter: brightness(80%);
  }
}

/* animations */

.DialogStack__dialog-enter-active,
.DialogStack__dialog-leave-active {
  transition: opacity 0.15s;
  pointer-events: none;
}

.DialogStack__dialog-enter-from,
.DialogStack__dialog-leave-to {
  opacity: 0;
  pointer-events: none;
}

.DialogStack__backdrop-enter-active,
.DialogStack__backdrop-leave-active {
  transition: opacity 0.15s;
  pointer-events: none;
}

.DialogStack__backdrop-enter-from,
.DialogStack__backdrop-leave-to {
  opacity: 0;
  pointer-events: none;
}
</style>
