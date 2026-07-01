import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'

import { useFocusTrap } from '@/composables/useFocusTrap'

const Host = defineComponent({
  setup() {
    const root = ref<HTMLElement>()

    useFocusTrap(root, { initialFocus: () => root.value?.querySelector<HTMLElement>('#first') })

    return { root }
  },
  template: `
    <div ref="root" tabindex="-1">
      <button id="first">First</button>
      <button id="second">Second</button>
    </div>
  `,
})

describe('useFocusTrap', () => {
  let outside: HTMLButtonElement

  afterEach(() => {
    outside?.remove()
  })

  it('moves focus inside the container on mount', () => {
    const wrapper = mount(Host, { attachTo: document.body })

    expect(document.activeElement).toBe(wrapper.find('#first').element)

    wrapper.unmount()
  })

  it('restores focus to the previously focused element after unmount', () => {
    outside = document.createElement('button')
    document.body.appendChild(outside)
    outside.focus()

    expect(document.activeElement).toBe(outside)

    const wrapper = mount(Host, { attachTo: document.body })

    // Focus moved into the trap.
    expect(document.activeElement).not.toBe(outside)

    wrapper.unmount()

    // Focus is handed back to the element that was focused before the trap.
    expect(document.activeElement).toBe(outside)
  })
})
