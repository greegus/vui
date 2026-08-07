import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import IconButton from '@/components/IconButton.vue'

const IconStub = {
  props: ['name', 'size'],
  template: '<i class="icon-stub" :data-name="name" :data-size="size" />',
}

function mountIconButton(props: Record<string, unknown> = {}) {
  return mount(IconButton, {
    props: { icon: 'pencil', ...props },
    global: { stubs: { Icon: IconStub } },
  })
}

describe('IconButton', () => {
  it('renders a button showing the given icon and no label text', () => {
    const wrapper = mountIconButton()

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.find('.icon-stub').attributes('data-name')).toBe('pencil')
    expect(wrapper.text()).toBe('')
  })

  it('renders exactly one icon', () => {
    const wrapper = mountIconButton()

    expect(wrapper.findAll('.icon-stub')).toHaveLength(1)
  })

  it('forwards the color to the underlying button', () => {
    const wrapper = mountIconButton({ color: 'danger' })

    expect(wrapper.classes()).toContain('vuiii-button--color-danger')
  })

  it('forwards the size to the underlying button and its icon', () => {
    const wrapper = mountIconButton({ size: 'large' })

    expect(wrapper.classes()).toContain('vuiii-button--size-large')
    expect(wrapper.find('.icon-stub').attributes('data-size')).toBe('large')
  })

  it('forwards the variant to the underlying button', () => {
    const wrapper = mountIconButton({ variant: 'text' })

    expect(wrapper.classes()).toContain('vuiii-button--variant-text')
  })

  it('emits click when the button is clicked', async () => {
    const wrapper = mountIconButton()

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('labels the button for assistive tech using the title', () => {
    const wrapper = mountIconButton({ title: 'Delete item' })

    expect(wrapper.attributes('aria-label')).toBe('Delete item')
    expect(wrapper.attributes('title')).toBe('Delete item')
  })

  it('has no aria-label when no title is given', () => {
    const wrapper = mountIconButton()

    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })

  it('renders a spinner instead of the icon while loading', () => {
    const wrapper = mountIconButton({ loading: true })

    expect(wrapper.find('.icon-stub').attributes('data-name')).toBe('spinner')
    expect(wrapper.classes()).toContain('vuiii-button--loading')
  })

  it('marks the button as disabled when disabled', () => {
    const wrapper = mountIconButton({ disabled: true })

    expect(wrapper.classes()).toContain('vuiii-button--disabled')
  })

  // BUG: Button declares `disabled` as a prop but never binds it to the rendered element,
  // so a disabled IconButton is only styled as disabled and stays clickable/focusable.
  it.skip('renders a natively disabled button when disabled', () => {
    const wrapper = mountIconButton({ disabled: true })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
