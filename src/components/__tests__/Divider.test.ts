import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Divider from '@/components/Divider.vue'

describe('Divider', () => {
  it('renders an hr element', () => {
    const wrapper = mount(Divider)

    expect(wrapper.element.tagName).toBe('HR')
  })

  it('is horizontal by default and exposes no orientation to assistive tech', () => {
    const wrapper = mount(Divider)

    expect(wrapper.classes()).not.toContain('Divider--vertical')
    expect(wrapper.attributes('aria-orientation')).toBeUndefined()
  })

  it('is horizontal when the orientation is explicitly horizontal', () => {
    const wrapper = mount(Divider, { props: { orientation: 'horizontal' } })

    expect(wrapper.classes()).not.toContain('Divider--vertical')
    expect(wrapper.attributes('aria-orientation')).toBeUndefined()
  })

  it('marks itself as vertical when the orientation is vertical', () => {
    const wrapper = mount(Divider, { props: { orientation: 'vertical' } })

    expect(wrapper.classes()).toContain('Divider--vertical')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })

  it('switches orientation when the prop changes', async () => {
    const wrapper = mount(Divider, { props: { orientation: 'vertical' } })

    await wrapper.setProps({ orientation: 'horizontal' })

    expect(wrapper.classes()).not.toContain('Divider--vertical')
    expect(wrapper.attributes('aria-orientation')).toBeUndefined()
  })
})
