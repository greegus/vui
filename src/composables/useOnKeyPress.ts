import { onBeforeUnmount, onMounted } from "vue";

/**
 * Listens for a specific keyboard key press and triggers a callback.
 * Automatically sets up the listener on mount and cleans up on unmount.
 *
 * @example
 * // Basic usage - close modal on Escape
 * import { useOnKeyPress } from 'vuiii'
 *
 * useOnKeyPress('Escape', () => {
 *   closeModal()
 * })
 *
 * @example
 * // Save on Ctrl+S with event handling
 * useOnKeyPress('s', (event) => {
 *   if (event.ctrlKey || event.metaKey) {
 *     event.preventDefault()
 *     saveDocument()
 *   }
 * })
 *
 * @example
 * // With event listener options
 * useOnKeyPress('Enter', handleSubmit, { capture: true })
 */
export function useOnKeyPress(
  key: KeyboardEvent["code"],
  callback: (event: KeyboardEvent) => boolean | void,
  options?: AddEventListenerOptions,
) {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === key.toLowerCase()) {
      callback(event);
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyPress, options);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyPress, options);
  });
}
