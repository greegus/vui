import { onUnmounted } from "vue";

import type { ElementRef } from "@/types";

/**
 * Detects clicks outside an element and triggers a callback.
 * Useful for closing dropdowns, modals, or popovers when clicking outside.
 * Automatically cleans up the event listener when the component unmounts.
 *
 * @example
 * // Basic usage - close dropdown on outside click
 * import { useOnClickOutside } from 'vuiii'
 *
 * const dropdownRef = ref<HTMLElement>()
 * const isOpen = ref(false)
 *
 * useOnClickOutside(dropdownRef, () => {
 *   isOpen.value = false
 * })
 *
 * // In template
 * <div ref="dropdownRef" v-if="isOpen">
 *   Dropdown content
 * </div>
 *
 * @example
 * // With modal dialog
 * const modalRef = ref<HTMLElement>()
 *
 * useOnClickOutside(modalRef, (event) => {
 *   // Access the click event if needed
 *   console.log('Clicked outside at:', event.clientX, event.clientY)
 *   closeModal()
 * })
 */
export function useOnClickOutside(element: ElementRef, callback: (e: MouseEvent) => void) {
  const handler = (e: MouseEvent) => {
    if (!element.value?.contains(e.target as HTMLElement)) {
      callback(e);
    }
  };

  window.addEventListener("mousedown", handler);

  onUnmounted(() => {
    window.removeEventListener("mousedown", handler);
  });
}
