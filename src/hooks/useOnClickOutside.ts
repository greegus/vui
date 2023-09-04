import { onUnmounted, type Ref } from 'vue'

export function useOnClickOutside(element: Ref<HTMLElement | undefined>, callback: () => void) {
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
