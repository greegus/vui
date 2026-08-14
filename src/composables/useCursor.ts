import { computed, type Ref, ref, unref, watch } from 'vue'

/**
 * Manages cursor position for navigating through arrays.
 * Used internally by [Autocomplete](/components/autocomplete) for keyboard navigation.
 *
 * @template T - The type of items in the array
 * @param items - Array or ref to array of items
 * @param options - Configuration options
 * @param options.cycle - Wrap around when reaching start/end
 * @param options.onCursorMove - Callback when cursor position changes
 * @returns Object with cursor state and navigation methods
 *
 * @example
 * // Basic usage
 * import { useCursor } from 'vuiii'
 *
 * const items = ref(['Apple', 'Banana', 'Cherry'])
 *
 * const {
 *   cursorIndex,
 *   cursorItem,
 *   moveCursorForward,
 *   moveCursorBack,
 *   resetCursor
 * } = useCursor(items)
 *
 * console.log(cursorItem.value) // 'Apple'
 * moveCursorForward()
 * console.log(cursorItem.value) // 'Banana'
 *
 * @example
 * // With cycling
 * const { moveCursorForward } = useCursor(items, { cycle: true })
 * // At last item, moveCursorForward() goes back to first
 *
 * @example
 * // Handle keyboard navigation
 * function handleKeydown(e: KeyboardEvent) {
 *   if (e.key === 'ArrowDown') moveCursorForward()
 *   if (e.key === 'ArrowUp') moveCursorBack()
 *   if (e.key === 'Enter') selectItem(cursorItem.value)
 * }
 */
export function useCursor<T = unknown>(
  items: Ref<T[]> | T[],
  options: { cycle?: boolean; initialIndex?: number; onCursorMove?: () => void } = {},
) {
  const initialIndex = options.initialIndex ?? 0

  const cursorIndex = ref(initialIndex)

  const cursorItem = computed(() => (cursorIndex.value === -1 ? undefined : unref(items)[cursorIndex.value]))

  /**
   * An empty list leaves the cursor unset. Without this guard the cycling branch would divide
   * by zero and latch cursorIndex to NaN, which never recovers on subsequent moves.
   */
  const hasNoItems = () => unref(items).length === 0

  const moveCursorForward = () => {
    if (hasNoItems()) {
      cursorIndex.value = -1
      return
    }

    const currentIndex = cursorIndex.value === -1 ? -1 : cursorIndex.value
    const nextCursorIndex = currentIndex + 1
    const itemsLength = unref(items).length

    cursorIndex.value = options.cycle ? nextCursorIndex % itemsLength : Math.min(nextCursorIndex, itemsLength - 1)
  }

  const moveCursorBack = () => {
    if (hasNoItems()) {
      cursorIndex.value = -1
      return
    }

    const itemsLength = unref(items).length
    const currentIndex = cursorIndex.value === -1 ? itemsLength : cursorIndex.value
    const nextCursorIndex = currentIndex - 1

    cursorIndex.value = options.cycle ? (nextCursorIndex + itemsLength) % itemsLength : Math.max(nextCursorIndex, 0)
  }

  const resetCursor = () => {
    cursorIndex.value = initialIndex
  }

  watch(cursorIndex, () => options.onCursorMove?.())

  watch(() => unref(items).length, resetCursor)

  return {
    cursorIndex,
    cursorItem,
    moveCursorForward,
    moveCursorBack,
    resetCursor,
  }
}
