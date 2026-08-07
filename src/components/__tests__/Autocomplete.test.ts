import { enableAutoUnmount, mount, type VueWrapper } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import Autocomplete from '@/components/Autocomplete.vue'

enableAutoUnmount(afterEach)

// jsdom does not implement scrollIntoView, which the dropdown cursor watcher calls. Patching a
// DOM prototype is global state, so install it for this file only and put it back afterwards.
const originalScrollIntoView = Element.prototype.scrollIntoView

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterAll(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView
})

const fruits = ['Apple', 'Banana', 'Blueberry', 'Cherry']

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
]

function mountAutocomplete(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
  return mount(Autocomplete, {
    props: { options: fruits, ...props },
    attachTo: document.body,
    ...options,
  })
}

function input(wrapper: VueWrapper<any>) {
  return wrapper.find('input')
}

function options(wrapper: VueWrapper<any>) {
  return wrapper.findAll('[role="option"]')
}

function optionLabels(wrapper: VueWrapper<any>) {
  return options(wrapper).map((option) => option.text())
}

function isExpanded(wrapper: VueWrapper<any>) {
  return input(wrapper).attributes('aria-expanded') === 'true'
}

async function openByClick(wrapper: VueWrapper<any>) {
  await input(wrapper).trigger('click')
}

async function type(wrapper: VueWrapper<any>, value: string) {
  await input(wrapper).setValue(value)
}

async function pressKey(wrapper: VueWrapper<any>, key: string) {
  await input(wrapper).trigger('keydown', { key })
}

