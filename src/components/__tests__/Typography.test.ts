import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Typography from '@/components/Typography.vue'

describe('Typography', () => {
  it('renders a p tag with the body1 variant by default', () => {
    const wrapper = mount(Typography, { slots: { default: 'Hello' } })

    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toContain('vuiii-typography-body1')
  })

  it.each([
    ['display', 'H1'],
    ['heading1', 'H1'],
    ['heading2', 'H2'],
    ['heading3', 'H3'],
    ['heading4', 'H4'],
    ['heading5', 'H5'],
    ['heading6', 'H6'],
    ['body1', 'P'],
    ['body2', 'P'],
    ['label', 'SPAN'],
    ['caption', 'SPAN'],
  ])('renders the %s variant as a %s element', (variant, tagName) => {
    const wrapper = mount(Typography, { props: { variant: variant as any } })

    expect(wrapper.element.tagName).toBe(tagName)
  })

  it('applies the class matching the variant', () => {
    const wrapper = mount(Typography, { props: { variant: 'caption' } })

    expect(wrapper.classes()).toContain('vuiii-typography-caption')
    expect(wrapper.classes()).not.toContain('vuiii-typography-body1')
  })

  it('renders the overridden tag while keeping the variant styling', () => {
    const wrapper = mount(Typography, {
      props: { variant: 'heading1', tag: 'h2' },
    })

    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.classes()).toContain('vuiii-typography-heading1')
  })

  it('renders the default slot content', () => {
    const wrapper = mount(Typography, {
      props: { variant: 'heading3' },
      slots: { default: 'Section title' },
    })

    expect(wrapper.text()).toBe('Section title')
  })

  it('renders the overridden tag even without a variant', () => {
    const wrapper = mount(Typography, {
      props: { tag: 'div' },
      slots: { default: 'Plain' },
    })

    expect(wrapper.element.tagName).toBe('DIV')
  })
})
