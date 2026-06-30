import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Button from '@/components/Button.vue'

describe('Button', () => {
  it('defaults to filled secondary', () => {
    const wrapper = mount(Button, { props: { label: 'Hi' } })

    expect(wrapper.classes()).toContain('vuiii-button--color-secondary')
    expect(wrapper.classes()).toContain('vuiii-button--variant-filled')
    expect(wrapper.text()).toBe('Hi')
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('applies the color class', () => {
    const wrapper = mount(Button, { props: { color: 'danger' } })

    expect(wrapper.classes()).toContain('vuiii-button--color-danger')
  })

  it('applies the variant class', () => {
    const wrapper = mount(Button, { props: { color: 'primary', variant: 'outlined' } })

    expect(wrapper.classes()).toContain('vuiii-button--color-primary')
    expect(wrapper.classes()).toContain('vuiii-button--variant-outlined')
  })

  it('supports the text variant', () => {
    const wrapper = mount(Button, { props: { variant: 'text' } })

    expect(wrapper.classes()).toContain('vuiii-button--variant-text')
    expect(wrapper.classes()).not.toContain('vuiii-button--variant-filled')
  })

  it('renders the default-slot content over the label', () => {
    const wrapper = mount(Button, { props: { label: 'Label' }, slots: { default: 'Slotted' } })

    expect(wrapper.text()).toBe('Slotted')
  })
})
