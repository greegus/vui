import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import FormFields from '@/components/FormFields.vue'

const StubInput = defineComponent({
  props: ['modelValue', 'invalid', 'id', 'disabled', 'required', 'options'],
  emits: ['update:model-value'],
  template: '<input :id="id" :data-invalid="invalid" :disabled="disabled" :data-options="String(options)" />',
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

  describe('field config derived from the form data', () => {
    const dependentFields = [
      { name: 'country', component: StubInput, label: 'Country' },
      {
        name: 'state',
        component: StubInput,
        label: 'State',
        props: (data: { country: string }) => ({ options: data.country === 'us' ? ['TX', 'NY'] : [] }),
        disabled: (data: { country: string }) => !data.country,
        required: (data: { country: string }) => Boolean(data.country),
      },
    ]

    function mountDependent(modelValue: Record<string, unknown>) {
      return mount(FormFields, { props: { fields: dependentFields, modelValue } })
    }

    it('passes the whole form data to a computed props function', () => {
      const wrapper = mountDependent({ country: 'us', state: '' })

      expect(wrapper.findAll('input')[1]!.attributes('data-options')).toBe('TX,NY')
    })

    it('passes the whole form data to a computed disabled function', () => {
      expect(mountDependent({ country: '', state: '' }).findAll('input')[1]!.attributes('disabled')).toBeDefined()
      expect(mountDependent({ country: 'us', state: '' }).findAll('input')[1]!.attributes('disabled')).toBeUndefined()
    })

    it('marks the field required based on another field', () => {
      const wrapper = mountDependent({ country: 'us', state: '' })

      expect(wrapper.findAll('.FormGroup')[1]!.text()).toContain('*')
    })

    it('re-resolves the config when the field it depends on changes', async () => {
      const wrapper = mountDependent({ country: '', state: '' })

      expect(wrapper.findAll('input')[1]!.attributes('disabled')).toBeDefined()

      await wrapper.setProps({ modelValue: { country: 'us', state: '' } })

      expect(wrapper.findAll('input')[1]!.attributes('disabled')).toBeUndefined()
      expect(wrapper.findAll('input')[1]!.attributes('data-options')).toBe('TX,NY')
    })

    it('still accepts plain objects and booleans', () => {
      const wrapper = mount(FormFields, {
        props: {
          fields: [{ name: 'email', component: StubInput, label: 'Email', props: { options: ['a'] }, disabled: true }],
          modelValue: { email: '' },
        },
      })

      expect(wrapper.find('input').attributes('data-options')).toBe('a')
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })
  })
})
