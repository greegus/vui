import { mount } from '@vue/test-utils'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import DropdownMenu from '@/components/DropdownMenu.vue'

const items = ['Edit', 'Duplicate', 'Delete']

// jsdom does not implement scrollIntoView, which the cursor watcher calls. Patching a DOM
// prototype is global state, so install it for this file only and put it back afterwards.
const scrollIntoView = vi.fn()
const originalScrollIntoView = Element.prototype.scrollIntoView

beforeAll(() => {
  Element.prototype.scrollIntoView = scrollIntoView
})

afterAll(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView
})

beforeEach(() => {
  scrollIntoView.mockClear()
})

describe('DropdownMenu', () => {
  it('renders one list item per entry with the item as its label', () => {
    const wrapper = mount(DropdownMenu, { props: { items } })

    const renderedItems = wrapper.findAll('li')

    expect(renderedItems).toHaveLength(3)
    expect(renderedItems.map((item) => item.text())).toEqual(['Edit', 'Duplicate', 'Delete'])
  })

  it('renders no list at all when no items are given', () => {
    const wrapper = mount(DropdownMenu)

    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('renders no list when the items array is empty', () => {
    const wrapper = mount(DropdownMenu, { props: { items: [] } })

    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('emits item-click with the clicked item and its index', async () => {
    const wrapper = mount(DropdownMenu, { props: { items } })

    await wrapper.findAll('button')[2]!.trigger('click')

    expect(wrapper.emitted('item-click')).toHaveLength(1)
    expect(wrapper.emitted('item-click')![0]).toEqual([{ item: 'Delete', index: 2 }])
  })

  it('emits item-click with the original object when items are objects', async () => {
    const objectItems = [
      { id: 1, label: 'One' },
      { id: 2, label: 'Two' },
    ]

    const wrapper = mount(DropdownMenu, {
      props: { items: objectItems },
      slots: { itemLabel: (props: { item: { label: string } }) => props.item.label },
    })

    await wrapper.findAll('button')[1]!.trigger('click')

    expect(wrapper.emitted('item-click')![0]).toEqual([{ item: objectItems[1], index: 1 }])
  })

  it('emits item-mouseenter and item-mouseleave with the item and index', async () => {
    const wrapper = mount(DropdownMenu, { props: { items } })

    await wrapper.findAll('button')[1]!.trigger('mouseenter')
    await wrapper.findAll('button')[1]!.trigger('mouseleave')

    expect(wrapper.emitted('item-mouseenter')![0]).toEqual([{ item: 'Duplicate', index: 1 }])
    expect(wrapper.emitted('item-mouseleave')![0]).toEqual([{ item: 'Duplicate', index: 1 }])
  })

  it('marks the item at cursorIndex with the cursor modifier', () => {
    const wrapper = mount(DropdownMenu, { props: { items, cursorIndex: 1 } })

    const renderedItems = wrapper.findAll('li')

    expect(renderedItems[0]!.classes()).not.toContain('DropdownMenu__item--withCursor')
    expect(renderedItems[1]!.classes()).toContain('DropdownMenu__item--withCursor')
  })

  it('moves the cursor modifier when cursorIndex changes', async () => {
    const wrapper = mount(DropdownMenu, { props: { items, cursorIndex: 0 } })

    await wrapper.setProps({ cursorIndex: 2 })

    expect(wrapper.findAll('li')[0]!.classes()).not.toContain('DropdownMenu__item--withCursor')
    expect(wrapper.findAll('li')[2]!.classes()).toContain('DropdownMenu__item--withCursor')
  })

  it('scrolls the newly cursored item into view', async () => {
    const wrapper = mount(DropdownMenu, { props: { items, cursorIndex: 0 } })

    await wrapper.setProps({ cursorIndex: 2 })

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(scrollIntoView.mock.instances[0]).toBe(wrapper.findAll('li')[2]!.element)
  })

  it('does not scroll anything into view while cursorIndex is negative', async () => {
    const wrapper = mount(DropdownMenu, { props: { items, cursorIndex: 0 } })

    await wrapper.setProps({ cursorIndex: -1 })

    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('sets no aria roles when listRole is not given', () => {
    const wrapper = mount(DropdownMenu, { props: { items } })

    expect(wrapper.find('ul').attributes('role')).toBeUndefined()
    expect(wrapper.find('li').attributes('role')).toBeUndefined()
    expect(wrapper.find('li').attributes('aria-selected')).toBeUndefined()
  })

  it('renders a listbox of options when listRole is "listbox"', () => {
    const wrapper = mount(DropdownMenu, { props: { items, listRole: 'listbox' } })

    expect(wrapper.find('ul').attributes('role')).toBe('listbox')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3)
  })

  it('marks only the cursored option as aria-selected in a listbox', () => {
    const wrapper = mount(DropdownMenu, { props: { items, listRole: 'listbox', cursorIndex: 1 } })

    expect(wrapper.findAll('li').map((item) => item.attributes('aria-selected'))).toEqual(['false', 'true', 'false'])
  })

  it('renders a menu of menuitems without aria-selected when listRole is "menu"', () => {
    const wrapper = mount(DropdownMenu, { props: { items, listRole: 'menu', cursorIndex: 0 } })

    expect(wrapper.find('ul').attributes('role')).toBe('menu')
    expect(wrapper.findAll('[role="menuitem"]')).toHaveLength(3)
    expect(wrapper.find('li').attributes('aria-selected')).toBeUndefined()
  })

  it('applies listId to the list element', () => {
    const wrapper = mount(DropdownMenu, { props: { items, listId: 'my-list' } })

    expect(wrapper.find('ul').attributes('id')).toBe('my-list')
  })

  it('derives per-item ids from optionIdPrefix', () => {
    const wrapper = mount(DropdownMenu, { props: { items, optionIdPrefix: 'opt' } })

    expect(wrapper.findAll('li').map((item) => item.attributes('id'))).toEqual(['opt-0', 'opt-1', 'opt-2'])
  })

  it('leaves item ids unset without an optionIdPrefix', () => {
    const wrapper = mount(DropdownMenu, { props: { items } })

    expect(wrapper.find('li').attributes('id')).toBeUndefined()
  })

  it('renders custom item content through the item slot', () => {
    const wrapper = mount(DropdownMenu, {
      props: { items },
      slots: {
        item: (props: { item: string; index: number }) =>
          h('span', { class: 'custom-item' }, `${props.index}:${props.item}`),
      },
    })

    expect(wrapper.findAll('.custom-item').map((item) => item.text())).toEqual(['0:Edit', '1:Duplicate', '2:Delete'])
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('keeps the clickable button when only the itemLabel slot is overridden', async () => {
    const wrapper = mount(DropdownMenu, {
      props: { items },
      slots: { itemLabel: (props: { item: string }) => `> ${props.item}` },
    })

    await wrapper.findAll('button')[0]!.trigger('click')

    expect(wrapper.find('button').text()).toBe('> Edit')
    expect(wrapper.emitted('item-click')![0]).toEqual([{ item: 'Edit', index: 0 }])
  })

  it('passes cursorIndex to the item slot', () => {
    const wrapper = mount(DropdownMenu, {
      props: { items, cursorIndex: 2 },
      slots: {
        item: (props: { item: string; index: number; cursorIndex?: number }) =>
          h('span', { class: 'custom-item' }, props.index === props.cursorIndex ? 'active' : 'idle'),
      },
    })

    expect(wrapper.findAll('.custom-item').map((item) => item.text())).toEqual(['idle', 'idle', 'active'])
  })

  it('re-renders the list when the items change', async () => {
    const wrapper = mount(DropdownMenu, { props: { items } })

    await wrapper.setProps({ items: ['Only one'] })

    expect(wrapper.findAll('li').map((item) => item.text())).toEqual(['Only one'])

    await wrapper.setProps({ items: [] })

    expect(wrapper.find('ul').exists()).toBe(false)
  })

  describe('disabled items', () => {
    const itemDisabled = (item: string) => item === 'Duplicate'

    it('renders an item flagged by itemDisabled as a natively disabled button', () => {
      const wrapper = mount(DropdownMenu, { props: { items, itemDisabled } })

      const buttons = wrapper.findAll('button')

      expect(buttons.map((button) => button.attributes('disabled') !== undefined)).toEqual([false, true, false])
    })

    it('marks a disabled item with aria-disabled', () => {
      const wrapper = mount(DropdownMenu, { props: { items, itemDisabled } })

      expect(wrapper.findAll('li').map((item) => item.attributes('aria-disabled'))).toEqual([
        undefined,
        'true',
        undefined,
      ])
    })

    it('emits no item-click for a disabled item', async () => {
      const wrapper = mount(DropdownMenu, { props: { items, itemDisabled } })

      await wrapper.findAll('button')[1]!.trigger('click')

      expect(wrapper.emitted('item-click')).toBeFalsy()
    })

    it('still emits item-click for the enabled items around it', async () => {
      const wrapper = mount(DropdownMenu, { props: { items, itemDisabled } })

      await wrapper.findAll('button')[0]!.trigger('click')

      expect(wrapper.emitted('item-click')![0]![0]).toMatchObject({ index: 0 })
    })

    it('leaves every item enabled when no itemDisabled is given', () => {
      const wrapper = mount(DropdownMenu, { props: { items } })

      expect(wrapper.findAll('button').every((button) => button.attributes('disabled') === undefined)).toBe(true)
    })
  })
})
