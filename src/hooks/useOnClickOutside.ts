import { onUnmounted, Ref } from 'vue'

export function useOnClickOutside(element: Ref<HTMLElement | null>, callback: () => void) {
  const handler = (e: MouseEvent) => {
    if (!element.value?.contains(e.target as HTMLElement)) {
      callback()
    }
  }

  window.addEventListener('mousedown', handler)

  onUnmounted(() => {
    window.removeEventListener('mousedown', handler)
  })
}