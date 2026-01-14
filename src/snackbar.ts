import { ref } from 'vue'

export type MessageType = 'success' | 'error'

export type Message = {
  id: number
  text: string
  type: MessageType
}

export type ShowMessage = {
  (message: string, duration?: number): void
}

export type Snackbar = {
  success: ShowMessage
  error: ShowMessage
}

const DEFAULT_MESSAGE_DURATION = 7_000
const MAX_MESSAGES = 5

const iteration = ref<number>(1)

export const messages = ref<Message[]>([])

function getId(): number {
  return iteration.value++
}

export function removeMessage(messageId: number) {
  messages.value = messages.value.filter(({ id }) => id !== messageId)
}

function showMessage(text: string, type: MessageType = 'success', duration: number = DEFAULT_MESSAGE_DURATION) {
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
  success: (text: string, duration: number = DEFAULT_MESSAGE_DURATION) => showMessage(text, 'success', duration),
  error: (text: string, duration: number = DEFAULT_MESSAGE_DURATION) => showMessage(text, 'error', duration)
}

export function useSnackbar(): Snackbar {
  return context
}
