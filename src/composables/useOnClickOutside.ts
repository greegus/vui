import type { ElementRef } from '@/types'
import { onUnmounted, type Ref } from 'vue'

export function useOnClickOutside(element: ElementRef, callback: (e: MouseEvent) => void) {
  const handler = (e: MouseEvent) => {
    if (!element.value?.contains(e.target as HTMLElement)) {
      callback(e)
    }
  }

  window.addEventListener('mousedown', handler)

  onUnmounted(() => {
    window.removeEventListener('mousedown', handler)
  })
}
