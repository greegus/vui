/**
 * Snackbar/toast notification system for displaying brief messages.
 * Messages auto-dismiss after a configurable duration (default 7 seconds).
 *
 * @module snackbar
 *
 * @example
 * // Setup: Add SnackbarStack component to your app root
 * import { SnackbarStack } from 'vuiii'
 *
 * // In App.vue
 * <template>
 *   <router-view />
 *   <SnackbarStack />
 * </template>
 *
 * @example
 * // Show success message
 * import { useSnackbar } from 'vuiii'
 *
 * const snackbar = useSnackbar()
 * snackbar.success('Item saved!')
 *
 * @example
 * // Show error message
 * snackbar.error('Failed to save item')
 *
 * @example
 * // Custom duration (in milliseconds)
 * snackbar.success('Quick message', 3000) // 3 seconds
 * snackbar.error('Longer message', 10000) // 10 seconds
 *
 * @example
 * // Persistent message (no auto-dismiss)
 * snackbar.error('Critical error - please refresh', 0)
 */
import { ref } from 'vue'

export type MessageType = 'success' | 'error'

export type Message = {
  id: number
  text: string
  type: MessageType
}

/**
 * A queued message carries its pending auto-dismiss handle. Its absence is what marks a message as
 * persistent, so there is no second structure to keep in sync with the stack.
 */
type QueuedMessage = Message & { timer?: ReturnType<typeof setTimeout> }

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

export const messages = ref<QueuedMessage[]>([])

function getId(): number {
  return iteration.value++
}

export function removeMessage(messageId: number) {
  // Cancel the pending timer as well, so a message dismissed early (manually, or evicted by the
  // cap below) does not leave a timeout running until its original duration elapses.
  const message = messages.value.find(({ id }) => id === messageId)

  if (message?.timer !== undefined) {
    clearTimeout(message.timer)
  }

  messages.value = messages.value.filter(({ id }) => id !== messageId)
}

function showMessage(text: string, type: MessageType = 'success', duration: number = DEFAULT_MESSAGE_DURATION) {
  const message: QueuedMessage = {
    id: getId(),
    text,
    type,
  }

  // The timer handle doubles as the record of whether a message dismisses on its own: one shown
  // with `duration: 0` never gets a timer and is therefore persistent.
  if (duration > 0) {
    message.timer = setTimeout(() => removeMessage(message.id), duration)
  }

  messages.value.push(message)

  if (messages.value.length > MAX_MESSAGES) {
    // Evict the oldest message that dismisses on its own, so a persistent one is not dropped
    // silently; only when every older message is persistent does the oldest of those go. The
    // message just shown is never a candidate.
    const candidates = messages.value.slice(0, -1)
    const evictedMessage = candidates.find(({ timer }) => timer !== undefined) ?? candidates[0]

    if (evictedMessage) {
      removeMessage(evictedMessage.id)
    }
  }
}

const context = {
  success: (text: string, duration: number = DEFAULT_MESSAGE_DURATION) => showMessage(text, 'success', duration),
  error: (text: string, duration: number = DEFAULT_MESSAGE_DURATION) => showMessage(text, 'error', duration),
}

/**
 * Composable that provides access to snackbar/toast notifications.
 *
 * @returns Object with success and error methods for showing messages
 *
 * @example
 * import { useSnackbar } from 'vuiii'
 *
 * const snackbar = useSnackbar()
 *
 * // Success notification
 * snackbar.success('Changes saved')
 *
 * // Error notification
 * snackbar.error('Something went wrong')
 *
 * // Custom duration (ms)
 * snackbar.success('Quick!', 2000)
 */
export function useSnackbar(): Snackbar {
  return context
}
