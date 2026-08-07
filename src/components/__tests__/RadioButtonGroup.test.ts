import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { h } from 'vue'

import RadioButtonGroup from '@/components/RadioButtonGroup.vue'
import { registerCustomIconResolver } from '@/utils/iconsResolver'

beforeAll(() => {
  // the icon library is an external boundary - resolve every name to a marker element
  registerCustomIconResolver((name) => ({ render: () => h('i', { 'data-icon': name }) }))
})

describe('RadioButtonGroup', () => {
  it('exposes a radiogroup role on the container and a radio role per option', () => {
    const wrapper = mount(RadioButtonGroup, { props: { options: ['List', 'Grid', 'Table'] } })

    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="radio"]')).toHaveLength(3)
  })

  it('renders one button per item of a string array', () => {
    const wrapper = mount(RadioButtonGroup, { props: { options: ['List', 'Grid', 'Table'] } })

    const buttons = wrapper.findAll('button')

    expect(buttons).toHaveLength(3)
    expect(buttons.map((b) => b.text())).toEqual(['List', 'Grid', 'Table'])
  })

  it('marks the button matching the model value as checked', () => {
    const wrapper = mount(RadioButtonGroup, { props: { modelValue: 'Grid', options: ['List', 'Grid', 'Table'] } })

    const buttons = wrapper.findAll('button')

    expect(buttons.map((b) => b.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
  })

  it('renders buttons from an object array using option-value/option-label extractors', () => {
    const wrapper = mount(RadioButtonGroup, {
      props: {
        modelValue: 'inactive',
        options: [
          { id: 'active', name: 'Active' },
          { id: 'inactive', name: 'Inactive' },
        ],
        optionValue: 'id',
        optionLabel: 'name',
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons.map((b) => b.text())).toEqual(['Active', 'Inactive'])
    expect(buttons.map((b) => b.attributes('aria-checked'))).toEqual(['false', 'true'])
  })

  it('renders buttons from a key-value object', () => {
    const wrapper = mount(RadioButtonGroup, {
      props: {
        modelValue: 'published',
        options: { draft: 'Draft', published: 'Published' },
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons.map((b) => b.text())).toEqual(['Draft', 'Published'])
    expect(buttons.map((b) => b.attributes('aria-checked'))).toEqual(['false', 'true'])
  })

  it('renders buttons using function extractors', () => {
    const wrapper = mount(RadioButtonGroup, {
      props: {
        modelValue: 2,
        options: [
          { id: 1, firstName: 'John', lastName: 'Doe' },
          { id: 2, firstName: 'Jane', lastName: 'Smith' },
        ],
        optionValue: (user: any) => user.id,
        optionLabel: (user: any) => `${user.firstName} ${user.lastName}`,
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons.map((b) => b.text())).toEqual(['John Doe', 'Jane Smith'])
    expect(buttons.map((b) => b.attributes('aria-checked'))).toEqual(['false', 'true'])
  })

  it('exposes the option description as the button title', () => {
    const wrapper = mount(RadioButtonGroup, {
      props: {
        options: [
          { id: 'list', name: 'List', hint: 'Compact rows' },
          { id: 'grid', name: 'Grid', hint: 'Large tiles' },
        ],
        optionValue: 'id',
        optionLabel: 'name',
        optionDescription: 'hint',
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons.map((b) => b.attributes('title'))).toEqual(['Compact rows', 'Large tiles'])
  })

  it('renders the icon returned by the option-icon extractor', () => {
    const wrapper = mount(RadioButtonGroup, {
      props: {
        options: [
          { value: 'list', label: 'List', icon: 'chevron-down' },
          { value: 'grid', label: 'Grid', icon: 'plus' },
        ],
        optionValue: 'value',
        optionLabel: 'label',
        optionIcon: 'icon',
      },
    })

    const icons = wrapper.findAll('[data-icon]')

    expect(icons.map((i) => i.attributes('data-icon'))).toEqual(['chevron-down', 'plus'])
  })

  it('renders the icon returned by an option-icon function extractor', () => {
    const wrapper = mount(RadioButtonGroup, {
      props: {
        options: [{ id: 'list' }, { id: 'grid' }],
        optionValue: 'id',
        optionLabel: 'id',
        optionIcon: (item: any) => `${item.id}-icon`,
      },
    })

    const icons = wrapper.findAll('[data-icon]')

    expect(icons.map((i) => i.attributes('data-icon'))).toEqual(['list-icon', 'grid-icon'])
  })

  it('renders no icon when option-icon is not set', () => {
    const wrapper = mount(RadioButtonGroup, { props: { options: ['List', 'Grid'] } })

    expect(wrapper.findAll('[data-icon]')).toHaveLength(0)
  })

  it('emits update:modelValue with the clicked option value', async () => {
    const wrapper = mount(RadioButtonGroup, { props: { modelValue: 'List', options: ['List', 'Grid', 'Table'] } })

    await wrapper.findAll('button')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Table'])
  })

  it('emits the extracted option value rather than the option object', async () => {
    const wrapper = mount(RadioButtonGroup, {
      props: {
        options: [
          { id: 'active', name: 'Active' },
          { id: 'inactive', name: 'Inactive' },
        ],
        optionValue: 'id',
        optionLabel: 'name',
      },
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['inactive'])
  })

  it('moves the checked state to the clicked option when the model value is kept in sync', async () => {
    const wrapper = mount(RadioButtonGroup, {
      props: {
        modelValue: 'List',
        options: ['List', 'Grid'],
        'onUpdate:modelValue': (value: any) => wrapper.setProps({ modelValue: value }),
      },
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.findAll('button').map((b) => b.attributes('aria-checked'))).toEqual(['false', 'true'])
  })

  it('marks a single option as disabled via the option-disabled extractor', () => {
    const wrapper = mount(RadioButtonGroup, {
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

    const buttons = wrapper.findAll('button')

    expect(buttons[0].classes()).not.toContain('vuiii-button--disabled')
    expect(buttons[1].classes()).toContain('vuiii-button--disabled')
  })

  it('marks a single option as disabled via an option-disabled function extractor', () => {
    const wrapper = mount(RadioButtonGroup, {
      props: {
        options: [
          { id: 'a', name: 'A', status: 'active' },
          { id: 'b', name: 'B', status: 'inactive' },
        ],
        optionValue: 'id',
        optionLabel: 'name',
        optionDisabled: (item: any) => item.status === 'inactive',
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons[0].classes()).not.toContain('vuiii-button--disabled')
    expect(buttons[1].classes()).toContain('vuiii-button--disabled')
  })

  it('marks every option as disabled when the group is disabled', () => {
    const wrapper = mount(RadioButtonGroup, { props: { options: ['List', 'Grid'], disabled: true } })

    const buttons = wrapper.findAll('button')

    expect(buttons.every((b) => b.classes().includes('vuiii-button--disabled'))).toBe(true)
  })

  // BUG: Button never forwards its `disabled` prop to the rendered <button>, so a disabled
  // option is only styled as disabled and still reacts to clicks.
  it.skip('ignores clicks on a disabled option', async () => {
    const wrapper = mount(RadioButtonGroup, { props: { options: ['List', 'Grid'], disabled: true } })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('renders the checked option filled and the others outlined by default', () => {
    const wrapper = mount(RadioButtonGroup, { props: { modelValue: 'Grid', options: ['List', 'Grid'] } })

    const buttons = wrapper.findAll('button')

    expect(buttons[0].classes()).toContain('vuiii-button--variant-outlined')
    expect(buttons[1].classes()).toContain('vuiii-button--variant-filled')
    expect(buttons[1].classes()).toContain('vuiii-button--color-accent')
  })

  it('renders the checked option outlined when variant="outlined"', () => {
    const wrapper = mount(RadioButtonGroup, {
      props: { modelValue: 'Grid', options: ['List', 'Grid'], variant: 'outlined' },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons[1].classes()).toContain('vuiii-button--variant-outlined')
    expect(buttons[1].classes()).toContain('vuiii-button--color-accent')
  })

  it('passes the size down to every option button', () => {
    const wrapper = mount(RadioButtonGroup, { props: { options: ['List', 'Grid'], size: 'small' } })

    const buttons = wrapper.findAll('button')

    expect(buttons.every((b) => b.classes().includes('vuiii-button--size-small'))).toBe(true)
  })

  it('renders nothing but the container for an empty options array', () => {
    const wrapper = mount(RadioButtonGroup, { props: { options: [] } })

    expect(wrapper.findAll('button')).toHaveLength(0)
  })
})
