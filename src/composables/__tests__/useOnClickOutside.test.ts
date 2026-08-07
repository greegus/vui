import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'

import { useOnClickOutside } from '@/composables/useOnClickOutside'

const Host = defineComponent({
  props: {
    callback: { type: Function, required: true },
    rendered: { type: Boolean, default: true },
  },
  setup(props) {
    const element = ref<HTMLElement>()

    useOnClickOutside(element, (e) => props.callback(e))

    return { element }
  },
  template: `
    <div v-if="rendered" ref="element" id="box">
      <button id="inside">Inside</button>
    </div>
  `,
})

function mountHost(callback: (e: MouseEvent) => void, props: Record<string, unknown> = {}) {
  return mount(Host, { props: { callback, ...props }, attachTo: document.body })
}

function mousedownOn(element: Element) {
  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
}

describe('useOnClickOutside', () => {
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

  it('calls the callback when the mousedown happens outside the element', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    mousedownOn(createOutsideElement())

    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('does not call the callback when the mousedown happens on the element itself', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    mousedownOn(wrapper.find('#box').element)

    expect(callback).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('does not call the callback when the mousedown happens on a descendant of the element', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    mousedownOn(wrapper.find('#inside').element)

    expect(callback).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('passes the originating mouse event to the callback', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    const target = createOutsideElement()
    mousedownOn(target)

    expect(callback.mock.calls[0]![0]).toBeInstanceOf(MouseEvent)
    expect(callback.mock.calls[0]![0].target).toBe(target)

    wrapper.unmount()
  })

  it('reacts to mousedown rather than click', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    createOutsideElement().dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(callback).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('treats every click as outside while the element is not rendered', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback, { rendered: false })

    mousedownOn(createOutsideElement())

    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('stops listening once the host component is unmounted', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    wrapper.unmount()
    mousedownOn(createOutsideElement())

    expect(callback).not.toHaveBeenCalled()
  })

  it('keeps reporting outside clicks for as long as the host is mounted', () => {
    const callback = vi.fn()
    const wrapper = mountHost(callback)

    const target = createOutsideElement()
    mousedownOn(target)
    mousedownOn(target)
    mousedownOn(target)

    expect(callback).toHaveBeenCalledTimes(3)

    wrapper.unmount()
  })
})
