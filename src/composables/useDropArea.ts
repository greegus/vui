import { computed, onBeforeUnmount, onMounted, type Ref, ref } from 'vue'

import { debounce } from '@/utils/debounce'
import { retrieveFilesFromDataTransfer } from '@/utils/retrieveFilesFromDataTransfer'

export function useDropArea(
  element: Ref<HTMLElement | undefined>,
  onFiles: (files: File[]) => void,
  options: {
    accept?: string[] | string
    multiple?: boolean
    onError?: (error: unknown) => void
  } = {}
): {
  isDropzoneActive: Ref<boolean>
} {
  const isDropzoneActive = ref(false)

  const normalizedAccept = computed<string[] | undefined>(() => {
    return Array.isArray(options.accept) ? options.accept : options.accept?.split(',').map(type => type.trim())
  })

  const setDropzoneActive = debounce((value: boolean) => (isDropzoneActive.value = value), 1)

  const hasValidItems = (e: DragEvent): boolean => {
    return Array.from(e.dataTransfer?.items || []).some((item) => ['file', 'text/html'].includes(item.kind))
  }

  const onDragOver = (e: DragEvent) => {
    if (!hasValidItems(e)) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    e.dataTransfer!.dropEffect = 'copy'

    setDropzoneActive(true)
  }

  const onDragEnter = (e: DragEvent) => {
    if (!hasValidItems(e)) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    e.dataTransfer!.dropEffect = 'copy'
  }

  const onDragLeave = (e: DragEvent) => {
    if (!hasValidItems(e)) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    e.dataTransfer!.dropEffect = 'none'

    setDropzoneActive(false)
  }

  const onDrop = async (e: DragEvent) => {
    if (!hasValidItems(e)) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    try {
      if (!e.dataTransfer) {
        return
      }

      let files = await retrieveFilesFromDataTransfer(e.dataTransfer!)

      if (options.accept) {
        files = files.filter((file) => normalizedAccept.value?.some((type) => file.type.startsWith(type)))
      }

      if (!options.multiple) {
        files = files.slice(0, 1)
      }

      isDropzoneActive.value = false

      if (files.length) {
        onFiles(files)
      }
    } catch (e) {
      options.onError?.(e)
    }
  }

  onMounted(() => {
    element.value?.addEventListener('dragover', onDragOver)
    element.value?.addEventListener('dragenter', onDragEnter)
    element.value?.addEventListener('dragleave', onDragLeave)
    element.value?.addEventListener('drop', onDrop)
  })

  onBeforeUnmount(() => {
    element.value?.removeEventListener('dragover', onDragOver)
    element.value?.removeEventListener('dragenter', onDragEnter)
    element.value?.removeEventListener('dragleave', onDragLeave)
    element.value?.removeEventListener('drop', onDrop)
  })

  return {
    isDropzoneActive,
  }
}

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
