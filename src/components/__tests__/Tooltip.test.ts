import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import Tooltip from '@/components/Tooltip.vue'

// Tooltip has no JavaScript visibility state: the bubble is always in the DOM and is
// revealed purely by CSS (`:hover` / `:focus-within` + `transition-delay`). jsdom does not
// evaluate pseudo-class rules in `getComputedStyle`, so what is observable from a test is
// the markup contract: the bubble, its ARIA wiring, and the placement/delay/offset
// custom properties and state modifiers that the stylesheet keys off.

function cssVar(element: Element, property: string): string {
  return (element as HTMLElement).style.getPropertyValue(property)
}

function rootStyle(wrapper: { element: Element }, property: string): string {
  return cssVar(wrapper.element, property)
}

describe('Tooltip', () => {
  it('renders the trigger content passed to the default slot', () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'Save the document' },
      slots: { default: '<button>Save</button>' },
    })

    expect(wrapper.find('.Tooltip__trigger button').text()).toBe('Save')
  })

  it('renders the title prop inside an element with role="tooltip"', () => {
    const wrapper = mount(Tooltip, { props: { title: 'This is a tooltip' } })

    const bubble = wrapper.find('[role="tooltip"]')

    expect(bubble.exists()).toBe(true)
    expect(bubble.text()).toBe('This is a tooltip')
  })

  it('renders the title slot instead of the title prop', () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'Plain' },
      slots: { title: '<strong>Rich</strong> content' },
    })

    const bubble = wrapper.find('[role="tooltip"]')

    expect(bubble.text()).toBe('Rich content')
    expect(bubble.find('strong').exists()).toBe(true)
  })

  it('renders a tooltip when only the title slot is given', () => {
    const wrapper = mount(Tooltip, { slots: { title: 'From the slot' } })

    expect(wrapper.find('[role="tooltip"]').text()).toBe('From the slot')
  })

  it('renders no tooltip at all when neither title prop nor title slot is given', () => {
    const wrapper = mount(Tooltip, { slots: { default: '<button>Save</button>' } })

    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    expect(wrapper.find('.Tooltip__trigger').attributes('aria-describedby')).toBeUndefined()
  })

  it('describes the trigger with the tooltip via aria-describedby', () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'Save the document' },
      slots: { default: '<button>Save</button>' },
    })

    const describedBy = wrapper.find('.Tooltip__trigger').attributes('aria-describedby')

    expect(describedBy).toBeTruthy()
    expect(wrapper.find('[role="tooltip"]').attributes('id')).toBe(describedBy)
  })

  it('gives every tooltip on the page its own anchor name and tooltip id', () => {
    const Page = defineComponent({
      render: () => h('div', [h(Tooltip, { title: 'One' }), h(Tooltip, { title: 'Two' })]),
    })

    const wrapper = mount(Page)
    const anchors = wrapper.findAll('.Tooltip').map((tooltip) => cssVar(tooltip.element, '--anchor-id'))
    const ids = wrapper.findAll('[role="tooltip"]').map((bubble) => bubble.attributes('id'))

    expect(anchors[0]).toMatch(/^--anchor-/)
    expect(anchors[0]).not.toBe(anchors[1])
    expect(ids[0]).not.toBe(ids[1])
  })

  it('places the tooltip above the trigger by default', () => {
    const wrapper = mount(Tooltip, { props: { title: 'Tip' } })

    expect(wrapper.find('[role="tooltip"]').classes()).toContain('Tooltip__bubble--top')
    expect(rootStyle(wrapper, '--position-area')).toBe('top')
  })

  const placements = ['top', 'bottom', 'left', 'right'] as const

  placements.forEach((placement) => {
    it(`positions the tooltip to the ${placement} when placement is "${placement}"`, () => {
      const wrapper = mount(Tooltip, { props: { title: 'Tip', placement } })

      expect(wrapper.find('[role="tooltip"]').classes()).toContain(`Tooltip__bubble--${placement}`)
      expect(rootStyle(wrapper, '--position-area')).toBe(placement)
    })
  })

  it('adds the arrow modifier only when withArrow is set', () => {
    const withArrow = mount(Tooltip, { props: { title: 'Tip', withArrow: true } })
    const withoutArrow = mount(Tooltip, { props: { title: 'Tip' } })

    expect(withArrow.find('[role="tooltip"]').classes()).toContain('Tooltip__bubble--withArrow')
    expect(withoutArrow.find('[role="tooltip"]').classes()).not.toContain('Tooltip__bubble--withArrow')
  })

  it('exposes the offset prop as a pixel custom property', () => {
    const wrapper = mount(Tooltip, { props: { title: 'Tip', offset: 12 } })

    expect(rootStyle(wrapper, '--offset')).toBe('12px')
  })

  it('opts into the focus trigger only when showOnFocus is set', () => {
    const focusable = mount(Tooltip, { props: { title: 'Tip', showOnFocus: true } })
    const hoverOnly = mount(Tooltip, { props: { title: 'Tip' } })

    expect(focusable.classes()).toContain('Tooltip--showOnFocus')
    expect(hoverOnly.classes()).not.toContain('Tooltip--showOnFocus')
  })

  it('shows without any delay by default', () => {
    const wrapper = mount(Tooltip, { props: { title: 'Tip' } })

    expect(wrapper.classes()).not.toContain('Tooltip--delayed')
    expect(rootStyle(wrapper, '--delay')).toBe('')
  })

  it('opts into the default delay token when delayed is set', () => {
    const wrapper = mount(Tooltip, { props: { title: 'Tip', delayed: true } })

    expect(wrapper.classes()).toContain('Tooltip--delayed')
    expect(rootStyle(wrapper, '--delay')).toBe('')
  })

  it('sets an explicit delay in milliseconds from the delay prop', () => {
    const wrapper = mount(Tooltip, { props: { title: 'Tip', delay: 800 } })

    expect(rootStyle(wrapper, '--delay')).toBe('800ms')
  })

  it('lets an explicit delay take precedence over the delayed flag', () => {
    const wrapper = mount(Tooltip, { props: { title: 'Tip', delayed: true, delay: 200 } })

    // The inline `--delay` beats the `.Tooltip--delayed { --delay: … }` rule in the cascade.
    expect(rootStyle(wrapper, '--delay')).toBe('200ms')
    expect(wrapper.classes()).toContain('Tooltip--delayed')
  })

  it('treats a zero delay as an explicit no-delay rather than falling back to the token', () => {
    const wrapper = mount(Tooltip, { props: { title: 'Tip', delayed: true, delay: 0 } })

    expect(rootStyle(wrapper, '--delay')).toBe('0ms')
  })

  it('updates the placement when the prop changes', async () => {
    const wrapper = mount(Tooltip, { props: { title: 'Tip', placement: 'top' } })

    await wrapper.setProps({ placement: 'right' })

    expect(wrapper.find('[role="tooltip"]').classes()).toContain('Tooltip__bubble--right')
    expect(wrapper.find('[role="tooltip"]').classes()).not.toContain('Tooltip__bubble--top')
    expect(rootStyle(wrapper, '--position-area')).toBe('right')
  })

  it('starts rendering the tooltip once a title is provided', async () => {
    const wrapper = mount(Tooltip, { slots: { default: '<button>Save</button>' } })

    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)

    await wrapper.setProps({ title: 'Now it has one' })

    expect(wrapper.find('[role="tooltip"]').text()).toBe('Now it has one')
    expect(wrapper.find('.Tooltip__trigger').attributes('aria-describedby')).toBeTruthy()
  })
})
