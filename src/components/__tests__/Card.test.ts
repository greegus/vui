import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Card from '@/components/Card.vue'

describe('Card', () => {
  it('renders the title prop and default-slot body', () => {
    const wrapper = mount(Card, {
      props: { title: 'Profile' },
      slots: { default: 'Body content' },
    })

    expect(wrapper.find('.Card__header').exists()).toBe(true)
    expect(wrapper.find('.Card__title').text()).toBe('Profile')
    expect(wrapper.find('.Card__body').text()).toBe('Body content')
  })

  it('does not render a header without a title or header slots', () => {
    const wrapper = mount(Card, { slots: { default: 'Body only' } })

    expect(wrapper.find('.Card__header').exists()).toBe(false)
    expect(wrapper.find('.Card__body').text()).toBe('Body only')
  })

  it('lets the title slot override the title prop', () => {
    const wrapper = mount(Card, {
      props: { title: 'Prop title' },
      slots: { title: 'Slot title' },
    })

    expect(wrapper.find('.Card__title').text()).toBe('Slot title')
  })

  it('lets the header slot override the whole header-left region', () => {
    const wrapper = mount(Card, {
      props: { title: 'Ignored' },
      slots: { header: '<div class="custom-header">Custom</div>' },
    })

    expect(wrapper.find('.custom-header').exists()).toBe(true)
    expect(wrapper.find('.Card__title').exists()).toBe(false)
  })

  it('renders the tools slot in the header', () => {
    const wrapper = mount(Card, {
      props: { title: 'With tools' },
      slots: { tools: '<button class="tool">+</button>' },
    })

    expect(wrapper.find('.Card__tools .tool').exists()).toBe(true)
  })

  it('renders a header when only the tools slot is provided', () => {
    const wrapper = mount(Card, {
      slots: { tools: '<button class="tool">+</button>', default: 'Body' },
    })

    expect(wrapper.find('.Card__header').exists()).toBe(true)
  })
})
