<template>
  <div class="ModalStack">
    <transition name="ModalStack__backdrop">
      <div v-if="props.modals.length" class="ModalStack__backdrop" />
    </transition>

    <transition-group name="ModalStack__modal">
      <div
        v-for="modal in props.modals"
        :key="modal.id"
        class="ModalStack__modalWrapper"
        @click="closeModalByBackdropClick($event, modal)"
      >
        <component
          v-bind="modal.props"
          :is="modal.component"
          :ref="registerReference(modal.id)"
          class="ModalStack__modal"
          :class="{ isActive: activeModal?.id === modal.id }"
          @close="closeModal(modal, $event)"
        />
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { ComponentPublicInstance, computed, onBeforeUnmount, onMounted, PropType, ref } from 'vue'

import { Modal } from '@/modal'

const modalInstances = ref<Record<number, ComponentPublicInstance>>({})

const emits = defineEmits(['closeModal'])

const props = defineProps({
  modals: {
    type: Array as PropType<Modal[]>,
    default: () => []
  }
})

const activeModal = computed<Modal | null>(() => {
  return props.modals.length ? props.modals[props.modals.length - 1] : null
})

function registerReference(modalId: number) {
  return (instance: ComponentPublicInstance) => (modalInstances.value[modalId] = instance)
}

function closeModal(modal: Modal, result?: any) {
  const close = () => {
    emits('closeModal', { modal, result })
  }

  const modalRootInstance = modalInstances.value[modal.id].$refs.root as any

  if (modalRootInstance.$attrs?.onBeforeClose) {
    ;(modalRootInstance.$attrs.onBeforeClose as any)(close)
  } else {
    close()
  }
}

function closeActiveModal() {
  if (activeModal.value) {
    closeModal(activeModal.value)
  }
}

function closeActiveModalByEscapeKey(e: KeyboardEvent) {
  if (activeModal.value && e.key === 'Escape' && !e.defaultPrevented) {
    e.preventDefault()
    closeActiveModal()
  }
}

function closeModalByBackdropClick(e: MouseEvent, modal: Modal) {
  if (e.target === e.currentTarget) {
    closeModal(modal)
  }
}

onMounted(() => {
  window.addEventListener('keydown', closeActiveModalByEscapeKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', closeActiveModalByEscapeKey)
})
</script>

<style lang="postcss">
.ModalStack {
  position: fixed;
  z-index: 1050;
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
