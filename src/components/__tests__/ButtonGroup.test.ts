import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'

describe('ButtonGroup', () => {
  it('renders the slotted buttons in order', () => {
    const wrapper = mount(ButtonGroup, {
      slots: {
        default: () => [h(Button, { label: 'Left' }), h(Button, { label: 'Middle' }), h(Button, { label: 'Right' })],
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons).toHaveLength(3)
    expect(buttons.map((button) => button.text())).toEqual(['Left', 'Middle', 'Right'])
  })

  it('renders arbitrary slot content', () => {
    const wrapper = mount(ButtonGroup, {
      slots: { default: '<span class="custom">Anything</span>' },
    })

    expect(wrapper.find('.custom').text()).toBe('Anything')
  })

  it('renders an empty group when no content is slotted', () => {
    const wrapper = mount(ButtonGroup)

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('keeps clicks on the slotted buttons working', async () => {
    const onClick = vi.fn()

    const wrapper = mount(ButtonGroup, {
      slots: { default: () => h(Button, { label: 'Save', onClick }) },
    })

    await wrapper.find('button').trigger('click')

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
