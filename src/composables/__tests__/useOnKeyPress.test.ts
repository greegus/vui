import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import { useOnKeyPress } from '@/composables/useOnKeyPress'

function createHost(key: string, callback: (event: KeyboardEvent) => void, options?: AddEventListenerOptions) {
  return defineComponent({
    setup() {
      useOnKeyPress(key, callback, options)
    },
    template: `<div />`,
  })
}

function pressKey(key: string, init: KeyboardEventInit = {}) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }))
}

describe('useOnKeyPress', () => {
  it('calls the callback when the given key is pressed', () => {
    const callback = vi.fn()
    const wrapper = mount(createHost('Escape', callback))

    pressKey('Escape')

    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('ignores other keys', () => {
    const callback = vi.fn()
    const wrapper = mount(createHost('Escape', callback))

    pressKey('Enter')
    pressKey('ArrowDown')

    expect(callback).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('matches the key case-insensitively', () => {
    const callback = vi.fn()
    const wrapper = mount(createHost('escape', callback))

    pressKey('Escape')

    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('matches an uppercase letter typed with shift', () => {
    const callback = vi.fn()
    const wrapper = mount(createHost('s', callback))

    pressKey('S', { shiftKey: true })

    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('passes the keyboard event to the callback so modifiers can be inspected', () => {
    const callback = vi.fn()
    const wrapper = mount(createHost('s', callback))

    pressKey('s', { ctrlKey: true })

    const event = callback.mock.calls[0]![0] as KeyboardEvent
    expect(event).toBeInstanceOf(KeyboardEvent)
    expect(event.ctrlKey).toBe(true)

    wrapper.unmount()
  })

  it('calls the callback on every press while the host is mounted', () => {
    const callback = vi.fn()
    const wrapper = mount(createHost('Enter', callback))

    pressKey('Enter')
    pressKey('Enter')

    expect(callback).toHaveBeenCalledTimes(2)

    wrapper.unmount()
  })

  it('does not listen before the host component is mounted', () => {
    const callback = vi.fn()
    const Component = createHost('Escape', callback)

    // The composable only subscribes from onMounted, so merely creating the
    // component definition must not install a global listener.
    pressKey('Escape')
    expect(callback).not.toHaveBeenCalled()

    const wrapper = mount(Component)
    pressKey('Escape')

    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('stops listening once the host component is unmounted', () => {
    const callback = vi.fn()
    const wrapper = mount(createHost('Escape', callback))

    wrapper.unmount()
    pressKey('Escape')

    expect(callback).not.toHaveBeenCalled()
  })

  it('stops listening after unmount when registered with capture', () => {
    const callback = vi.fn()
    const wrapper = mount(createHost('Escape', callback, { capture: true }))

    pressKey('Escape')
    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    pressKey('Escape')

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('lets several mounted hosts listen for the same key independently', () => {
    const first = vi.fn()
    const second = vi.fn()
    const firstWrapper = mount(createHost('Escape', first))
    const secondWrapper = mount(createHost('Escape', second))

    pressKey('Escape')
    firstWrapper.unmount()
    pressKey('Escape')

    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(2)

    secondWrapper.unmount()
  })
})
