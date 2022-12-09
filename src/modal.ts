import { Component, ComponentCustomProps, createApp, getCurrentInstance, h, Plugin, reactive } from 'vue'

import ModalLayoutDialog from './components/modal/ModalLayoutDialog.vue'
import ModalStack from './components/modal/ModalStack.vue'
import { ButtonVariant } from './types'

export type Modal = {
  id: number
  component: Component
  props?: ComponentCustomProps
  resolve: (result: any) => void
  focusElement: HTMLElement | null
}

export type Config = Partial<{
  cancelLabel: string
  confirmLabel: string
}>

export type ButtonOptions = {
  variant?: ButtonVariant
  label: string
  icon?: string
  value?: any
}

export type DialogOptions = {
  title?: string
  message?: string
  buttons?: ButtonOptions[]
}

export type AlertOptions =
  | string
  | {
      title?: string
      message?: string
      confirmLabel?: string
      confirmVariant?: ButtonVariant
      confirmIcon?: string
    }

export type ConfirmOptions =
  | string
  | {
      title?: string
      message?: string
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

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $modal: ModalInterface
  }
}

const defaultConfig: Config = {
  cancelLabel: 'Cancel',
  confirmLabel: 'OK'
}

export const modal: Plugin = (app, config: Config = {}) => {
  let iterator = 1

  config = { ...defaultConfig, ...config }

  const state = reactive({
    modals: [] as Modal[]
  })

  const closeModal = (modal: Modal, result: any) => {
    state.modals = state.modals.filter(({ id }) => id !== modal.id)
    modal.resolve(result)
    modal.focusElement?.focus()
  }

  const modalApp = createApp({
    parent: app,

    data() {
      return state
    },

    render() {
      return h(ModalStack, {
        modals: state.modals,
        onCloseModal: ({ modal, result }: any) => closeModal(modal, result)
      })
    }
  })

  const placeholder = document.createElement('div')
  document.body.appendChild(placeholder)
  modalApp.mount(placeholder)

  const openModal: OpenModalInterface = (component, props?) => {
    const focusElement = document.activeElement as HTMLElement

    focusElement.blur?.()

    return new Promise((resolve) => {
      state.modals.push({
        id: iterator++,
        component,
        props,
        resolve,
        focusElement
      })
    })
  }

  const openDialog: OpenDialogInterface = (options) => {
    return openModal(ModalLayoutDialog, options)
  }

  const openAlert: OpenAlertInterface = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }

    const { title, message, confirmVariant, confirmLabel = config.confirmLabel, confirmIcon } = options

    return openDialog({
      title,
      message,
      buttons: [
        {
          variant: confirmVariant || 'primary',
          label: confirmLabel || '',
          icon: confirmIcon
        }
      ]
    })
  }

  const openConfirm: OpenConfirmInterface = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }

    const {
      title,
      message,
      cancelLabel = config.cancelLabel,
      cancelVariant,
      cancelIcon,
      confirmLabel = config.confirmLabel,
      confirmVariant,
      confirmIcon
    } = options

    return openDialog({
      title,
      message,
      buttons: [
        {
          variant: cancelVariant,
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

  app.config.globalProperties.$modal = {
    open: openModal,
    dialog: openDialog,
    alert: openAlert,
    confirm: openConfirm
  }
}

export function useModal(): ModalInterface {
  return getCurrentInstance()?.appContext.config.globalProperties.$modal!
}
