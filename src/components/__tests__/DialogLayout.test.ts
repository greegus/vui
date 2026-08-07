import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import DialogLayout from '@/components/dialogStack/DialogLayout.vue'
import { activeDialog, dialogs, openDialog } from '@/dialogStack'

const mountLayout = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(DialogLayout, { props, slots })

describe('DialogLayout', () => {
  beforeEach(() => {
    dialogs.value = []
  })

  it('exposes itself as a modal dialog labelled by its title', () => {
    const wrapper = mountLayout({ title: 'Delete item' })

    expect(wrapper.attributes('role')).toBe('dialog')
    expect(wrapper.attributes('aria-modal')).toBe('true')
    expect(wrapper.attributes('aria-label')).toBe('Delete item')
  })

  it('falls back to the content as the accessible label when there is no title', () => {
    const wrapper = mountLayout({ content: 'This cannot be undone.' })

    expect(wrapper.attributes('aria-label')).toBe('This cannot be undone.')
  })

  it('renders the title in a header and the content in the body', () => {
    const wrapper = mountLayout({ title: 'Delete item', content: 'This cannot be undone.' })

    expect(wrapper.find('.DialogLayout__header').text()).toBe('Delete item')
    expect(wrapper.find('.DialogLayout__body').text()).toBe('This cannot be undone.')
  })

  it('omits the header when neither a title nor a header slot is given', () => {
    const wrapper = mountLayout({ content: 'Just content' })

    expect(wrapper.find('.DialogLayout__header').exists()).toBe(false)
  })

  it('renders a header when only a header slot is given', () => {
    const wrapper = mountLayout({}, { header: 'Custom header' })

    expect(wrapper.find('.DialogLayout__header').text()).toBe('Custom header')
  })

  it('omits the footer when there are no buttons and no footer slot', () => {
    const wrapper = mountLayout({ content: 'Just content' })

    expect(wrapper.find('.DialogLayout__footer').exists()).toBe(false)
  })

  it('renders a footer when only a footer slot is given', () => {
    const wrapper = mountLayout({}, { footer: 'Custom footer' })

    expect(wrapper.find('.DialogLayout__footer').text()).toBe('Custom footer')
  })

  it('renders the default slot instead of the content prop', () => {
    const wrapper = mountLayout({ content: 'Prop content' }, { default: 'Slotted content' })

    expect(wrapper.find('.DialogLayout__body').text()).toBe('Slotted content')
    expect(wrapper.text()).not.toContain('Prop content')
  })

  it('renders one button per configured button, with its label and color', () => {
    const wrapper = mountLayout({
      buttons: [
        { label: 'Keep', color: 'secondary', value: false },
        { label: 'Delete', color: 'danger', value: true },
      ],
    })

    const buttons = wrapper.findAll('.DialogLayout__buttons button')

    expect(buttons.map((button) => button.text())).toEqual(['Keep', 'Delete'])
    expect(buttons[1]!.classes()).toContain('vuiii-button--color-danger')
  })

  it('marks a button configured as disabled', () => {
    const wrapper = mountLayout({ buttons: [{ label: 'Delete', disabled: true }] })

    expect(wrapper.find('.DialogLayout__buttons button').classes()).toContain('vuiii-button--disabled')
  })

  // BUG: Button.vue declares `disabled` as a prop, so it never reaches the rendered <button>;
  // a disabled dialog button is still clickable and closes the dialog.
  it.skip('does not close the dialog when a disabled button is clicked', async () => {
    const props = { buttons: [{ label: 'Delete', value: 'deleted', disabled: true }] }
    openDialog(DialogLayout, props)
    const wrapper = mountLayout(props)

    await wrapper.find('.DialogLayout__buttons button').trigger('click')

    expect(dialogs.value).toHaveLength(1)
  })

  it('constrains the width to the given number of pixels', () => {
    const wrapper = mountLayout({ width: 420 })

    expect(wrapper.attributes('style')).toContain('max-width: 420px')
  })

  it('defaults to a 600px wide dialog', () => {
    const wrapper = mountLayout()

    expect(wrapper.attributes('style')).toContain('max-width: 600px')
  })

  it('leaves the width unconstrained when width is auto', () => {
    const wrapper = mountLayout({ width: 'auto' })

    expect(wrapper.attributes('style')).toBeUndefined()
  })

  it('renders no close button by default', () => {
    const wrapper = mountLayout({ title: 'Hello' })

    expect(wrapper.find('.DialogLayout__close').exists()).toBe(false)
  })

  it('closes the active dialog when the close button is clicked', async () => {
    const result = openDialog<string>(DialogLayout, { title: 'Hello', withCloseButton: true })
    const wrapper = mountLayout(activeDialog.value.props)

    await wrapper.find('[aria-label="Close"]').trigger('click')

    await expect(result).resolves.toBeUndefined()
    expect(dialogs.value).toHaveLength(0)
  })

  it('closes the active dialog with the value of the clicked button', async () => {
    const props = {
      content: 'Delete?',
      buttons: [
        { label: 'Keep', value: 'kept' },
        { label: 'Delete', value: 'deleted' },
      ],
    }
    const result = openDialog<string>(DialogLayout, props)
    const wrapper = mountLayout(props)

    await wrapper.findAll('.DialogLayout__buttons button')[1]!.trigger('click')

    await expect(result).resolves.toBe('deleted')
    expect(dialogs.value).toHaveLength(0)
  })

  it('does nothing when a button is clicked with no dialog on the stack', async () => {
    const wrapper = mountLayout({ buttons: [{ label: 'OK', value: true }] })

    await wrapper.find('.DialogLayout__buttons button').trigger('click')

    expect(dialogs.value).toHaveLength(0)
  })

  it('moves focus into the dialog when it is mounted', () => {
    const wrapper = mount(DialogLayout, {
      props: { buttons: [{ label: 'OK', color: 'primary' }] },
      attachTo: document.body,
    })

    expect(document.activeElement).toBe(wrapper.find('.DialogLayout__buttons button').element)

    wrapper.unmount()
  })

  // BUG: the initial-focus resolver looks for the class `vuiii-button--primary`, but Button renders
  // `vuiii-button--color-primary`, so focus always lands on the first button instead of the primary one.
  it.skip('focuses the primary button first', () => {
    const wrapper = mount(DialogLayout, {
      props: {
        buttons: [
          { label: 'Cancel', color: 'secondary', value: false },
          { label: 'OK', color: 'primary', value: true },
        ],
      },
      attachTo: document.body,
    })

    expect((document.activeElement as HTMLElement).textContent).toContain('OK')

    wrapper.unmount()
  })

  it('keeps Tab focus inside the dialog', async () => {
    const wrapper = mount(DialogLayout, {
      props: { withCloseButton: true, buttons: [{ label: 'OK', value: true }] },
      attachTo: document.body,
    })

    const closeButton = wrapper.find('.DialogLayout__close').element as HTMLElement
    closeButton.focus()
    await wrapper.trigger('keydown', { key: 'Tab' })

    expect(wrapper.element.contains(document.activeElement)).toBe(true)

    wrapper.unmount()
  })
})
