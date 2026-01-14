import type { ElementRef } from '@/types'
import { createPopperLite, flip, offset, type Placement, preventOverflow } from '@popperjs/core'
import { onMounted, ref, watch } from 'vue'

export function usePopper(
  rootElement: ElementRef,
  popperElement: ElementRef,
  options: Partial<{ placement: Placement }> = {}
) {
  const popperInstance = ref<ReturnType<typeof createPopper> | undefined>(undefined)

  function createPopper() {
    createPopperLite(rootElement.value!, popperElement.value!, {
      placement: options.placement || 'bottom-start',
      modifiers: [flip, preventOverflow, offset, { name: 'offset', options: { offset: [0, 4] } }]
    })
  }

  function updatePopper() {
    if (rootElement.value && popperElement.value) {
      createPopper()
    }
  }

  watch(rootElement, updatePopper)

  watch(popperElement, updatePopper)

  onMounted(updatePopper)

  //   onUnmounted(() => {
  //     popperInstance.value?.destroy()
  //   })

  return popperInstance
}
