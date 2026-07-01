import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Select from '@/components/Select.vue'

describe('Select', () => {
  it('renders an option per item of a string array', () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'Green', options: ['Red', 'Green', 'Blue'] },
    })

    const options = wrapper.findAll('option')

    expect(options).toHaveLength(3)
    expect(options.map((o) => o.text())).toEqual(['Red', 'Green', 'Blue'])
    expect(options.map((o) => o.attributes('value'))).toEqual(['Red', 'Green', 'Blue'])
  })

  it('renders options from an object array using option-value/option-label extractors', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'uk',
        options: [
          { code: 'us', name: 'United States' },
          { code: 'uk', name: 'United Kingdom' },
        ],
        optionValue: 'code',
        optionLabel: 'name',
      },
    })

    const options = wrapper.findAll('option')

    expect(options.map((o) => o.attributes('value'))).toEqual(['us', 'uk'])
    expect(options.map((o) => o.text())).toEqual(['United States', 'United Kingdom'])
  })

  it('renders options from a key-value object', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'draft',
        options: { draft: 'Draft', published: 'Published', archived: 'Archived' },
      },
    })

    const options = wrapper.findAll('option')

    expect(options.map((o) => o.attributes('value'))).toEqual(['draft', 'published', 'archived'])
    expect(options.map((o) => o.text())).toEqual(['Draft', 'Published', 'Archived'])
  })

  it('renders a placeholder option when placeholder is set', () => {
    const wrapper = mount(Select, {
      props: { options: ['Red', 'Green'], placeholder: 'Pick a color' },
    })

    const placeholder = wrapper.find('option[data-placeholder]')

    expect(placeholder.exists()).toBe(true)
    expect(placeholder.text()).toBe('Pick a color')
  })

  it('marks the option matching the model value as selected', () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'Green', options: ['Red', 'Green', 'Blue'] },
    })

    expect(wrapper.find('option[value="Green"]').element.selected).toBe(true)
    expect(wrapper.find('option[value="Red"]').element.selected).toBe(false)
  })

  it('emits update:modelValue with the raw string value on change', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'Red', options: ['Red', 'Green', 'Blue'] },
    })

    const select = wrapper.find('select')
    select.element.value = 'Blue'
    await select.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Blue'])
  })

  it('parses the emitted value to a number when type="number"', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: 1, options: [1, 2, 3], type: 'number' },
    })

    const select = wrapper.find('select')
    select.element.value = '2'
    await select.trigger('input')

    const emitted = wrapper.emitted('update:modelValue')![0][0]

    expect(emitted).toBe(2)
    expect(typeof emitted).toBe('number')
  })
})
