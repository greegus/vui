import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'

import { useOnFocusOutside } from '@/composables/useOnFocusOutside'

const Host = defineComponent({
  props: {
    callback: { type: Function, required: true },
    rendered: { type: Boolean, default: true },
  },
  setup(props) {
    const element = ref<HTMLElement>()

    useOnFocusOutside(element, (e) => props.callback(e))

    return { element }
  },
  template: `
    <div v-if="rendered" ref="element" id="box">
      <button id="inside">Inside</button>
    </div>
  `,
})

function mountHost(callback: (e: FocusEvent) => void, props: Record<string, unknown> = {}) {
  return mount(Host, { props: { callback, ...props }, attachTo: document.body })
}

// The composable subscribes to `focus` on `window` with capture, so both a real focus
// change and an artificially bubbling event reach the handler.
function focusEventOn(element: Element) {
  element.dispatchEvent(new FocusEvent('focus', { bubbles: true }))
}

describe('useOnFocusOutside', () => {
  let outside: HTMLButtonElement | undefined

  afterEach(() => {
    outside?.remove()
    outside = undefined
  })

  function createOutsideElement() {
    outside = document.createElement('button')
    document.body.appendChild(outside)

    return outside
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
