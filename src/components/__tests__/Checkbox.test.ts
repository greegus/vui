import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Checkbox from '@/components/Checkbox.vue'

describe('Checkbox', () => {
  it('renders the label prop', () => {
    const wrapper = mount(Checkbox, { props: { label: 'I accept the terms' } })

    expect(wrapper.find('.Checkbox__label').text()).toBe('I accept the terms')
  })

  it('reflects the model value in the checked state', () => {
    const checked = mount(Checkbox, { props: { modelValue: true } })
    const unchecked = mount(Checkbox, { props: { modelValue: false } })

    expect(checked.find('input').element.checked).toBe(true)
    expect(unchecked.find('input').element.checked).toBe(false)
  })

  it('emits a boolean update:modelValue when toggled', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })

    const input = wrapper.find('input')
    input.element.checked = true
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  it('applies the indeterminate state to the input', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false, indeterminate: true } })

    expect(wrapper.find('input').element.indeterminate).toBe(true)
  })

  it('disables the input and applies the disabled class', () => {
    const wrapper = mount(Checkbox, { props: { disabled: true } })

    expect(wrapper.find('input').element.disabled).toBe(true)
    expect(wrapper.find('.Checkbox--disabled').exists()).toBe(true)
  })

  it('renders the switch variant', () => {
    const wrapper = mount(Checkbox, { props: { switch: true } })

    expect(wrapper.find('.Checkbox__switch').exists()).toBe(true)
    expect(wrapper.find('.Checkbox__checkbox').exists()).toBe(false)
  })

  it('marks the input and the box as invalid', () => {
    const wrapper = mount(Checkbox, { props: { invalid: true } })

    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('.Checkbox--invalid').exists()).toBe(true)
    expect(wrapper.find('.Checkbox__checkbox').classes()).toContain('vuiii-input--invalid')
  })

  it('leaves the invalid markers off by default', () => {
    const wrapper = mount(Checkbox)

    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.find('.Checkbox__checkbox').classes()).not.toContain('vuiii-input--invalid')
  })

  // A click only runs the browser's activation behaviour — the toggle and the `input` event — on an
  // element that is in the document, so these are mounted for real. Detached, nothing fires at all
  // and a readonly assertion would pass for the wrong reason.
  it('blocks toggling when readonly', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false, readonly: true }, attachTo: document.body })

    const input = wrapper.find('input')
    await input.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input.element.checked).toBe(false)
    expect(input.attributes('aria-readonly')).toBe('true')

    wrapper.unmount()
  })

  it('toggles on click when it is not readonly', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false }, attachTo: document.body })

    const input = wrapper.find('input')
    await input.trigger('click')

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(input.element.checked).toBe(true)

    wrapper.unmount()
  })
})