describe('Autocomplete', () => {
  describe('opening and closing', () => {
    it('renders a collapsed combobox with no options before any interaction', () => {
      const wrapper = mountAutocomplete()

      expect(input(wrapper).attributes('role')).toBe('combobox')
      expect(isExpanded(wrapper)).toBe(false)
      expect(options(wrapper)).toHaveLength(0)
    })

    it('opens the option list when the input is clicked', async () => {
      const wrapper = mountAutocomplete()

      await openByClick(wrapper)

      expect(isExpanded(wrapper)).toBe(true)
      expect(optionLabels(wrapper)).toEqual(['Apple', 'Banana', 'Blueberry', 'Cherry'])
    })

    it('opens the option list as soon as the user types', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'B')

      expect(isExpanded(wrapper)).toBe(true)
    })

    it('keeps the option list open when the input is clicked again', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)

      await openByClick(wrapper)

      expect(isExpanded(wrapper)).toBe(true)
    })

    it('stays closed when clicked while disabled', async () => {
      const wrapper = mountAutocomplete({ disabled: true })

      await openByClick(wrapper)

      expect(input(wrapper).attributes('disabled')).toBeDefined()
      expect(isExpanded(wrapper)).toBe(false)
    })

    it('closes the option list on Escape', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)

      await pressKey(wrapper, 'Escape')

      expect(isExpanded(wrapper)).toBe(false)
    })

    it('closes the option list on Tab', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)

      await pressKey(wrapper, 'Tab')

      expect(isExpanded(wrapper)).toBe(false)
    })
  })

  describe('filtering', () => {
    it('narrows the list down to the options matching the typed query', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'B')

      expect(optionLabels(wrapper)).toEqual(['Banana', 'Blueberry'])
    })

    it('matches anywhere in the label, ignoring case', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'ERRY')

      expect(optionLabels(wrapper)).toEqual(['Blueberry', 'Cherry'])
    })

    it('matches the option description as well as the label', async () => {
      const wrapper = mountAutocomplete({
        options: users,
        optionLabel: 'name',
        optionDescription: 'email',
      })

      await type(wrapper, 'jane@')

      expect(optionLabels(wrapper)).toHaveLength(1)
      expect(optionLabels(wrapper)[0]).toContain('Jane Smith')
    })

    it('renders no option list when nothing matches the query', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'zzz')

      expect(isExpanded(wrapper)).toBe(true)
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('shows every option again once the query is cleared', async () => {
      const wrapper = mountAutocomplete()
      await type(wrapper, 'Banana')

      await type(wrapper, '')

      expect(optionLabels(wrapper)).toEqual(['Apple', 'Banana', 'Blueberry', 'Cherry'])
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    })

    it('emits update:modelValue with every keystroke', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'Ban')

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Ban'])
    })

    it('uses the custom filter function instead of the default one', async () => {
      const wrapper = mountAutocomplete({
        filter: (option: { label: string }, query: string) => option.label.startsWith(query),
      })

      await type(wrapper, 'B')

      expect(optionLabels(wrapper)).toEqual(['Banana', 'Blueberry'])

      await type(wrapper, 'erry')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('passes the normalized option and the current query to the custom filter', async () => {
      const filter = vi.fn(() => true)
      const wrapper = mountAutocomplete({ options: ['Apple'], filter })

      await type(wrapper, 'Ap')

      expect(filter).toHaveBeenCalledWith(expect.objectContaining({ value: 'Apple', label: 'Apple' }), 'Ap')
    })
  })

  describe('option formats', () => {
    it('renders a string array as options', async () => {
      const wrapper = mountAutocomplete({ options: ['Red', 'Green', 'Blue'] })

      await openByClick(wrapper)

      expect(optionLabels(wrapper)).toEqual(['Red', 'Green', 'Blue'])
    })

    it('renders an object array using the option-label/option-description extractors', async () => {
      const wrapper = mountAutocomplete({
        options: users,
        optionValue: 'id',
        optionLabel: 'name',
        optionDescription: 'email',
      })

      await openByClick(wrapper)

      expect(optionLabels(wrapper)[0]).toContain('John Doe')
      expect(optionLabels(wrapper)[0]).toContain('john@example.com')
    })

    it('accepts functions as extractors', async () => {
      const wrapper = mountAutocomplete({
        options: users,
        optionValue: (user: (typeof users)[number]) => user.id,
        optionLabel: (user: (typeof users)[number]) => user.name.toUpperCase(),
      })

      await openByClick(wrapper)

      expect(optionLabels(wrapper)).toEqual(['JOHN DOE', 'JANE SMITH'])
    })

    it('renders a key-value object as options', async () => {
      const wrapper = mountAutocomplete({
        options: {
          draft: 'Draft',
          published: 'Published',
          archived: 'Archived',
        },
      })

      await openByClick(wrapper)

      expect(optionLabels(wrapper)).toEqual(['Draft', 'Published', 'Archived'])
    })

    it('flattens grouped options into a single list', async () => {
      const wrapper = mountAutocomplete({
        options: [
          { category: 'Fruits', items: [{ id: 1, name: 'Apple' }] },
          { category: 'Vegetables', items: [{ id: 2, name: 'Carrot' }] },
        ],
        groupLabel: 'category',
        groupOptions: 'items',
        optionValue: 'id',
        optionLabel: 'name',
      })

      await openByClick(wrapper)

      expect(optionLabels(wrapper)).toEqual(['Apple', 'Carrot'])
    })

    it('filters across all groups', async () => {
      const wrapper = mountAutocomplete({
        options: [
          { category: 'Fruits', items: [{ id: 1, name: 'Apple' }] },
          { category: 'Vegetables', items: [{ id: 2, name: 'Carrot' }] },
        ],
        groupLabel: 'category',
        groupOptions: 'items',
        optionValue: 'id',
        optionLabel: 'name',
      })

      await type(wrapper, 'carr')

      expect(optionLabels(wrapper)).toEqual(['Carrot'])
    })
  })

  describe('keyboard navigation', () => {
    it('opens the list on ArrowDown without moving the cursor past the first option', async () => {
      const wrapper = mountAutocomplete()

      await pressKey(wrapper, 'ArrowDown')

      expect(isExpanded(wrapper)).toBe(true)
      expect(options(wrapper)[0]!.attributes('aria-selected')).toBe('true')
    })

    it('moves the cursor to the next option on ArrowDown', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)

      await pressKey(wrapper, 'ArrowDown')

      expect(options(wrapper).map((o) => o.attributes('aria-selected'))).toEqual(['false', 'true', 'false', 'false'])
    })

    it('moves the cursor back to the previous option on ArrowUp', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)
      await pressKey(wrapper, 'ArrowDown')
      await pressKey(wrapper, 'ArrowDown')

      await pressKey(wrapper, 'ArrowUp')

      expect(options(wrapper)[1]!.attributes('aria-selected')).toBe('true')
    })

    it('keeps the cursor on the last option when ArrowDown is pressed at the end', async () => {
      const wrapper = mountAutocomplete({ options: ['Apple', 'Banana'] })
      await openByClick(wrapper)

      await pressKey(wrapper, 'ArrowDown')
      await pressKey(wrapper, 'ArrowDown')

      expect(options(wrapper)[1]!.attributes('aria-selected')).toBe('true')
    })

    it('keeps the cursor on the first option when ArrowUp is pressed at the start', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)

      await pressKey(wrapper, 'ArrowUp')

      expect(options(wrapper)[0]!.attributes('aria-selected')).toBe('true')
    })

    it('ignores ArrowUp while the list is closed', async () => {
      const wrapper = mountAutocomplete()

      await pressKey(wrapper, 'ArrowUp')

      expect(isExpanded(wrapper)).toBe(false)
    })

    it('selects the highlighted option on Enter', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)
      await pressKey(wrapper, 'ArrowDown')

      await pressKey(wrapper, 'Enter')

      expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
        label: 'Banana',
      })
      expect(input(wrapper).element.value).toBe('Banana')
      expect(isExpanded(wrapper)).toBe(false)
    })

    it('does nothing on Enter while the list is closed', async () => {
      const wrapper = mountAutocomplete()

      await pressKey(wrapper, 'Enter')

      expect(wrapper.emitted('select')).toBeFalsy()
    })

    it('resets the cursor to the first option when the filtered list changes', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)
      await pressKey(wrapper, 'ArrowDown')

      await type(wrapper, 'B')

      expect(options(wrapper)[0]!.attributes('aria-selected')).toBe('true')
    })

    it('exposes the highlighted option through aria-activedescendant', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)

      await pressKey(wrapper, 'ArrowDown')

      expect(input(wrapper).attributes('aria-activedescendant')).toBe(options(wrapper)[1]!.attributes('id'))
    })

    it('points aria-controls at the rendered listbox', async () => {
      const wrapper = mountAutocomplete()

      await openByClick(wrapper)

      expect(input(wrapper).attributes('aria-controls')).toBe(wrapper.find('[role="listbox"]').attributes('id'))
    })
  })

  describe('selecting', () => {
    it('fills the input with the option label and closes the list when an option is clicked', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)

      await options(wrapper)[2]!.find('button').trigger('click')

      expect(input(wrapper).element.value).toBe('Blueberry')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Blueberry'])
      expect(isExpanded(wrapper)).toBe(false)
    })

    it('emits select with the normalized option, including the source data', async () => {
      const wrapper = mountAutocomplete({
        options: users,
        optionValue: 'id',
        optionLabel: 'name',
        optionDescription: 'email',
      })
      await openByClick(wrapper)

      await options(wrapper)[1]!.find('button').trigger('click')

      expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
        value: '2',
        label: 'Jane Smith',
        description: 'jane@example.com',
        data: users[1],
      })
    })

    it('emits select with value and label equal to the item for a string array', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)

      await options(wrapper)[0]!.find('button').trigger('click')

      expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
        value: 'Apple',
        label: 'Apple',
        data: 'Apple',
      })
    })

    it('returns focus to the input after an option is picked with the mouse', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)

      await options(wrapper)[0]!.find('button').trigger('click')
      await wrapper.vm.$nextTick()

      expect(document.activeElement).toBe(input(wrapper).element)
    })

    it('does not select a disabled option', async () => {
      const wrapper = mountAutocomplete({
        options: [
          { name: 'Active', inactive: false },
          { name: 'Archived', inactive: true },
        ],
        optionLabel: 'name',
        optionDisabled: 'inactive',
      })
      await openByClick(wrapper)

      await options(wrapper)[1]!.find('button').trigger('click')

      expect(wrapper.emitted('select')).toBeFalsy()
      expect(isExpanded(wrapper)).toBe(true)
    })

    it('moves the cursor to the option the pointer enters', async () => {
      const wrapper = mountAutocomplete()
      await openByClick(wrapper)

      await options(wrapper)[2]!.find('button').trigger('mouseenter')

      expect(options(wrapper)[2]!.attributes('aria-selected')).toBe('true')
    })

    it('marks the option matching the current input value as selected', async () => {
      const wrapper = mountAutocomplete({ modelValue: 'Cherry' })
      await openByClick(wrapper)

      await options(wrapper)[0]!.find('button').trigger('click')

      expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
        label: 'Cherry',
        isSelected: true,
      })
    })
  })

  describe('slots and icons', () => {
    it('renders options through the option slot', async () => {
      const wrapper = mountAutocomplete(
        {},
        {
          slots: {
            option: '<span class="custom">{{ params.option.label }}/{{ params.isHighlighted }}</span>',
          },
        },
      )

      await openByClick(wrapper)

      expect(wrapper.findAll('.custom').map((e) => e.text())).toEqual([
        'Apple/true',
        'Banana/false',
        'Blueberry/false',
        'Cherry/false',
      ])
    })

    it('renders the prefix and suffix slots', () => {
      const wrapper = mountAutocomplete({}, { slots: { prefix: '<i>pre</i>', suffix: '<i>post</i>' } })

      expect(wrapper.text()).toContain('pre')
      expect(wrapper.text()).toContain('post')
    })

    it('emits suffix-icon-click when the suffix icon is clicked', async () => {
      const wrapper = mountAutocomplete({ suffixIcon: 'x' })

      await wrapper.find('.vuiii-input__suffix-icon').trigger('click')

      expect(wrapper.emitted('suffix-icon-click')).toHaveLength(1)
    })

    it('emits prefix-icon-click when the prefix icon is clicked', async () => {
      const wrapper = mountAutocomplete({ prefixIcon: 'search' })

      await wrapper.find('.vuiii-input__prefix-icon').trigger('click')

      expect(wrapper.emitted('prefix-icon-click')).toHaveLength(1)
    })
  })

  describe('exposed ref', () => {
    it('opens and closes the option list programmatically', async () => {
      const wrapper = mountAutocomplete()

      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      expect(isExpanded(wrapper)).toBe(true)

      wrapper.vm.close()
      await wrapper.vm.$nextTick()

      expect(isExpanded(wrapper)).toBe(false)
    })

    it('does not open programmatically while disabled', async () => {
      const wrapper = mountAutocomplete({ disabled: true })

      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      expect(isExpanded(wrapper)).toBe(false)
    })

    it('focuses and blurs the input element', () => {
      const wrapper = mountAutocomplete()

      wrapper.vm.focus()

      expect(document.activeElement).toBe(input(wrapper).element)

      wrapper.vm.blur()

      expect(document.activeElement).not.toBe(input(wrapper).element)
    })

    it('exposes the underlying input element', () => {
      const wrapper = mountAutocomplete()

      expect(wrapper.vm.inputElement).toBe(input(wrapper).element)
    })
  })

  describe('input wrapper integration', () => {
    it('forwards the invalid state to the input wrapper', () => {
      const wrapper = mountAutocomplete({ invalid: true })

      expect(wrapper.find('.vuiii-input--invalid').exists()).toBe(true)
    })

    it('passes the placeholder and extra attributes down to the input', () => {
      const wrapper = mountAutocomplete({ placeholder: 'Search fruits...' }, { attrs: { name: 'fruit' } })

      expect(input(wrapper).attributes('placeholder')).toBe('Search fruits...')
      expect(input(wrapper).attributes('name')).toBe('fruit')
    })
  })
})
