import { computed, type Ref, ref, unref, watch } from "vue";

/**
 * Manages cursor position for navigating through arrays.
 * Used internally by Autocomplete for keyboard navigation.
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
  options: { cycle?: boolean; onCursorMove?: () => void } = {},
) {
  const cursorIndex = ref(0);

  const cursorItem = computed(() => unref(items)[cursorIndex.value]);

  const moveCursorForward = () => {
    const nextCursorIndex = cursorIndex.value + 1;
    const itemsLength = unref(items).length;

    cursorIndex.value = options.cycle ? nextCursorIndex % itemsLength : Math.min(nextCursorIndex, itemsLength - 1);
  };

  const moveCursorBack = () => {
    const nextCursorIndex = cursorIndex.value - 1;
    const itemsLength = unref(items).length;

    cursorIndex.value = options.cycle ? (nextCursorIndex + itemsLength) % itemsLength : Math.max(nextCursorIndex, 0);
  };

  const resetCursor = () => {
    cursorIndex.value = 0;
  };

  watch(cursorIndex, () => options.onCursorMove?.());

  watch(() => unref(items).length, resetCursor);

  return {
    cursorIndex,
    cursorItem,
    moveCursorForward,
    moveCursorBack,
    resetCursor,
  };
}
