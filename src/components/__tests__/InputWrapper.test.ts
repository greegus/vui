import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { h } from 'vue'

import InputWrapper from '@/components/InputWrapper.vue'
import { registerCustomIconResolver } from '@/utils/iconsResolver'

beforeAll(() => {
  registerCustomIconResolver((name) => ({
    name: 'StubIcon',
    render: () => h('i', { 'class': 'stub-icon', 'data-icon': name }),
  }))
})

const slots = { default: '<input class="vuiii-input__nested" />' }

describe('InputWrapper', () => {
  it('renders the default slot content', () => {
    const wrapper = mount(InputWrapper, { slots })

    expect(wrapper.find('input.vuiii-input__nested').exists()).toBe(true)
  })

  it('renders no prefix or suffix container when neither icon nor slot is provided', () => {
    const wrapper = mount(InputWrapper, { slots })

    expect(wrapper.find('.vuiii-input__prefix-icon').exists()).toBe(false)
    expect(wrapper.find('.vuiii-input__suffix-icon').exists()).toBe(false)
  })

  it.each(['small', 'normal', 'large'] as const)('applies the %s size modifier class', (size) => {
    const wrapper = mount(InputWrapper, { props: { size }, slots })

    expect(wrapper.classes()).toContain(`vuiii-input--${size}`)
  })

  it('applies no size modifier class when size is omitted', () => {
    const wrapper = mount(InputWrapper, { slots })

    expect(wrapper.classes().some((c) => c.startsWith('vuiii-input--'))).toBe(false)
  })

  it('applies the invalid modifier class only when invalid is set', async () => {
    const wrapper = mount(InputWrapper, { props: { invalid: false }, slots })

    expect(wrapper.classes()).not.toContain('vuiii-input--invalid')

    await wrapper.setProps({ invalid: true })

    expect(wrapper.classes()).toContain('vuiii-input--invalid')
  })

  it('applies the disabled modifier class when the disabled attribute is set', () => {
    const wrapper = mount(InputWrapper, { attrs: { disabled: true }, slots })

    expect(wrapper.classes()).toContain('vuiii-input--disabled')
  })

  it('applies the pill modifier class when pill is set', () => {
    const wrapper = mount(InputWrapper, { props: { pill: true }, slots })

    expect(wrapper.classes()).toContain('InputWrapper--pill')
  })

  it('keeps the class attribute on the wrapper element', () => {
    const wrapper = mount(InputWrapper, { attrs: { class: 'my-field' }, slots })

    expect(wrapper.classes()).toContain('my-field')
  })

  it('renders the resolved prefix icon', () => {
    const wrapper = mount(InputWrapper, { props: { prefixIcon: 'search' }, slots })

    const prefix = wrapper.find('.vuiii-input__prefix-icon')

    expect(prefix.exists()).toBe(true)
    expect(prefix.find('.stub-icon').attributes('data-icon')).toBe('search')
  })

  it('renders the resolved suffix icon', () => {
    const wrapper = mount(InputWrapper, { props: { suffixIcon: 'x' }, slots })

    const suffix = wrapper.find('.vuiii-input__suffix-icon')

    expect(suffix.exists()).toBe(true)
    expect(suffix.find('.stub-icon').attributes('data-icon')).toBe('x')
  })

  it('passes the size down to the rendered icons', () => {
    const wrapper = mount(InputWrapper, { props: { size: 'large', suffixIcon: 'x' }, slots })

    expect(wrapper.find('.vuiii-input__suffix-icon .Icon').classes()).toContain('Icon--large')
  })

  it('emits suffix-icon-click when the suffix icon is clicked', async () => {
    const wrapper = mount(InputWrapper, { props: { suffixIcon: 'x' }, slots })

    await wrapper.find('.vuiii-input__suffix-icon').trigger('click')

    expect(wrapper.emitted('suffix-icon-click')).toHaveLength(1)
  })

  it('emits prefix-icon-click when the prefix icon is clicked', async () => {
    const wrapper = mount(InputWrapper, { props: { prefixIcon: 'search' }, slots })

    await wrapper.find('.vuiii-input__prefix-icon').trigger('click')

    expect(wrapper.emitted('prefix-icon-click')).toHaveLength(1)
  })

  it('emits click with the mouse event when the wrapper is clicked', async () => {
    const wrapper = mount(InputWrapper, { slots })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('click')![0]![0]).toBeInstanceOf(Event)
  })

  it('renders the prefix slot instead of the default prefix icon markup', () => {
    const wrapper = mount(InputWrapper, {
      props: { prefixIcon: 'search' },
      slots: { ...slots, prefix: '<span class="custom-prefix">$</span>' },
    })

    expect(wrapper.find('.custom-prefix').exists()).toBe(true)
    expect(wrapper.find('.vuiii-input__prefix-icon').exists()).toBe(false)
  })

  it('renders the suffix slot even when no suffixIcon is given', () => {
    const wrapper = mount(InputWrapper, {
      slots: { ...slots, suffix: '<span class="custom-suffix">kg</span>' },
    })

    expect(wrapper.find('.custom-suffix').exists()).toBe(true)
  })

  it('renders a clickable suffix icon as a labelled button when a listener is attached', () => {
    const wrapper = mount(InputWrapper, {
      props: { suffixIcon: 'x', suffixIconLabel: 'Clear', onSuffixIconClick: () => {} },
      slots,
    })

    const suffix = wrapper.find('.vuiii-input__suffix-icon')

    expect(suffix.element.tagName).toBe('BUTTON')
    expect(suffix.attributes('aria-label')).toBe('Clear')
  })
})
