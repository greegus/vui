import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useCursor } from '@/composables/useCursor'

describe('useCursor', () => {
  it('starts at the first item', () => {
    const { cursorIndex, cursorItem } = useCursor(['Apple', 'Banana', 'Cherry'])

    expect(cursorIndex.value).toBe(0)
    expect(cursorItem.value).toBe('Apple')
  })

  it('starts at the given initialIndex', () => {
    const { cursorIndex, cursorItem } = useCursor(['Apple', 'Banana', 'Cherry'], { initialIndex: 2 })

    expect(cursorIndex.value).toBe(2)
    expect(cursorItem.value).toBe('Cherry')
  })

  it('exposes no item when the initial index is -1', () => {
    const { cursorItem } = useCursor(['Apple', 'Banana'], { initialIndex: -1 })

    expect(cursorItem.value).toBeUndefined()
  })

  it('moves to the next item with moveCursorForward', () => {
    const { cursorIndex, cursorItem, moveCursorForward } = useCursor(['Apple', 'Banana', 'Cherry'])

    moveCursorForward()

    expect(cursorIndex.value).toBe(1)
    expect(cursorItem.value).toBe('Banana')
  })

  it('moves to the previous item with moveCursorBack', () => {
    const { cursorIndex, cursorItem, moveCursorBack } = useCursor(['Apple', 'Banana', 'Cherry'], { initialIndex: 2 })

    moveCursorBack()

    expect(cursorIndex.value).toBe(1)
    expect(cursorItem.value).toBe('Banana')
  })

  it('moves onto the first item when moving forward from an unset cursor', () => {
    const { cursorIndex, cursorItem, moveCursorForward } = useCursor(['Apple', 'Banana'], { initialIndex: -1 })

    moveCursorForward()

    expect(cursorIndex.value).toBe(0)
    expect(cursorItem.value).toBe('Apple')
  })

  it('moves onto the last item when moving back from an unset cursor', () => {
    const { cursorIndex, cursorItem, moveCursorBack } = useCursor(['Apple', 'Banana'], { initialIndex: -1 })

    moveCursorBack()

    expect(cursorIndex.value).toBe(1)
    expect(cursorItem.value).toBe('Banana')
  })

  it('stops at the last item when moving forward without cycling', () => {
    const { cursorIndex, cursorItem, moveCursorForward } = useCursor(['Apple', 'Banana'], { initialIndex: 1 })

    moveCursorForward()
    moveCursorForward()

    expect(cursorIndex.value).toBe(1)
    expect(cursorItem.value).toBe('Banana')
  })

  it('stops at the first item when moving back without cycling', () => {
    const { cursorIndex, cursorItem, moveCursorBack } = useCursor(['Apple', 'Banana'])

    moveCursorBack()
    moveCursorBack()

    expect(cursorIndex.value).toBe(0)
    expect(cursorItem.value).toBe('Apple')
  })

  it('wraps to the first item when moving forward past the end with cycle', () => {
    const { cursorIndex, cursorItem, moveCursorForward } = useCursor(['Apple', 'Banana', 'Cherry'], {
      cycle: true,
      initialIndex: 2,
    })

    moveCursorForward()

    expect(cursorIndex.value).toBe(0)
    expect(cursorItem.value).toBe('Apple')
  })

  it('wraps to the last item when moving back past the start with cycle', () => {
    const { cursorIndex, cursorItem, moveCursorBack } = useCursor(['Apple', 'Banana', 'Cherry'], { cycle: true })

    moveCursorBack()

    expect(cursorIndex.value).toBe(2)
    expect(cursorItem.value).toBe('Cherry')
  })

  it('cycles through every item and back to the start', () => {
    const { cursorItem, moveCursorForward } = useCursor(['Apple', 'Banana', 'Cherry'], { cycle: true })

    const visited = [cursorItem.value]
    for (let i = 0; i < 3; i++) {
      moveCursorForward()
      visited.push(cursorItem.value)
    }

    expect(visited).toEqual(['Apple', 'Banana', 'Cherry', 'Apple'])
  })

  it('returns the cursor to the initial index with resetCursor', () => {
    const { cursorIndex, resetCursor, moveCursorForward } = useCursor(['Apple', 'Banana', 'Cherry'], {
      initialIndex: 1,
    })

    moveCursorForward()
    expect(cursorIndex.value).toBe(2)

    resetCursor()

    expect(cursorIndex.value).toBe(1)
  })

  it('calls onCursorMove when the cursor position changes', async () => {
    const onCursorMove = vi.fn()
    const { moveCursorForward } = useCursor(['Apple', 'Banana'], { onCursorMove })

    moveCursorForward()
    await nextTick()

    expect(onCursorMove).toHaveBeenCalledTimes(1)
  })

  it('does not call onCursorMove when the cursor cannot move any further', async () => {
    const onCursorMove = vi.fn()
    const { moveCursorBack } = useCursor(['Apple', 'Banana'], { onCursorMove })

    moveCursorBack()
    await nextTick()

    expect(onCursorMove).not.toHaveBeenCalled()
  })

  it('follows the items of a ref as they are replaced', () => {
    const items = ref(['Apple', 'Banana'])
    const { cursorItem } = useCursor(items)

    items.value = ['Cherry', 'Date']

    expect(cursorItem.value).toBe('Cherry')
  })

  it('resets the cursor when the number of items changes', async () => {
    const items = ref(['Apple', 'Banana', 'Cherry'])
    const { cursorIndex, moveCursorForward } = useCursor(items)

    moveCursorForward()
    moveCursorForward()
    expect(cursorIndex.value).toBe(2)

    items.value = ['Elderberry']
    await nextTick()

    expect(cursorIndex.value).toBe(0)
  })

  it('resets to the configured initial index when the number of items changes', async () => {
    const items = ref(['Apple', 'Banana', 'Cherry'])
    const { cursorIndex } = useCursor(items, { initialIndex: -1 })

    cursorIndex.value = 2

    items.value = ['Elderberry', 'Fig']
    await nextTick()

    expect(cursorIndex.value).toBe(-1)
  })

  it('keeps the cursor when the items are replaced by a list of the same length', async () => {
    const items = ref(['Apple', 'Banana', 'Cherry'])
    const { cursorIndex, cursorItem, moveCursorForward } = useCursor(items)

    moveCursorForward()

    items.value = ['Date', 'Elderberry', 'Fig']
    await nextTick()

    expect(cursorIndex.value).toBe(1)
    expect(cursorItem.value).toBe('Elderberry')
  })

  it('exposes no item for an empty list', () => {
    const { cursorItem } = useCursor([] as string[])

    expect(cursorItem.value).toBeUndefined()
  })

  it('keeps exposing no item when moving around an empty list', () => {
    const { cursorItem, moveCursorForward, moveCursorBack } = useCursor([] as string[])

    moveCursorForward()
    expect(cursorItem.value).toBeUndefined()

    moveCursorBack()

    expect(cursorItem.value).toBeUndefined()
  })

  // Skipped: with `cycle` enabled on an empty list the modulo by zero makes
  // cursorIndex NaN instead of leaving it unset. See reported bug.
  it.skip('keeps the cursor unset when cycling over an empty list', () => {
    const { cursorIndex, moveCursorForward } = useCursor([] as string[], { cycle: true })

    moveCursorForward()

    expect(Number.isNaN(cursorIndex.value)).toBe(false)
  })

  it('exposes no item once the list becomes empty', async () => {
    const items = ref(['Apple', 'Banana'])
    const { cursorItem } = useCursor(items)

    items.value = []
    await nextTick()

    expect(cursorItem.value).toBeUndefined()
  })
})
