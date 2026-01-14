import { onUnmounted, type Ref } from "vue";

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
