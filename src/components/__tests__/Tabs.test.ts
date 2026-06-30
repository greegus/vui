import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Tabs from '@/components/Tabs.vue'

const tabs = [
  { key: 'a', label: 'Tab A' },
  { key: 'b', label: 'Tab B' },
  { key: 'c', label: 'Tab C', disabled: true },
]

const slots = {
  'tab:a': 'Panel A',
  'tab:b': 'Panel B',
  'tab:c': 'Panel C',
}

function mountTabs(props: Record<string, unknown> = {}, extraSlots: Record<string, string> = {}) {
  return mount(Tabs, { props: { tabs, ...props }, slots: { ...slots, ...extraSlots } })
}

describe('Tabs', () => {
  it('renders tablist/tab/tabpanel roles and the first panel by default', () => {
    const wrapper = mountTabs()

    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3)
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(true)
    expect(wrapper.find('[role="tab"][aria-selected="true"]').text()).toBe('Tab A')
    expect(wrapper.text()).toContain('Panel A')
  })

  it('lazily renders only the active panel by default', () => {
    const wrapper = mountTabs()

    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(1)
    expect(wrapper.text()).not.toContain('Panel B')
  })

  it('keeps all panels mounted (hidden) with keepAlive', () => {
    const wrapper = mountTabs({ keepAlive: true })

    const panels = wrapper.findAll('[role="tabpanel"]')
    expect(panels).toHaveLength(3)
    expect((panels[1]!.element as HTMLElement).style.display).toBe('none')
  })

  it('shows the panel matching the v-model value', () => {
    const wrapper = mountTabs({ modelValue: 'b' })

    expect(wrapper.text()).toContain('Panel B')
    expect(wrapper.find('[aria-selected="true"]').text()).toBe('Tab B')
  })

  it('updates the model when a tab is clicked', async () => {
    const wrapper = mountTabs()

    await wrapper.findAll('[role="tab"]')[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    expect(wrapper.text()).toContain('Panel B')
  })

  it('does not activate a disabled tab', async () => {
    const wrapper = mountTabs()

    const disabledTab = wrapper.findAll('[role="tab"]')[2]!
    expect(disabledTab.attributes('disabled')).toBeDefined()

    await disabledTab.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('moves selection with ArrowRight', async () => {
    const wrapper = mountTabs()

    await wrapper.findAll('[role="tab"]')[0]!.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('renders a custom tab label via the label:{key} slot', () => {
    const wrapper = mountTabs({}, { 'label:b': 'Custom B' })

    expect(wrapper.findAll('[role="tab"]')[1]!.text()).toContain('Custom B')
  })
})
