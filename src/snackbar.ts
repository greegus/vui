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
import { ref } from "vue";

export type MessageType = "success" | "error";

export type Message = {
  id: number;
  text: string;
  type: MessageType;
};

export type ShowMessage = {
  (message: string, duration?: number): void;
};

export type Snackbar = {
  success: ShowMessage;
  error: ShowMessage;
};

const DEFAULT_MESSAGE_DURATION = 7_000;
const MAX_MESSAGES = 5;

const iteration = ref<number>(1);

export const messages = ref<Message[]>([]);

function getId(): number {
  return iteration.value++;
}

export function removeMessage(messageId: number) {
  messages.value = messages.value.filter(({ id }) => id !== messageId);
}

function showMessage(text: string, type: MessageType = "success", duration: number = DEFAULT_MESSAGE_DURATION) {
  const message: Message = {
    id: getId(),
    text,
    type,
  };

  messages.value.push(message);

  if (messages.value.length > MAX_MESSAGES) {
    messages.value.shift();
  }

  if (duration > 0) {
    setTimeout(() => removeMessage(message.id), duration);
  }
}

const context = {
  success: (text: string, duration: number = DEFAULT_MESSAGE_DURATION) => showMessage(text, "success", duration),
  error: (text: string, duration: number = DEFAULT_MESSAGE_DURATION) => showMessage(text, "error", duration),
};

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
  return context;
}
