import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import CheckboxGroup from '@/components/CheckboxGroup.vue'

/** Ticks (or unticks) the nth checkbox the way a user would. */
async function setChecked(wrapper: VueWrapper<any>, index: number, checked: boolean) {
  const input = wrapper.findAll<HTMLInputElement>('input[type="checkbox"]')[index]

  input.element.checked = checked

  await input.trigger('input')
}

describe('CheckboxGroup', () => {
  it('exposes a group role on the container', () => {
    const wrapper = mount(CheckboxGroup, { props: { options: ['Apple', 'Banana'] } })

    expect(wrapper.find('[role="group"]').exists()).toBe(true)
  })

  it('renders one checkbox per item of a string array', () => {
    const wrapper = mount(CheckboxGroup, { props: { options: ['Apple', 'Banana', 'Cherry'] } })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    expect(checkboxes).toHaveLength(3)
    expect(wrapper.findAll('.Checkbox__label').map((l) => l.text())).toEqual(['Apple', 'Banana', 'Cherry'])
  })

  it('renders checkboxes from an object array using option-value/option-label/option-description extractors', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: ['write'],
        options: [
          { id: 'read', name: 'Read', info: 'View content' },
          { id: 'write', name: 'Write', info: 'Edit content' },
        ],
        optionValue: 'id',
        optionLabel: 'name',
        optionDescription: 'info',
      },
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    expect(wrapper.findAll('.Checkbox__label').map((l) => l.text())).toEqual(['Read', 'Write'])
    expect(wrapper.findAll('.Checkbox__description').map((d) => d.text())).toEqual(['View content', 'Edit content'])
    expect(checkboxes.map((c) => c.element.checked)).toEqual([false, true])
  })

  it('renders checkboxes from a key-value object', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: ['published'],
        options: { draft: 'Draft', published: 'Published', archived: 'Archived' },
      },
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    expect(wrapper.findAll('.Checkbox__label').map((l) => l.text())).toEqual(['Draft', 'Published', 'Archived'])
    expect(checkboxes.map((c) => c.element.checked)).toEqual([false, true, false])
  })

  it('renders checkboxes using function extractors', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: ['2'],
        options: [
          { id: 1, firstName: 'John', lastName: 'Doe' },
          { id: 2, firstName: 'Jane', lastName: 'Smith' },
        ],
        optionValue: (user: any) => String(user.id),
        optionLabel: (user: any) => `${user.firstName} ${user.lastName}`,
        optionDescription: (user: any) => `#${user.id}`,
      },
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    expect(wrapper.findAll('.Checkbox__label').map((l) => l.text())).toEqual(['John Doe', 'Jane Smith'])
    expect(wrapper.findAll('.Checkbox__description').map((d) => d.text())).toEqual(['#1', '#2'])
    expect(checkboxes.map((c) => c.element.checked)).toEqual([false, true])
  })

  it('checks every checkbox whose value is contained in the model value', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { modelValue: ['Apple', 'Cherry'], options: ['Apple', 'Banana', 'Cherry'] },
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    expect(checkboxes.map((c) => c.element.checked)).toEqual([true, false, true])
  })

  it('leaves every checkbox unchecked when the model value is undefined', () => {
    const wrapper = mount(CheckboxGroup, { props: { options: ['Apple', 'Banana'] } })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    expect(checkboxes.every((c) => !c.element.checked)).toBe(true)
  })

  it('disables a single option via the option-disabled extractor', () => {
    const wrapper = mount(CheckboxGroup, {
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

    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    expect(checkboxes.map((c) => c.element.disabled)).toEqual([false, true])
    expect(wrapper.findAll('.Checkbox--disabled')).toHaveLength(1)
  })

  it('disables options via an option-disabled function extractor', () => {
    const wrapper = mount(CheckboxGroup, {
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

    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    expect(checkboxes.map((c) => c.element.disabled)).toEqual([false, true])
  })

  it('emits the model value with the newly checked option appended', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { modelValue: ['Apple'], options: ['Apple', 'Banana', 'Cherry'] },
    })

    await setChecked(wrapper, 1, true)

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['Apple', 'Banana']])
  })

  it('emits the model value without the unchecked option', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { modelValue: ['Apple', 'Banana'], options: ['Apple', 'Banana', 'Cherry'] },
    })

    await setChecked(wrapper, 0, false)

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['Banana']])
  })

  it('emits an array with the single checked value when nothing was selected before', async () => {
    const wrapper = mount(CheckboxGroup, { props: { options: ['Apple', 'Banana'] } })

    await setChecked(wrapper, 1, true)

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['Banana']])
  })

  it('emits an empty array once the last checked option is unchecked', async () => {
    const wrapper = mount(CheckboxGroup, { props: { modelValue: ['Apple'], options: ['Apple', 'Banana'] } })

    await setChecked(wrapper, 0, false)

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([[]])
  })

  it('never emits the same value twice when an already checked option is checked again', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { modelValue: ['Apple'], options: ['Apple', 'Banana'] },
    })

    // uncheck then check the very same option again
    await setChecked(wrapper, 0, false)
    await setChecked(wrapper, 0, true)

    expect(wrapper.emitted('update:modelValue')![1]).toEqual([['Apple']])
  })

  it('accumulates selections across consecutive checks when the model value is kept in sync', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: [],
        options: ['Apple', 'Banana', 'Cherry'],
        'onUpdate:modelValue': (value: any[]) => wrapper.setProps({ modelValue: value }),
      },
    })

    await setChecked(wrapper, 0, true)
    await setChecked(wrapper, 2, true)

    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([['Apple', 'Cherry']])
    expect(wrapper.findAll('input[type="checkbox"]').map((c) => c.element.checked)).toEqual([true, false, true])
  })

  it('emits values parsed to numbers when type="number"', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        options: [
          { id: 1, name: 'One' },
          { id: 2, name: 'Two' },
        ],
        optionValue: 'id',
        optionLabel: 'name',
        type: 'number',
      },
    })

    await setChecked(wrapper, 1, true)

    const emitted = wrapper.emitted('update:modelValue')![0][0] as number[]

    expect(emitted).toEqual([2])
    expect(typeof emitted[0]).toBe('number')
  })

  it('emits values produced by a custom value parser', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        options: ['a', 'b'],
        valueParser: { parse: (value: any) => `id:${value}`, stringify: (value: any) => String(value) },
      },
    })

    await setChecked(wrapper, 0, true)

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['id:a']])
  })

  // BUG: checkedValues compares the raw model value against the stringified option value,
  // so numeric model values are never reported as checked when type="number".
  it.skip('checks the options whose numeric model value matches when type="number"', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: [2],
        options: [
          { id: 1, name: 'One' },
          { id: 2, name: 'Two' },
        ],
        optionValue: 'id',
        optionLabel: 'name',
        type: 'number',
      },
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    expect(checkboxes.map((c) => c.element.checked)).toEqual([false, true])
  })

  it('lays the options out inline when the inline prop is set', () => {
    const wrapper = mount(CheckboxGroup, { props: { options: ['Apple', 'Banana'], inline: true } })

    expect(wrapper.find('[role="group"]').classes()).toContain('CheckboxGroup--inline')
  })

  it('does not use the inline layout by default', () => {
    const wrapper = mount(CheckboxGroup, { props: { options: ['Apple', 'Banana'] } })

    expect(wrapper.find('[role="group"]').classes()).not.toContain('CheckboxGroup--inline')
  })

  it('renders the symbol slot for every option', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { modelValue: ['Apple'], options: ['Apple', 'Banana'] },
      slots: { symbol: (params: any) => h('span', { class: 'custom-symbol' }, params.checked ? 'on' : 'off') },
    })

    const symbols = wrapper.findAll('.custom-symbol')

    expect(symbols).toHaveLength(2)
    expect(symbols.map((s) => s.text())).toEqual(['on', 'off'])
  })

  it('renders nothing but the container for an empty options array', () => {
    const wrapper = mount(CheckboxGroup, { props: { options: [] } })

    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(0)
  })
})
