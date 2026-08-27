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

  it('marks the group and its radios as invalid', () => {
    const wrapper = mount(RadioGroup, { props: { options: ['Red', 'Green'], invalid: true } })

    expect(wrapper.find('[role="radiogroup"]').attributes('aria-invalid')).toBe('true')
    expect(
      wrapper.findAll('.RadioGroup__radio').every((radio) => radio.classes().includes('vuiii-input--invalid')),
    ).toBe(true)
  })

  // A click only runs the browser's activation behaviour — the toggle and the `input` event — on an
  // element that is in the document, so these are mounted for real. Detached, nothing fires at all
  // and a readonly assertion would pass for the wrong reason.
  it('blocks picking another option when readonly', async () => {
    const wrapper = mount(RadioGroup, {
      props: { options: ['Red', 'Green'], modelValue: 'Red', readonly: true },
      attachTo: document.body,
    })

    const green = wrapper.findAll('input[type="radio"]')[1]!
    await green.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(green.element.checked).toBe(false)
    expect(wrapper.find('[role="radiogroup"]').attributes('aria-readonly')).toBe('true')

    wrapper.unmount()
  })

  it('picks an option on click when it is not readonly', async () => {
    const wrapper = mount(RadioGroup, {
      props: { options: ['Red', 'Green'], modelValue: 'Red' },
      attachTo: document.body,
    })

    await wrapper.findAll('input[type="radio"]')[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Green'])

    wrapper.unmount()
  })

  it('applies the size class to the group', () => {
    const wrapper = mount(RadioGroup, { props: { options: ['Red'], size: 'small' } })

    expect(wrapper.find('[role="radiogroup"]').classes()).toContain('RadioGroup--size-small')
  })

  it('marks the group as required', () => {
    const wrapper = mount(RadioGroup, { props: { options: ['Red'], required: true } })

    expect(wrapper.find('[role="radiogroup"]').attributes('aria-required')).toBe('true')
  })
})
