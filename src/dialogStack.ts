import { type Component, computed, defineAsyncComponent, markRaw, ref } from 'vue'

import type { ButtonVariant, DialogLayoutButton } from './types'

export type Dialog<ResultType = any, DialogComponentProps = Record<string, any>> = {
  id: number
  component: Component
  props?: DialogComponentProps
  resolve: (result: ResultType) => void
  focusElement: HTMLElement | null
  onBeforeClose?: (confirm: () => void) => void
  modal?: boolean
}

export type Config = Partial<{
  cancelLabel: string
  confirmLabel: string
}>

export type DialogOptions = {
  title?: string
  content?: string
  buttons?: DialogLayoutButton[]
}

export type AlertOptions =
  | string
  | {
      title?: string
      content?: string
      confirmLabel?: string
      confirmVariant?: ButtonVariant
      confirmIcon?: string
      modal?: boolean
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
      modal?: boolean
    }

const defaultConfig: Config = {
  cancelLabel: 'Cancel',
  confirmLabel: 'OK'
}

const config = defaultConfig

const iteration = ref<number>(1)

export const dialogs = ref<Dialog[]>([])
export const activeDialog = computed(() => dialogs.value[dialogs.value.length - 1])

const getId = (): number => {
  return iteration.value++
}

export const openDialog = <ResultType = any, DialogComponentProps = Record<string, any>>(
  component: Component,
  props?: DialogComponentProps,
  { modal }: { modal?: boolean } = {}
): Promise<ResultType> => {
  const focusElement = document.activeElement as HTMLElement

  focusElement.blur?.()

  return new Promise((resolve) => {
    const dialog: Dialog<ResultType, DialogComponentProps> = {
      id: getId(),
      component: markRaw(component),
      props,
      resolve,
      focusElement,
      modal
    }

    dialogs.value.push(dialog as Dialog)
  })
}

export const openAlert = (options: AlertOptions): Promise<void> => {
  if (typeof options === 'string') {
    options = {
      content: options
    }
  }

  const { title, content, confirmVariant, confirmLabel = config.confirmLabel, confirmIcon, modal } = options

  return openDialog(
    defineAsyncComponent(() => import('./components/dialogStack/DialogLayout.vue')),
    {
      title,
      content,
      modal,
      buttons: [
        {
          variant: confirmVariant || 'primary',
          label: confirmLabel || '',
          icon: confirmIcon
        }
      ]
    }
  )
}

export const openConfirm = (options: ConfirmOptions): Promise<boolean> => {
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
    confirmIcon,
    modal
  } = options

  return openDialog(
    defineAsyncComponent(() => import('./components/dialogStack/DialogLayout.vue')),
    {
      title,
      content,
      modal,
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
    }
  )
}

const executeCloseDialog = (dialog: Dialog, result: any = undefined) => {
  dialogs.value = dialogs.value.filter((m) => m.id !== dialog.id)
  dialog.resolve(result)

  if (dialog.focusElement) {
    dialog.focusElement.focus?.()
  }
}

export const closeDialog = (dialog: Dialog, result: any = undefined) => {
  dialog.onBeforeClose
    ? dialog.onBeforeClose(() => executeCloseDialog(dialog, result))
    : executeCloseDialog(dialog, result)
}

export const useCloseDialog = (onBeforeClose?: (confirm: () => void) => void): ((result?: any) => void) => {
  if (onBeforeClose) {
    activeDialog.value.onBeforeClose = onBeforeClose
  }

  return (result?: any) => {
    closeDialog(activeDialog.value, result)
  }
}

const context = {
  open: openDialog,
  alert: openAlert,
  confirm: openConfirm
}

export function useDialogStack() {
  return context
}
