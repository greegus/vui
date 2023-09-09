<template>
  <Teleport to="body">
    <div class="ModalStack">
      <Transition name="ModalStack__backdrop">
        <div v-if="modals.length" class="ModalStack__backdrop" />
      </Transition>

      <TransitionGroup name="ModalStack__modal">
        <div
          v-for="modal in modals"
          :key="modal.id"
          class="ModalStack__modalWrapper"
          @click="closeModalByBackdropClick($event, modal)"
        >
          <component
            v-bind="modal.props"
            :is="modal.component"
            :data-modal-id="modal.id"
            class="ModalStack__modal"
            :class="{ isActive: activeModal?.id === modal.id }"
            @close="closeModal(modal, $event)"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { useOnKeyPress } from '../../composables/useOnKeyPress'
import type { Modal } from '../../modal'
import { activeModal, closeModal, modals } from '../../modal'

const closeModalByBackdropClick = (e: MouseEvent, modal: Modal) => {
  if (e.target === e.currentTarget) {
    closeModal(modal)
  }
}

useOnKeyPress('Escape', () => {
  if (modals.value.length) {
    closeModal(activeModal.value)
  }
})
</script>

<style lang="postcss" scoped>
.ModalStack {
  position: fixed;
  z-index: var(--vuiii-zIndex-modal);
}

.ModalStack__backdrop {
  background: rgba(0, 0, 0, 0.35);

  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ModalStack__modalWrapper {
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

.ModalStack__modalScroller {
  overflow: auto;
  position: relative;
  height: calc(100vh);
  display: flex;
  justify-content: center;
  width: 100%;
}

.ModalStack__modal {
  transition: filter 0.15s;

  &:not(.isActive) {
    filter: brightness(80%);
  }
}

/* animations */

.ModalStack__modal-enter-active,
.ModalStack__modal-leave-active {
  transition: opacity 0.15s;
  pointer-events: none;
}

.ModalStack__modal-enter-from,
.ModalStack__modal-leave-to {
  opacity: 0;
  pointer-events: none;
}

.ModalStack__backdrop-enter-active,
.ModalStack__backdrop-leave-active {
  transition: opacity 0.15s;
  pointer-events: none;
}

.ModalStack__backdrop-enter-from,
.ModalStack__backdrop-leave-to {
  opacity: 0;
  pointer-events: none;
}
</style>
