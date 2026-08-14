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

/**
 * Pending auto-dismiss timeouts, keyed by message id. Doubles as the record of which messages
 * dismiss on their own: a message with no entry here was shown with `duration: 0` and is
 * therefore persistent.
 */
const dismissTimers = new Map<number, ReturnType<typeof setTimeout>>()

export function removeMessage(messageId: number) {
  // Cancel the pending timer as well, so a message dismissed early (manually, or evicted by the
  // cap below) does not leave a timeout running until its original duration elapses.
  const timer = dismissTimers.get(messageId)

  if (timer !== undefined) {
    clearTimeout(timer)
    dismissTimers.delete(messageId)
  }

  messages.value = messages.value.filter(({ id }) => id !== messageId)
}

function showMessage(text: string, type: MessageType = 'success', duration: number = DEFAULT_MESSAGE_DURATION) {
  const message: Message = {
    id: getId(),
    text,
    type,
  }

  messages.value.push(message)

  // Drop timers belonging to messages that are no longer on the stack, in case a consumer
  // mutated `messages` directly instead of going through removeMessage.
  const currentIds = new Set(messages.value.map(({ id }) => id))

  for (const [id, timer] of dismissTimers) {
    if (!currentIds.has(id)) {
      clearTimeout(timer)
      dismissTimers.delete(id)
    }
  }

  if (duration > 0) {
    dismissTimers.set(
      message.id,
      setTimeout(() => removeMessage(message.id), duration),
    )
  }

  if (messages.value.length > MAX_MESSAGES) {
    // Evict the oldest message that dismisses on its own, so a persistent one is not dropped
    // silently; only when every older message is persistent does the oldest of those go. The
    // message just shown is never a candidate.
    const candidates = messages.value.slice(0, -1)
    const evictedMessage = candidates.find(({ id }) => dismissTimers.has(id)) ?? candidates[0]

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
