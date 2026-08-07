import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import DialogLayout from '@/components/dialogStack/DialogLayout.vue'
import {
  activeDialog,
  closeDialog,
  type Dialog,
  dialogs,
  openAlert,
  openConfirm,
  openDialog,
  useCloseDialog,
  useDialogStack,
} from '@/dialogStack'

const CustomDialog = defineComponent({
  props: { userId: { type: Number, default: 0 } },
  setup: (props) => () => h('div', `user ${props.userId}`),
})

const buttonsOf = (dialog: Dialog | undefined) => (dialog?.props?.buttons ?? []) as Record<string, any>[]

describe('dialogStack', () => {
  beforeEach(() => {
    dialogs.value = []
  })

  describe('openDialog', () => {
    it('pushes the component and its props onto the stack', () => {
      openDialog(CustomDialog, { userId: 7 })

      expect(dialogs.value).toHaveLength(1)
      expect(activeDialog.value.component).toBe(CustomDialog)
      expect(activeDialog.value.props).toEqual({ userId: 7 })
    })

    it('resolves with the value the dialog is closed with', async () => {
      const result = openDialog<string>(CustomDialog)

      closeDialog(activeDialog.value, 'saved')

      await expect(result).resolves.toBe('saved')
    })

    it('resolves with undefined when the dialog is closed without a result', async () => {
      const result = openDialog(CustomDialog)

      closeDialog(activeDialog.value)

      await expect(result).resolves.toBeUndefined()
    })

    it('removes the dialog from the stack when it is closed', () => {
      openDialog(CustomDialog)

      closeDialog(activeDialog.value)

      expect(dialogs.value).toHaveLength(0)
      expect(activeDialog.value).toBeUndefined()
    })

    it('marks the dialog as modal when the modal option is used', () => {
      openDialog(CustomDialog, undefined, { modal: true })

      expect(activeDialog.value.modal).toBe(true)
    })

    it('restores focus to the element that was focused before opening', () => {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      openDialog(CustomDialog)

      expect(document.activeElement).not.toBe(input)

      closeDialog(activeDialog.value)

      expect(document.activeElement).toBe(input)

      input.remove()
    })
  })

  describe('stacking', () => {
    it('keeps the last opened dialog as the active one', () => {
      openDialog(CustomDialog, { userId: 1 })
      openDialog(CustomDialog, { userId: 2 })

      expect(dialogs.value).toHaveLength(2)
      expect(activeDialog.value.props).toEqual({ userId: 2 })
    })

    it('gives every dialog on the stack a distinct id', () => {
      openDialog(CustomDialog)
      openDialog(CustomDialog)

      const [first, second] = dialogs.value

      expect(first!.id).not.toBe(second!.id)
    })

    it('makes the dialog underneath active again once the top one is closed', () => {
      openDialog(CustomDialog, { userId: 1 })
      openDialog(CustomDialog, { userId: 2 })

      closeDialog(activeDialog.value)

      expect(dialogs.value).toHaveLength(1)
      expect(activeDialog.value.props).toEqual({ userId: 1 })
    })

    it('resolves each stacked dialog with its own result', async () => {
      const first = openDialog<string>(CustomDialog)
      const firstDialog = activeDialog.value
      const second = openDialog<string>(CustomDialog)
      const secondDialog = activeDialog.value

      closeDialog(secondDialog, 'second')
      closeDialog(firstDialog, 'first')

      await expect(second).resolves.toBe('second')
      await expect(first).resolves.toBe('first')
    })

    it('closes a dialog that is not on top and leaves the rest untouched', async () => {
      const first = openDialog<string>(CustomDialog, { userId: 1 })
      const firstDialog = activeDialog.value
      openDialog(CustomDialog, { userId: 2 })

      closeDialog(firstDialog, 'first')

      await expect(first).resolves.toBe('first')
      expect(dialogs.value).toHaveLength(1)
      expect(activeDialog.value.props).toEqual({ userId: 2 })
    })
  })

  describe('openAlert', () => {
    it('opens a DialogLayout with the string message as content', () => {
      openAlert('Saved!')

      expect(activeDialog.value.component).toBe(DialogLayout)
      expect(activeDialog.value.props?.content).toBe('Saved!')
      expect(activeDialog.value.props?.title).toBeUndefined()
    })

    it('renders a single confirm button labelled OK by default', () => {
      openAlert('Saved!')

      expect(buttonsOf(activeDialog.value)).toEqual([{ color: 'primary', label: 'OK', icon: undefined }])
    })

    it('uses the title, label, color and icon from the options object', () => {
      openAlert({
        title: 'Success',
        content: 'Your changes have been saved.',
        confirmLabel: 'Great!',
        confirmColor: 'success',
        confirmIcon: 'check',
      })

      expect(activeDialog.value.props?.title).toBe('Success')
      expect(activeDialog.value.props?.content).toBe('Your changes have been saved.')
      expect(buttonsOf(activeDialog.value)).toEqual([{ color: 'success', label: 'Great!', icon: 'check' }])
    })

    it('passes the modal option through to the dialog', () => {
      openAlert({ content: 'Wait', modal: true })

      expect(activeDialog.value.props?.modal).toBe(true)
    })

    it('resolves once the alert is dismissed', async () => {
      const result = openAlert('Saved!')

      closeDialog(activeDialog.value)

      await expect(result).resolves.toBeUndefined()
    })
  })

  describe('openConfirm', () => {
    it('opens a DialogLayout with a cancel and a confirm button', () => {
      openConfirm('Delete this item?')

      expect(activeDialog.value.component).toBe(DialogLayout)
      expect(activeDialog.value.props?.content).toBe('Delete this item?')
      expect(buttonsOf(activeDialog.value)).toEqual([
        { color: 'secondary', label: 'Cancel', icon: undefined, value: false },
        { color: 'primary', label: 'OK', icon: undefined, value: true },
      ])
    })

    it('uses the labels, colors and icons from the options object', () => {
      openConfirm({
        title: 'Delete Item',
        content: 'This action cannot be undone.',
        cancelLabel: 'Keep',
        cancelColor: 'secondary',
        cancelIcon: 'x',
        confirmLabel: 'Delete',
        confirmColor: 'danger',
        confirmIcon: 'trash',
      })

      expect(activeDialog.value.props?.title).toBe('Delete Item')
      expect(buttonsOf(activeDialog.value)).toEqual([
        { color: 'secondary', label: 'Keep', icon: 'x', value: false },
        { color: 'danger', label: 'Delete', icon: 'trash', value: true },
      ])
    })

    it('resolves with true when closed with the confirm button value', async () => {
      const result = openConfirm('Delete this item?')

      closeDialog(activeDialog.value, true)

      await expect(result).resolves.toBe(true)
    })

    it('resolves with false when closed with the cancel button value', async () => {
      const result = openConfirm('Delete this item?')

      closeDialog(activeDialog.value, false)

      await expect(result).resolves.toBe(false)
    })
  })

  describe('useCloseDialog', () => {
    it('closes the active dialog with the given result', async () => {
      const result = openDialog<{ saved: boolean }>(CustomDialog)
      const close = useCloseDialog()

      close({ saved: true })

      await expect(result).resolves.toEqual({ saved: true })
      expect(dialogs.value).toHaveLength(0)
    })

    it('closes only the top-most dialog of the stack', async () => {
      openDialog(CustomDialog, { userId: 1 })
      const second = openDialog<string>(CustomDialog, { userId: 2 })
      const close = useCloseDialog()

      close('second')

      await expect(second).resolves.toBe('second')
      expect(dialogs.value).toHaveLength(1)
      expect(activeDialog.value.props).toEqual({ userId: 1 })
    })

    it('does nothing when the stack is empty', () => {
      const close = useCloseDialog()

      expect(() => close('anything')).not.toThrow()
      expect(dialogs.value).toHaveLength(0)
    })

    it('keeps the dialog open while the onBeforeClose handler withholds confirmation', () => {
      openDialog(CustomDialog)
      const close = useCloseDialog(() => {
        // never confirms
      })

      close()

      expect(dialogs.value).toHaveLength(1)
    })

    it('closes the dialog with the original result once onBeforeClose confirms', async () => {
      const result = openDialog<string>(CustomDialog)
      let confirmClose: () => void = () => {}
      const close = useCloseDialog((confirm) => (confirmClose = confirm))

      close('done')
      expect(dialogs.value).toHaveLength(1)

      confirmClose()

      await expect(result).resolves.toBe('done')
      expect(dialogs.value).toHaveLength(0)
    })

    it('runs onBeforeClose when the dialog is closed from the outside', () => {
      openDialog(CustomDialog)
      const onBeforeClose = vi.fn()
      useCloseDialog(onBeforeClose)

      closeDialog(activeDialog.value)

      expect(onBeforeClose).toHaveBeenCalledTimes(1)
      expect(dialogs.value).toHaveLength(1)
    })

    it('registers the onBeforeClose handler on the dialog that is active at call time', () => {
      openDialog(CustomDialog, { userId: 1 })
      const onBeforeClose = vi.fn()
      useCloseDialog(onBeforeClose)
      openDialog(CustomDialog, { userId: 2 })

      closeDialog(activeDialog.value)

      expect(onBeforeClose).not.toHaveBeenCalled()
      expect(dialogs.value).toHaveLength(1)
    })
  })

  describe('useDialogStack', () => {
    it('opens a custom dialog through open() and resolves with its result', async () => {
      const dialog = useDialogStack()

      const result = dialog.open<string>(CustomDialog, { userId: 3 })
      expect(activeDialog.value.props).toEqual({ userId: 3 })

      closeDialog(activeDialog.value, 'ok')

      await expect(result).resolves.toBe('ok')
    })

    it('opens an alert through alert()', async () => {
      const dialog = useDialogStack()

      const result = dialog.alert('Done')
      expect(activeDialog.value.props?.content).toBe('Done')

      closeDialog(activeDialog.value)

      await expect(result).resolves.toBeUndefined()
    })

    it('opens a confirmation through confirm()', async () => {
      const dialog = useDialogStack()

      const result = dialog.confirm('Sure?')
      expect(buttonsOf(activeDialog.value)).toHaveLength(2)

      closeDialog(activeDialog.value, true)

      await expect(result).resolves.toBe(true)
    })
  })
})
