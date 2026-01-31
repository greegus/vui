import { onUnmounted, type Ref } from "vue";

/**
 * Detects when focus moves outside an element and triggers a callback.
 * Useful for closing dropdowns or popovers when the user tabs away.
 * Automatically cleans up the event listener when the component unmounts.
 *
 * @example
 * // Basic usage - close dropdown when focus leaves
 * import { useOnFocusOutside } from 'vuiii'
 *
 * const dropdownRef = ref<HTMLElement>()
 * const isOpen = ref(false)
 *
 * useOnFocusOutside(dropdownRef, () => {
 *   isOpen.value = false
 * })
 *
 * @example
 * // With form validation on blur
 * const formRef = ref<HTMLElement>()
 *
 * useOnFocusOutside(formRef, (event) => {
 *   validateForm()
 * })
 */
export function useOnFocusOutside(element: Ref<HTMLElement | undefined>, callback: (e: FocusEvent) => void) {
  const handler = (e: FocusEvent) => {
    if (!element.value?.contains(e.target as HTMLElement)) {
      callback(e);
    }
  };

  window.addEventListener("focus", handler);

  onUnmounted(() => {
    window.removeEventListener("focus", handler);
  });
}
