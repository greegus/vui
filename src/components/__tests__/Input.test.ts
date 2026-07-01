import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Input from '@/components/Input.vue'

describe('Input', () => {
  it('reflects the model value in the input element', () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello' } })

    expect(wrapper.find('input').element.value).toBe('hello')
  })

  it('emits a string update:modelValue on input', async () => {
    const wrapper = mount(Input, { props: { modelValue: '' } })

    const input = wrapper.find('input')
    input.element.value = 'world'
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['world'])
  })

  it('emits a number when valueAsNumber is set', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: undefined, valueAsNumber: true },
      attrs: { type: 'number' },
    })

    const input = wrapper.find('input')
    input.element.value = '42'
    await input.trigger('input')

    const emitted = wrapper.emitted('update:modelValue')![0][0]

    expect(emitted).toBe(42)
    expect(typeof emitted).toBe('number')
  })

  it('renders prefix and suffix icons', () => {
    const wrapper = mount(Input, {
      props: { prefixIcon: 'magnifying-glass', suffixIcon: 'envelope' },
    })

    expect(wrapper.find('.vuiii-input__prefix-icon').exists()).toBe(true)
    expect(wrapper.find('.vuiii-input__suffix-icon').exists()).toBe(true)
  })

  it('emits prefix-icon-click when the prefix icon is clicked', async () => {
    const wrapper = mount(Input, { props: { prefixIcon: 'magnifying-glass' } })

    await wrapper.find('.vuiii-input__prefix-icon').trigger('click')

    expect(wrapper.emitted('prefix-icon-click')).toHaveLength(1)
  })

  it('emits suffix-icon-click when the suffix icon is clicked', async () => {
    const wrapper = mount(Input, { props: { suffixIcon: 'x-mark' } })

    await wrapper.find('.vuiii-input__suffix-icon').trigger('click')

    expect(wrapper.emitted('suffix-icon-click')).toHaveLength(1)
  })
})
