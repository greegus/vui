import { onBeforeUnmount, onMounted } from "vue"

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
