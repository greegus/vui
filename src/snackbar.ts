import { ref } from 'vue'

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

const DEFAULT_MESSAGE_DURATION = 10_000
const MAX_MESSAGES = 5

const iteration = ref<number>(1)

export const messages = ref<Message[]>([])

const getId = (): number => {
  return iteration.value++
}

export const removeMessage = (messageId: number) => {
  messages.value = messages.value.filter(({ id }) => id !== messageId)
}

export const showMessage: ShowMessage = (text, type = 'success', duration = DEFAULT_MESSAGE_DURATION) => {
  const message: Message = {
    id: getId(),
    text,
    type
  }

  messages.value.push(message)

  if (messages.value.length > MAX_MESSAGES) {
    messages.value.shift()
  }

  if (duration > 0) {
    setTimeout(() => removeMessage(message.id), duration)
  }
}

const context = {
  success: (text: string) => showMessage(text, 'success'),
  error: (text: string) => showMessage(text, 'error', 0)
}

export function useSnackbar(): Snackbar {
  return context
}
