import { onBeforeUnmount, onMounted } from "vue"

/**
 * Prevents the browser's default drag-and-drop file handling on an element.
 * Useful when you want to disable file drops on the page or specific areas.
 * By default, applies to document.body to prevent accidental file navigation.
 *
 * @example
 * // Prevent file drops on the entire page
 * import { usePreventHandlingDrop } from 'vuiii'
 *
 * usePreventHandlingDrop()
 *
 * @example
 * // Prevent drops on a specific element
 * const containerRef = ref<HTMLElement>()
 *
 * onMounted(() => {
 *   usePreventHandlingDrop(containerRef.value)
 * })
 */
export const usePreventHandlingDrop = (element: HTMLElement = document.body) => {
  const handleDragOver = (event: DragEvent) => {
    if (!event.defaultPrevented) {
      event.dataTransfer!.dropEffect = 'none'
      event.preventDefault()
    }
  }

  const preventDefault = (event: Event) => {
    event.preventDefault()
  }

  onMounted(() => {
    element.addEventListener('dragenter', preventDefault, false)
    element.addEventListener('dragover', handleDragOver, false)
    element.addEventListener('dragleave', preventDefault, false)
    element.addEventListener('drop', preventDefault, false)
  })

  onBeforeUnmount(() => {
    element.removeEventListener('dragenter', preventDefault, false)
    element.removeEventListener('dragover', handleDragOver, false)
    element.removeEventListener('dragleave', preventDefault, false)
    element.removeEventListener('drop', preventDefault, false)
  })
}
