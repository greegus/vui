import { computed, type Ref, ref, unref, watch } from 'vue'

export function useCursor<T = unknown>(
  items: Ref<T[]> | T[],
  options: { cycle?: boolean; onCursorMove?: () => void } = {}
) {
  const cursorIndex = ref(0)

  const cursorItem = computed(() => unref(items)[cursorIndex.value])

  const moveCursorForward = () => {
    const nextCursorIndex = cursorIndex.value + 1
    const itemsLength = unref(items).length

    cursorIndex.value = options.cycle ? nextCursorIndex % itemsLength : Math.min(nextCursorIndex, itemsLength - 1)
  }

  const moveCursorBack = () => {
    const nextCursorIndex = cursorIndex.value - 1
    const itemsLength = unref(items).length

    cursorIndex.value = options.cycle ? (nextCursorIndex + itemsLength) % itemsLength : Math.max(nextCursorIndex, 0)
  }

  const resetCursor = () => {
    cursorIndex.value = 0
  }

  watch(cursorIndex, () => options.onCursorMove?.())

  watch(() => unref(items).length, resetCursor)

  return {
    cursorIndex,
    cursorItem,
    moveCursorForward,
    moveCursorBack,
    resetCursor
  }
}
