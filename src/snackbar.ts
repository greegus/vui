import { createApp, getCurrentInstance, h, Plugin, reactive } from 'vue'

import SnackbarStack from './components/snackbar/SnackbarStack.vue'

export type MessageType = 'success' | 'error'

export interface Message {
  id: number
  text: string
  type: MessageType
}

export interface ShowMessage {
  (message: string, type?: MessageType, duration?: number): void
}

export interface Snackbar {
  success: ShowMessage
  error: ShowMessage
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $snackbar: Snackbar
  }
}

const DEFAULT_MESSAGE_DURATION = 10_000
const MAX_MESSAGES = 5

export const snackbar: Plugin = (app) => {
  let iterator = 1

  const state = reactive({
    messages: [] as Message[]
  })

  const removeMessage = (messageId: number) => {
    state.messages = state.messages.filter(({ id }) => id !== messageId)
  }

  const snackbarApp = createApp({
    parent: app,

    data() {
      return state
    },

    render() {
      return h(SnackbarStack, { messages: this.messages, onRemoveMessage: removeMessage })
    }
  })

  const placeholder = document.createElement('div')
  document.body.appendChild(placeholder)
  snackbarApp.mount(placeholder)

  const showMessage: ShowMessage = (text, type = 'success', duration = DEFAULT_MESSAGE_DURATION) => {
    const id = iterator++

    state.messages.push({ text, type, id })

    if (state.messages.length > MAX_MESSAGES) {
      state.messages.shift()
    }

    if (duration > 0) {
      setTimeout(() => removeMessage(id), duration)
    }
  }

  app.config.globalProperties.$snackbar = {
    success: (text: string) => showMessage(text, 'success'),
    error: (text: string) => showMessage(text, 'error', 0)
  }
}

export function useSnackbar(): Snackbar {
  return getCurrentInstance()?.appContext.config.globalProperties.$snackbar!
}
