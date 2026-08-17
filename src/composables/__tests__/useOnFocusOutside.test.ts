import { afterEach, describe, expect, it, vi } from 'vitest'

import { appendOutsideElement, createOutsideHost } from '@/__tests__/helpers/outsideHost'
import { useOnFocusOutside } from '@/composables/useOnFocusOutside'

const mountHost = createOutsideHost((element, callback) => useOnFocusOutside(element, callback))

// The composable subscribes to `focus` on `window` with capture, so both a real focus
// change and an artificially bubbling event reach the handler.
function focusEventOn(element: Element) {
  element.dispatchEvent(new FocusEvent('focus', { bubbles: true }))
}

describe('useOnFocusOutside', () => {
  let removeOutside: (() => void) | undefined

  afterEach(() => {
    removeOutside?.()
    removeOutside = undefined
  })

  function createOutsideElement() {
    const outside = appendOutsideElement()
    removeOutside = outside.remove

    return outside.element
  }

  it('calls the callback when an element outside receives focus', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    focusEventOn(createOutsideElement())

    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('does not call the callback when the element itself receives focus', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    focusEventOn(wrapper.find('#box').element)

    expect(callback).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('does not call the callback when a descendant receives focus', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    focusEventOn(wrapper.find('#inside').element)

    expect(callback).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('passes the originating focus event to the callback', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    const target = createOutsideElement()
    focusEventOn(target)

    expect(callback.mock.calls[0]![0]).toBeInstanceOf(FocusEvent)
    expect(callback.mock.calls[0]![0].target).toBe(target)

    wrapper.unmount()
  })

  it('treats focus anywhere as outside while the element is not rendered', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback, { rendered: false })

    focusEventOn(createOutsideElement())

    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('reports each outside focus for as long as the host is mounted', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    const target = createOutsideElement()
    focusEventOn(target)
    focusEventOn(target)

    expect(callback).toHaveBeenCalledTimes(2)

    wrapper.unmount()
  })

  it('stops listening once the host component is unmounted', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    wrapper.unmount()
    focusEventOn(createOutsideElement())

    expect(callback).not.toHaveBeenCalled()
  })

  it('calls the callback when the user actually moves focus outside', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    createOutsideElement().focus()

    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })
})
