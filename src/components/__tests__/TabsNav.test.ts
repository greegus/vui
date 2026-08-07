import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TabsNav from '@/components/TabsNav.vue'
import type { Tab } from '@/types'

const IconStub = {
  props: ['name'],
  template: '<i class="icon-stub" :data-name="name" />',
}

const tabs: Tab[] = [
  { key: 'a', label: 'Tab A' },
  { key: 'b', label: 'Tab B', icon: 'check' },
  { key: 'c', label: 'Tab C', disabled: true },
]

function mountTabsNav(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(TabsNav, {
    props: { tabs, ...props },
    slots,
    global: { stubs: { Icon: IconStub } },
  })
}

describe('TabsNav', () => {
  it('renders a tab button per tab inside a tablist', () => {
    const wrapper = mountTabsNav()

    const buttons = wrapper.findAll('[role="tab"]')

    expect(wrapper.attributes('role')).toBe('tablist')
    expect(buttons).toHaveLength(3)
    expect(buttons.map((button) => button.text())).toEqual(['Tab A', 'Tab B', 'Tab C'])
  })

  it('renders the icon of a tab that has one', () => {
    const wrapper = mountTabsNav()

    const icons = wrapper.findAll('.icon-stub')

    expect(icons).toHaveLength(1)
    expect(icons[0]!.attributes('data-name')).toBe('check')
  })

  it('marks the tab matching the model value as selected', () => {
    const wrapper = mountTabsNav({ modelValue: 'b' })

    const buttons = wrapper.findAll('[role="tab"]')

    expect(buttons.map((button) => button.attributes('aria-selected'))).toEqual(['false', 'true', 'false'])
    expect(buttons[1]!.classes()).toContain('TabsNav__tab--active')
  })

  it('selects no tab when the model value is undefined', () => {
    const wrapper = mountTabsNav()

    expect(wrapper.findAll('[aria-selected="true"]')).toHaveLength(0)
  })

  it('emits the clicked tab key', async () => {
    const wrapper = mountTabsNav()

    await wrapper.findAll('[role="tab"]')[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('does not emit when a disabled tab is clicked', async () => {
    const wrapper = mountTabsNav()

    const disabledTab = wrapper.findAll('[role="tab"]')[2]!
    await disabledTab.trigger('click')

    expect(disabledTab.attributes('disabled')).toBeDefined()
    expect(disabledTab.classes()).toContain('TabsNav__tab--disabled')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('links every tab to its panel via aria-controls', () => {
    const wrapper = mountTabsNav({ idBase: 'demo' })

    const buttons = wrapper.findAll('[role="tab"]')

    expect(buttons.map((button) => button.attributes('id'))).toEqual(['demo-tab-a', 'demo-tab-b', 'demo-tab-c'])
    expect(buttons.map((button) => button.attributes('aria-controls'))).toEqual([
      'demo-panel-a',
      'demo-panel-b',
      'demo-panel-c',
    ])
  })

  it('generates an id base when none is given', () => {
    const wrapper = mountTabsNav()

    const id = wrapper.findAll('[role="tab"]')[0]!.attributes('id')

    expect(id).toMatch(/-tab-a$/)
  })

  it('makes the first enabled tab keyboard-reachable when nothing is selected', () => {
    const wrapper = mountTabsNav()

    expect(wrapper.findAll('[role="tab"]').map((button) => button.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
  })

  it('moves the roving tabindex onto the selected tab', () => {
    const wrapper = mountTabsNav({ modelValue: 'b' })

    expect(wrapper.findAll('[role="tab"]').map((button) => button.attributes('tabindex'))).toEqual(['-1', '0', '-1'])
  })

  it('selects the next tab on ArrowRight', async () => {
    const wrapper = mountTabsNav({ modelValue: 'a' })

    await wrapper.findAll('[role="tab"]')[0]!.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('skips disabled tabs and wraps around on ArrowRight', async () => {
    const wrapper = mountTabsNav({ modelValue: 'b' })

    await wrapper.findAll('[role="tab"]')[1]!.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('selects the previous tab on ArrowLeft', async () => {
    const wrapper = mountTabsNav({ modelValue: 'b' })

    await wrapper.findAll('[role="tab"]')[1]!.trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('treats ArrowDown like ArrowRight', async () => {
    const wrapper = mountTabsNav({ modelValue: 'a' })

    await wrapper.findAll('[role="tab"]')[0]!.trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('treats ArrowUp like ArrowLeft', async () => {
    const wrapper = mountTabsNav({ modelValue: 'b' })

    await wrapper.findAll('[role="tab"]')[1]!.trigger('keydown', { key: 'ArrowUp' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('selects the first tab on Home', async () => {
    const wrapper = mountTabsNav({ modelValue: 'b' })

    await wrapper.findAll('[role="tab"]')[1]!.trigger('keydown', { key: 'Home' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('selects the last enabled tab on End', async () => {
    const wrapper = mountTabsNav({ modelValue: 'a' })

    await wrapper.findAll('[role="tab"]')[0]!.trigger('keydown', { key: 'End' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('renders a custom tab label through the label:{key} slot', () => {
    const wrapper = mountTabsNav({}, { 'label:b': 'Custom B' })

    expect(wrapper.findAll('[role="tab"]')[1]!.text()).toBe('Custom B')
  })
})
