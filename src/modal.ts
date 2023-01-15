import { Component, ComponentCustomProps, computed, defineAsyncComponent, markRaw, ref } from 'vue'

import { ButtonVariant, ModalLayoutButton } from './types'

export type Modal = {
  id: number
  component: Component
  props?: ComponentCustomProps
  resolve: (result: any) => void
  focusElement: HTMLElement | null
  onBeforeClose?: (confirm: () => void) => void
}

export type Config = Partial<{
  cancelLabel: string
  confirmLabel: string
}>

export type DialogOptions = {
  title?: string
  content?: string
  buttons?: ModalLayoutButton[]
}

export type AlertOptions =
  | string
  | {
      title?: string
      content?: string
      confirmLabel?: string
      confirmVariant?: ButtonVariant
      confirmIcon?: string
    }

export type ConfirmOptions =
  | string
  | {
      title?: string
      content?: string
      cancelLabel?: string
      cancelVariant?: ButtonVariant
      cancelIcon?: string
      confirmLabel?: string
      confirmVariant?: ButtonVariant
      confirmIcon?: string
    }

export interface OpenModalInterface {
  <T = any>(component: Component, props?: { [key: string]: any }): Promise<T>
}

export interface OpenDialogInterface {
  <T = any>(options: DialogOptions): Promise<T>
}

export interface OpenAlertInterface {
  (options: AlertOptions): Promise<void>
}

export interface OpenConfirmInterface {
  (options: ConfirmOptions): Promise<boolean>
}

interface ModalInterface {
  open: OpenModalInterface
  alert: OpenAlertInterface
  dialog: OpenDialogInterface
  confirm: OpenConfirmInterface
}

const defaultConfig: Config = {
  cancelLabel: 'Cancel',
  confirmLabel: 'OK'
}

const config = defaultConfig

const iteration = ref<number>(1)

export const modals = ref<Modal[]>([])
export const activeModal = computed(() => modals.value[modals.value.length - 1])

const getId = (): number => {
  return iteration.value++
}

export const openModal: OpenModalInterface = (component, props?) => {
  const focusElement = document.activeElement as HTMLElement

  focusElement.blur?.()

  return new Promise((resolve) => {
    const modal: Modal = {
      id: getId(),
      component: markRaw(component),
      props,
      resolve,
      focusElement
    }

    modals.value.push(modal)
  })
}

export const openDialog: OpenDialogInterface = (options) => {
  return openModal(
    defineAsyncComponent(() => import('./components/modal/ModalLayout.vue')),
    options
  )
}

export const openAlert: OpenAlertInterface = (options) => {
  if (typeof options === 'string') {
    options = {
      content: options
    }
  }

  const { title, content, confirmVariant, confirmLabel = config.confirmLabel, confirmIcon } = options

  return openDialog({
    title,
    content,
    buttons: [
      {
        variant: confirmVariant || 'primary',
        label: confirmLabel || '',
        icon: confirmIcon
      }
    ]
  })
}

export const openConfirm: OpenConfirmInterface = (options) => {
  if (typeof options === 'string') {
    options = {
      content: options
    }
  }

  const {
    title,
    content,
    cancelLabel = config.cancelLabel,
    cancelVariant,
    cancelIcon,
    confirmLabel = config.confirmLabel,
    confirmVariant,
    confirmIcon
  } = options

  return openDialog({
    title,
    content,
    buttons: [
      {
        variant: cancelVariant || 'secondary',
        label: cancelLabel || '',
        icon: cancelIcon,
        value: false
      },
      {
        variant: confirmVariant || 'primary',
        label: confirmLabel || '',
        icon: confirmIcon,
        value: true
      }
    ]
  })
}

const executeCloseModal = (modal: Modal, result: any = undefined) => {
  modals.value = modals.value.filter((m) => m.id !== modal.id)
  modal.resolve(result)

  if (modal.focusElement) {
    modal.focusElement.focus?.()
  }
}

export const closeModal = (modal: Modal, result: any = undefined) => {
  modal.onBeforeClose ? modal.onBeforeClose(() => executeCloseModal(modal, result)) : executeCloseModal(modal, result)
}

export const useCloseModal = (onBeforeClose?: (confirm: () => void) => void): ((result?: any) => void) => {
  if (onBeforeClose) {
    activeModal.value.onBeforeClose = onBeforeClose
  }

  return (result?: any) => {
    closeModal(activeModal.value, result)
  }
}

const context = {
  open: openModal,
  dialog: openDialog,
  alert: openAlert,
  confirm: openConfirm
}

export function useModal(): ModalInterface {
  return context
}
