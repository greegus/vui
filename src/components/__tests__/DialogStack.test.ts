import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import DialogStack from '@/components/dialogStack/DialogStack.vue'
import { dialogs, openAlert, openConfirm, openDialog } from '@/dialogStack'

const CustomDialog = defineComponent({
  props: { label: { type: String, default: '' } },
  emits: ['close'],
  setup:
    (props, { emit }) =>
    () =>
      h('div', { class: 'CustomDialog' }, [
        props.label,
        h('button', { type: 'button', onClick: () => emit('close', 'from-component') }, 'Done'),
      ]),
})

const mountStack = () => mount(DialogStack, { global: { stubs: { teleport: true } } })

const pressEscape = async () => {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))
  await nextTick()
}

enableAutoUnmount(afterEach)

describe('DialogStack', () => {
  beforeEach(() => {
    dialogs.value = []
  })

  it('renders no dialog and no backdrop while the stack is empty', () => {
    const wrapper = mountStack()

    expect(wrapper.findAll('.DialogStack__dialogWrapper')).toHaveLength(0)
    expect(wrapper.find('.DialogStack__backdrop').exists()).toBe(false)
  })

  it('renders a backdrop as soon as a dialog is opened', async () => {
    const wrapper = mountStack()

    openDialog(CustomDialog, { label: 'Hello' })
    await nextTick()

    expect(wrapper.find('.DialogStack__backdrop').exists()).toBe(true)
  })

  it('renders one dialog per stack entry and passes the props to the component', async () => {
    openDialog(CustomDialog, { label: 'First' })
    openDialog(CustomDialog, { label: 'Second' })

    const wrapper = mountStack()
    await nextTick()

    const rendered = wrapper.findAll('.CustomDialog')
    expect(rendered).toHaveLength(2)
    expect(rendered[0]!.text()).toContain('First')
    expect(rendered[1]!.text()).toContain('Second')
  })

  it('marks only the top-most dialog as active', async () => {
    openDialog(CustomDialog, { label: 'First' })
    openDialog(CustomDialog, { label: 'Second' })

    const wrapper = mountStack()
    await nextTick()

    const rendered = wrapper.findAll('.DialogStack__dialog')
    expect(rendered[0]!.classes()).not.toContain('isActive')
    expect(rendered[1]!.classes()).toContain('isActive')
  })

  it('closes the dialog and resolves its promise when the backdrop around it is clicked', async () => {
    const result = openDialog<string>(CustomDialog, { label: 'Hello' })

    const wrapper = mountStack()
    await wrapper.find('.DialogStack__dialogWrapper').trigger('click')

    await expect(result).resolves.toBeUndefined()
    expect(dialogs.value).toHaveLength(0)
  })

  it('keeps the dialog open when the click happens inside the dialog', async () => {
    openDialog(CustomDialog, { label: 'Hello' })

    const wrapper = mountStack()
    await wrapper.find('.CustomDialog').trigger('click')

    expect(dialogs.value).toHaveLength(1)
  })

  it('does not close a modal dialog when the backdrop is clicked', async () => {
    openDialog(CustomDialog, { label: 'Hello' }, { modal: true })

    const wrapper = mountStack()
    await wrapper.find('.DialogStack__dialogWrapper').trigger('click')

    expect(dialogs.value).toHaveLength(1)
  })

  it('closes only the top-most dialog when Escape is pressed', async () => {
    openDialog(CustomDialog, { label: 'First' })
    const second = openDialog<string>(CustomDialog, { label: 'Second' })

    mountStack()
    await pressEscape()

    await expect(second).resolves.toBeUndefined()
    expect(dialogs.value).toHaveLength(1)
    expect(dialogs.value[0]!.props).toEqual({ label: 'First' })
  })

  it('does not close a modal dialog on Escape', async () => {
    openDialog(CustomDialog, { label: 'Hello' }, { modal: true })

    mountStack()
    await pressEscape()

    expect(dialogs.value).toHaveLength(1)
  })

  it('ignores Escape once it has been unmounted', async () => {
    const wrapper = mountStack()
    openDialog(CustomDialog, { label: 'Hello' })
    await nextTick()

    wrapper.unmount()
    await pressEscape()

    expect(dialogs.value).toHaveLength(1)
  })

  it('closes the dialog with the payload of the close event emitted by the dialog component', async () => {
    const result = openDialog<string>(CustomDialog, { label: 'Hello' })

    const wrapper = mountStack()
    await wrapper.find('.CustomDialog button').trigger('click')

    await expect(result).resolves.toBe('from-component')
    expect(dialogs.value).toHaveLength(0)
  })

  it('resolves the alert promise when its confirm button is clicked', async () => {
    const result = openAlert('Saved!')

    const wrapper = mountStack()
    await nextTick()

    expect(wrapper.text()).toContain('Saved!')

    await wrapper.find('.DialogLayout__buttons button').trigger('click')

    await expect(result).resolves.toBeUndefined()
    expect(dialogs.value).toHaveLength(0)
  })

  it('resolves the confirm promise with true when the confirm button is clicked', async () => {
    const result = openConfirm('Delete this item?')

    const wrapper = mountStack()
    await nextTick()

    const buttons = wrapper.findAll('.DialogLayout__buttons button')
    expect(buttons.map((button) => button.text())).toEqual(['Cancel', 'OK'])

    await buttons[1]!.trigger('click')

    await expect(result).resolves.toBe(true)
  })

  it('resolves the confirm promise with false when the cancel button is clicked', async () => {
    const result = openConfirm('Delete this item?')

    const wrapper = mountStack()
    await nextTick()

    await wrapper.findAll('.DialogLayout__buttons button')[0]!.trigger('click')

    await expect(result).resolves.toBe(false)
  })

  it('closes the top-most confirmation first when two are stacked', async () => {
    const first = openConfirm('First?')
    const second = openConfirm('Second?')

    const wrapper = mountStack()
    await nextTick()

    const dialogElements = wrapper.findAll('.DialogStack__dialog')
    await dialogElements[1]!.findAll('button')[1]!.trigger('click')

    await expect(second).resolves.toBe(true)
    expect(dialogs.value).toHaveLength(1)

    await nextTick()
    await wrapper.findAll('.DialogLayout__buttons button')[0]!.trigger('click')

    await expect(first).resolves.toBe(false)
    expect(dialogs.value).toHaveLength(0)
  })
})
