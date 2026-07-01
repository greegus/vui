import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import RadioGroup from '@/components/RadioGroup.vue'

describe('RadioGroup', () => {
  it('exposes a radiogroup role on the container', () => {
    const wrapper = mount(RadioGroup, { props: { options: ['Red', 'Green', 'Blue'] } })

    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
  })

  it('renders one radio per item of a string array', () => {
    const wrapper = mount(RadioGroup, { props: { modelValue: 'Green', options: ['Red', 'Green', 'Blue'] } })

    const radios = wrapper.findAll('input[type="radio"]')

    expect(radios).toHaveLength(3)
    expect(wrapper.findAll('.RadioGroup__label').map((l) => l.text())).toEqual(['Red', 'Green', 'Blue'])
  })

  it('renders radios from an object array using extractors', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'pro',
        options: [
          { id: 'free', name: 'Free' },
          { id: 'pro', name: 'Pro' },
        ],
        optionValue: 'id',
        optionLabel: 'name',
      },
    })

    const radios = wrapper.findAll('input[type="radio"]')

    expect(radios.map((r) => r.attributes('value'))).toEqual(['free', 'pro'])
    expect(radios[1].element.checked).toBe(true)
  })

  it('emits update:modelValue with the selected value on input', async () => {
    const wrapper = mount(RadioGroup, { props: { modelValue: 'Red', options: ['Red', 'Green', 'Blue'] } })

    await wrapper.findAll('input[type="radio"]')[1].trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Green'])
  })

  it('parses the emitted value to a number when type="number"', async () => {
    const wrapper = mount(RadioGroup, { props: { modelValue: 1, options: [1, 2, 3], type: 'number' } })

    await wrapper.findAll('input[type="radio"]')[1].trigger('input')

    const emitted = wrapper.emitted('update:modelValue')![0][0]

    expect(emitted).toBe(2)
    expect(typeof emitted).toBe('number')
  })

  it('disables every radio when the group is disabled', () => {
    const wrapper = mount(RadioGroup, { props: { options: ['Red', 'Green'], disabled: true } })

    const radios = wrapper.findAll('input[type="radio"]')

    expect(radios.every((r) => r.element.disabled)).toBe(true)
    expect(wrapper.findAll('.RadioGroup__option--disabled')).toHaveLength(2)
  })

  it('disables a single option via the option-disabled extractor', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        options: [
          { id: 'a', name: 'A', off: false },
          { id: 'b', name: 'B', off: true },
        ],
        optionValue: 'id',
        optionLabel: 'name',
        optionDisabled: 'off',
      },
    })

    const radios = wrapper.findAll('input[type="radio"]')

    expect(radios[0].element.disabled).toBe(false)
    expect(radios[1].element.disabled).toBe(true)
  })
})
