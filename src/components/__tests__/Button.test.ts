import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { RouterLinkStub } from '@/__tests__/helpers/stubs'
import Button from '@/components/Button.vue'

function mountLink(props: Record<string, unknown>) {
  return mount(Button, { props, global: { stubs: { RouterLink: RouterLinkStub } } })
}

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

  describe('as a link', () => {
    it('renders a router-link that keeps its own href', () => {
      const wrapper = mountLink({ to: '/about', label: 'About' })

      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe('/about')
    })

    it('passes a route location object through to the router link', () => {
      const wrapper = mountLink({ to: { name: 'home' }, label: 'Home' })

      expect(wrapper.attributes('href')).toBe(JSON.stringify({ name: 'home' }))
    })

    it('sets no type attribute on a router link', () => {
      const wrapper = mountLink({ to: '/about', label: 'About' })

      expect(wrapper.attributes('type')).toBeUndefined()
    })

    it('renders an anchor with href for an external link', () => {
      const wrapper = mount(Button, { props: { href: 'https://example.com', label: 'Visit' } })

      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe('https://example.com')
      expect(wrapper.attributes('type')).toBeUndefined()
    })

    it('sets no href or to attribute on a plain button', () => {
      const wrapper = mount(Button, { props: { label: 'Plain' } })

      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.attributes('href')).toBeUndefined()
      expect(wrapper.attributes('to')).toBeUndefined()
      expect(wrapper.attributes('type')).toBe('button')
    })
  })
})
