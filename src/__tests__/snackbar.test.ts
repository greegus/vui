import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { messages, removeMessage, useSnackbar } from '@/snackbar'

describe('snackbar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    messages.value = []
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    messages.value = []
  })

  it('exposes a success and an error method', () => {
    const snackbar = useSnackbar()

    expect(typeof snackbar.success).toBe('function')
    expect(typeof snackbar.error).toBe('function')
  })

  it('adds a success message to the stack', () => {
    useSnackbar().success('Item saved!')

    expect(messages.value).toHaveLength(1)
    expect(messages.value[0]!.text).toBe('Item saved!')
    expect(messages.value[0]!.type).toBe('success')
  })

  it('adds an error message to the stack', () => {
    useSnackbar().error('Failed to save item')

    expect(messages.value).toHaveLength(1)
    expect(messages.value[0]!.text).toBe('Failed to save item')
    expect(messages.value[0]!.type).toBe('error')
  })

  it('keeps messages in the order they were shown', () => {
    const snackbar = useSnackbar()

    snackbar.success('first')
    snackbar.error('second')
    snackbar.success('third')

    expect(messages.value.map(({ text }) => text)).toEqual(['first', 'second', 'third'])
  })

  it('gives every message a unique id', () => {
    const snackbar = useSnackbar()

    snackbar.success('a')
    snackbar.success('a')
    snackbar.error('a')

    const ids = messages.value.map(({ id }) => id)
    expect(new Set(ids).size).toBe(3)
  })

  it('shares a single stack between separate useSnackbar() callers', () => {
    useSnackbar().success('from one caller')
    useSnackbar().error('from another caller')

    expect(messages.value.map(({ text }) => text)).toEqual(['from one caller', 'from another caller'])
  })

  it('keeps a message on screen until the default 7 second duration elapses', () => {
    useSnackbar().success('Item saved!')

    vi.advanceTimersByTime(6_999)
    expect(messages.value).toHaveLength(1)

    vi.advanceTimersByTime(1)
    expect(messages.value).toHaveLength(0)
  })

  it('auto-dismisses an error message after the default duration too', () => {
    useSnackbar().error('Failed to save item')

    vi.advanceTimersByTime(7_000)

    expect(messages.value).toHaveLength(0)
  })

  it('auto-dismisses after a custom duration', () => {
    useSnackbar().success('Quick message', 3_000)

    vi.advanceTimersByTime(2_999)
    expect(messages.value).toHaveLength(1)

    vi.advanceTimersByTime(1)
    expect(messages.value).toHaveLength(0)
  })

  it('never auto-dismisses a message shown with a duration of 0', () => {
    useSnackbar().error('Critical error - please refresh', 0)

    vi.advanceTimersByTime(60 * 60 * 1_000)

    expect(messages.value).toHaveLength(1)
    expect(messages.value[0]!.text).toBe('Critical error - please refresh')
  })

  it('dismisses each message on its own timer', () => {
    const snackbar = useSnackbar()

    snackbar.success('short', 1_000)
    snackbar.success('long', 5_000)

    vi.advanceTimersByTime(1_000)
    expect(messages.value.map(({ text }) => text)).toEqual(['long'])

    vi.advanceTimersByTime(4_000)
    expect(messages.value).toHaveLength(0)
  })

  it('removes a message manually by id', () => {
    const snackbar = useSnackbar()

    snackbar.success('keep me')
    snackbar.error('dismiss me')

    removeMessage(messages.value[1]!.id)

    expect(messages.value.map(({ text }) => text)).toEqual(['keep me'])
  })

  it('leaves the stack untouched when removing an unknown id', () => {
    useSnackbar().success('keep me')

    removeMessage(-1)

    expect(messages.value.map(({ text }) => text)).toEqual(['keep me'])
  })

  it('does not remove a replacement message when the timer of a manually dismissed one fires', () => {
    const snackbar = useSnackbar()

    snackbar.success('dismissed early', 5_000)
    removeMessage(messages.value[0]!.id)
    snackbar.success('still here', 5_000)

    vi.advanceTimersByTime(4_999)

    expect(messages.value.map(({ text }) => text)).toEqual(['still here'])
  })

  it('caps the stack at five messages, dropping the oldest', () => {
    const snackbar = useSnackbar()

    for (let i = 1; i <= 6; i++) {
      snackbar.success(`message ${i}`)
    }

    expect(messages.value).toHaveLength(5)
    expect(messages.value.map(({ text }) => text)).toEqual([
      'message 2',
      'message 3',
      'message 4',
      'message 5',
      'message 6',
    ])
  })

  it('keeps a persistent message when the cap evicts, dropping the oldest dismissible one instead', () => {
    const snackbar = useSnackbar()

    snackbar.success('persistent', 0)
    for (let i = 1; i <= 5; i++) {
      snackbar.success(`message ${i}`)
    }

    expect(messages.value.map(({ text }) => text)).toEqual([
      'persistent',
      'message 2',
      'message 3',
      'message 4',
      'message 5',
    ])
  })

  it('evicts the oldest message once every message on the stack is persistent', () => {
    const snackbar = useSnackbar()

    for (let i = 1; i <= 6; i++) {
      snackbar.success(`message ${i}`, 0)
    }

    expect(messages.value.map(({ text }) => text)).toEqual([
      'message 2',
      'message 3',
      'message 4',
      'message 5',
      'message 6',
    ])
  })

  it('cancels the pending timer of a message dismissed early', () => {
    useSnackbar().success('Item saved!')

    expect(vi.getTimerCount()).toBe(1)

    removeMessage(messages.value[0]!.id)

    expect(vi.getTimerCount()).toBe(0)
  })
})
