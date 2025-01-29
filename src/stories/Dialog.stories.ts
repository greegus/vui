/* eslint vue/one-component-per-file: 0 */

import { type Meta, type StoryFn } from '@storybook/vue3'
import { defineComponent } from 'vue'

import Button from '../components/Button.vue'
import DialogLayout from '../components/dialogStack/DialogLayout.vue'
import DialogStack from '../components/dialogStack/DialogStack.vue'
import { useCloseDialog, useDialogStack } from '../dialogStack'

export default {
  title: 'Example/Dialog',
  component: DialogStack,
  parameters: {
    docs: {
      description: {
        component: 'Dialog'
      }
    }
  }
} as Meta<typeof DialogStack>

const AnotheropenSimpleDialog = defineComponent({
  components: {
    DialogLayout
  },

  setup() {
    return { close: useCloseDialog() }
  },

  template: `
    <DialogLayout title="Another Simple dialog">
      <button @click="close()">Close</button>
    </DialogLayout>
  `
})

const OpenSimpleDialog = defineComponent({
  components: {
    DialogLayout
  },

  setup() {
    const dialog = useDialogStack()
    const close = useCloseDialog()

    const openAnotheropenSimpleDialog = async () => {
      await dialog.open(AnotheropenSimpleDialog)
    }

    return { close, openAnotheropenSimpleDialog }
  },

  template: `
    <DialogLayout title="Simple dialog">
      <button @click="close()">Close</button>
      <button @click="openAnotheropenSimpleDialog()">Another dialog</button>
    </DialogLayout>
  `
})

const SimpleDialogWithBeforeClose = defineComponent({
  components: {
    DialogLayout
  },

  setup() {
    return {
      close: useCloseDialog((close) => {
        if (confirm('Are you sure?')) {
          close()
        }
      })
    }
  },

  template: `
    <DialogLayout title="Simple dialog with onBeforeClose handleer">
        <button @click="close()">Confirm and close</button>
    </DialogLayout>
  `
})

const Template: StoryFn<typeof DialogStack> = () => ({
  components: {
    DialogStack,
    Button
  },

  setup() {
    const dialog = useDialogStack()

    const openSimpleDialog = async () => {
      await dialog.open(OpenSimpleDialog)
    }

    const openSimpleDialogWithBeforeClose = async () => {
      await dialog.open(SimpleDialogWithBeforeClose)
    }

    const openConfirmationDialog = async () => {
      await dialog.confirm('Are you sure?')
    }

    const openAlert = () => {
      dialog.alert('Alert!')
    }

    return {
      openSimpleDialog,
      openConfirmationDialog,
      openSimpleDialogWithBeforeClose,
      openAlert
    }
  },

  template: `
    <div>
        <DialogStack />

        <div style="display: flex; flex-flow: column; gap: 0.25rem">
            <div>
                <Button variant="primary" label="Open simple dialog" @click="openSimpleDialog()" />
            </div>

            <div>
                <Button variant="primary" label="Open simple dialog with confirmation" @click="openSimpleDialogWithBeforeClose()" />
            </div>

            <div>
                <Button variant="primary" label="Open confirmation dialog" @click="openConfirmationDialog()" />
            </div>

            <div>
                <Button variant="primary" label="Open alert" @click="openAlert()" />
            </div>
        </div>
    </div>
  `
})

export const Default = {
  render: Template
}
