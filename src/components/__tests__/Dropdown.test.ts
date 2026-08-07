import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'

import Dropdown from '@/components/Dropdown.vue'

const DROPDOWN = '.Dropdown__dropdown'

let wrappers: { unmount: () => void }[] = []

function mountDropdown(options: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(Dropdown, { attachTo: document.body, ...(options as object) } as never)
  wrappers.push(wrapper)
  return wrapper
}

function mousedownOn(element: Element) {
  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
}

function pressKey(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
}

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount())
  wrappers = []
})

describe('Dropdown', () => {
  it('renders a default button trigger with the given label and no dropdown content', () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })

    const trigger = wrapper.find('button')

    expect(trigger.exists()).toBe(true)
    expect(trigger.text()).toContain('Options')
    expect(trigger.attributes('aria-haspopup')).toBe('true')
    expect(wrapper.find(DROPDOWN).exists()).toBe(false)
  })

  it('opens the dropdown content when the default trigger is clicked', async () => {
    const wrapper = mountDropdown({
      props: { label: 'Options' },
      slots: { default: '<span class="content">Menu content</span>' },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.find(DROPDOWN).exists()).toBe(true)
    expect(wrapper.find('.content').text()).toBe('Menu content')
  })

  it('closes the dropdown again on a second trigger click', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })

    await wrapper.find('button').trigger('click')
    await wrapper.find('button').trigger('click')

    expect(wrapper.find(DROPDOWN).exists()).toBe(false)
  })

  it('reflects the open state in aria-expanded of the default trigger', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })

    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
  })

  it('emits open and close as the dropdown is toggled', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })

    await wrapper.find('button').trigger('click')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('open')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('renders the trigger slot instead of the default button', () => {
    const wrapper = mountDropdown({
      props: { label: 'Options' },
      slots: { trigger: () => h('button', { class: 'custom-trigger' }, 'Custom') },
    })

    expect(wrapper.find('.custom-trigger').exists()).toBe(true)
    expect(wrapper.findAll('button')).toHaveLength(1)
  })

  it('passes open, close, toggle and isOpen to the trigger slot', async () => {
    let slotProps: Record<string, unknown> = {}

    const wrapper = mountDropdown({
      slots: {
        trigger: (props: Record<string, unknown>) => {
          slotProps = props
          return h('button', { class: 'custom-trigger' }, String(props.isOpen))
        },
      },
    })

    expect(Object.keys(slotProps).sort()).toEqual(['close', 'isOpen', 'open', 'toggle'])
    expect(slotProps.isOpen).toBe(false)

    ;(slotProps.open as () => void)()
    await wrapper.vm.$nextTick()

    expect(wrapper.find(DROPDOWN).exists()).toBe(true)
    expect(wrapper.find('.custom-trigger').text()).toBe('true')

    ;(slotProps.close as () => void)()
    await wrapper.vm.$nextTick()

    expect(wrapper.find(DROPDOWN).exists()).toBe(false)
    expect(wrapper.find('.custom-trigger').text()).toBe('false')
  })

  it('opens through the toggle() given to the trigger slot', async () => {
    const wrapper = mountDropdown({
      slots: {
        trigger: (props: { toggle: (state?: boolean) => void }) =>
          h('button', { class: 'custom-trigger', onClick: () => props.toggle() }, 'Custom'),
      },
    })

    await wrapper.find('.custom-trigger').trigger('click')

    expect(wrapper.find(DROPDOWN).exists()).toBe(true)
  })

  it('passes close to the default content slot', async () => {
    const wrapper = mountDropdown({
      props: { label: 'Options' },
      slots: {
        default: (props: { close: () => void }) => h('button', { class: 'content-action', onClick: props.close }, 'Do'),
      },
    })

    await wrapper.find('button').trigger('click')
    await wrapper.find('.content-action').trigger('click')

    expect(wrapper.find(DROPDOWN).exists()).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('closes when Escape is pressed while open', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })

    await wrapper.find('button').trigger('click')
    pressKey('Escape')
    await wrapper.vm.$nextTick()

    expect(wrapper.find(DROPDOWN).exists()).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('ignores Escape while closed', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })

    pressKey('Escape')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('stays open on keys other than Escape', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })

    await wrapper.find('button').trigger('click')
    pressKey('Enter')
    await wrapper.vm.$nextTick()

    expect(wrapper.find(DROPDOWN).exists()).toBe(true)
  })

  it('closes on a mousedown outside of the component', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })

    await wrapper.find('button').trigger('click')
    mousedownOn(document.body)
    await wrapper.vm.$nextTick()

    expect(wrapper.find(DROPDOWN).exists()).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('stays open on a mousedown inside the component', async () => {
    const wrapper = mountDropdown({
      props: { label: 'Options' },
      slots: { default: '<span class="content">Menu content</span>' },
    })

    await wrapper.find('button').trigger('click')
    mousedownOn(wrapper.find('.content').element)
    await wrapper.vm.$nextTick()

    expect(wrapper.find(DROPDOWN).exists()).toBe(true)
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('ignores outside mousedowns while closed', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })

    mousedownOn(document.body)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('stops reacting to outside mousedowns once unmounted', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })
    await wrapper.find('button').trigger('click')

    wrapper.unmount()
    mousedownOn(document.body)

    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('opens and closes through the exposed open/close methods', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })
    const vm = wrapper.vm as unknown as { open: () => void; close: () => void }

    vm.open()
    await wrapper.vm.$nextTick()

    expect(wrapper.find(DROPDOWN).exists()).toBe(true)

    vm.close()
    await wrapper.vm.$nextTick()

    expect(wrapper.find(DROPDOWN).exists()).toBe(false)
  })

  it('exposes isOpen tracking the current state', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })
    const vm = wrapper.vm as unknown as { open: () => void; close: () => void; isOpen: boolean }

    expect(vm.isOpen).toBe(false)

    vm.open()
    await wrapper.vm.$nextTick()

    expect(vm.isOpen).toBe(true)

    vm.close()
    await wrapper.vm.$nextTick()

    expect(vm.isOpen).toBe(false)
  })

  it('emits open only once when open() is called on an already open dropdown', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })
    const vm = wrapper.vm as unknown as { open: () => void }

    vm.open()
    vm.open()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('open')).toHaveLength(1)
  })

  it('forces the state when toggle is called with an explicit argument', async () => {
    const wrapper = mountDropdown({ props: { label: 'Options' } })
    const vm = wrapper.vm as unknown as { toggle: (state?: boolean) => void }

    vm.toggle(true)
    vm.toggle(true)
    await wrapper.vm.$nextTick()

    expect(wrapper.find(DROPDOWN).exists()).toBe(true)
    expect(wrapper.emitted('open')).toHaveLength(1)

    vm.toggle(false)
    await wrapper.vm.$nextTick()

    expect(wrapper.find(DROPDOWN).exists()).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
