import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'

import FormFields from '@/components/FormFields.vue'

const StubInput = defineComponent({
  props: ['modelValue', 'invalid', 'id'],
  emits: ['update:model-value'],
  template: '<input :id="id" :data-invalid="invalid" />',
})

const fields = [{ name: 'email', component: StubInput, label: 'Email' }]

describe('FormFields', () => {
  it('renders the validation error message and invalid state from validationResults', () => {
    const wrapper = mount(FormFields, {
      props: {
        fields,
        modelValue: { email: '' },
        validationResults: { email: { isInvalid: true, errorMessage: 'Email is required' } },
      },
    })

    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.find('.FormGroup--invalid').exists()).toBe(true)
    expect(wrapper.find('input').attributes('data-invalid')).toBe('true')
  })

  it('shows no error when the field is valid', () => {
    const wrapper = mount(FormFields, {
      props: {
        fields,
        modelValue: { email: 'a@b.com' },
        validationResults: { email: { isInvalid: false, errorMessage: '' } },
      },
    })

    expect(wrapper.find('.FormGroup__error').exists()).toBe(false)
    expect(wrapper.find('.FormGroup--invalid').exists()).toBe(false)
  })

  it('links the label to the input via a generated id', () => {
    const wrapper = mount(FormFields, {
      props: { fields, modelValue: { email: '' } },
    })

    const labelFor = wrapper.find('label').attributes('for')
    const inputId = wrapper.find('input').attributes('id')

    expect(labelFor).toBeTruthy()
    expect(labelFor).toBe(inputId)
  })
})
