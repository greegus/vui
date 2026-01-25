import { computed, onBeforeUnmount, onMounted, type Ref, ref } from 'vue'

import { debounce } from '@/utils/debounce'
import { retrieveFilesFromDataTransfer } from '@/utils/retrieveFilesFromDataTransfer'

/**
 * Enables drag-and-drop file handling on an element.
 * Provides dropzone active state for visual feedback.
 *
 * @param element - Ref to the drop target element
 * @param onFiles - Callback when files are dropped
 * @param options - Configuration options
 * @param options.accept - MIME types to accept (e.g., 'image/*', ['image/png', 'application/pdf'])
 * @param options.multiple - Allow multiple files (default: false)
 * @param options.onError - Error handler callback
 * @returns Object with isDropzoneActive reactive state
 *
 * @example
 * // Basic usage
 * import { useDropArea } from 'vuiii'
 *
 * const dropElement = ref<HTMLElement>()
 *
 * const { isDropzoneActive } = useDropArea(
 *   dropElement,
 *   (files) => console.log('Dropped files:', files)
 * )
 *
 * // In template
 * <div
 *   ref="dropElement"
 *   :class="{ 'dropzone-active': isDropzoneActive }"
 * >
 *   Drop files here
 * </div>
 *
 * @example
 * // With file type filter
 * useDropArea(
 *   dropElement,
 *   handleFiles,
 *   { accept: 'image/*' }
 * )
 *
 * @example
 * // Multiple files with specific types
 * useDropArea(
 *   dropElement,
 *   handleFiles,
 *   {
 *     accept: ['image/png', 'image/jpeg', 'application/pdf'],
 *     multiple: true
 *   }
 * )
 *
 * @example
 * // With error handling
 * useDropArea(
 *   dropElement,
 *   handleFiles,
 *   {
 *     onError: (error) => snackbar.error('Failed to process dropped files')
 *   }
 * )
 */
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
