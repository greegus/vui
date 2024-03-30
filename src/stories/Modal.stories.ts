/* eslint vue/one-component-per-file: 0 */

import { type Meta, type StoryFn } from '@storybook/vue3'
import { defineComponent } from 'vue'

import Button from '../components/Button.vue'
import ModalLayout from '../components/modal/ModalLayout.vue'
import ModalStack from '../components/modal/ModalStack.vue'
import { useCloseModal, useModal } from '../modal'

export default {
  title: 'Example/Modals',
  component: ModalStack,
  parameters: {
    docs: {
      description: {
        component: 'Modals'
      }
    }
  }
} as Meta<typeof ModalStack>

const AnotherSimpleModal = defineComponent({
  components: {
    ModalLayout
  },

  setup() {
    return { close: useCloseModal() }
  },

  template: `
    <ModalLayout title="Another Simple modal">
      <button @click="close()">Close</button>
    </ModalLayout>
  `
})

const SimpleModal = defineComponent({
  components: {
    ModalLayout
  },

  setup() {
    const modal = useModal()
    const close = useCloseModal()

    const openAnotherSimpleModal = async () => {
      await modal.open(AnotherSimpleModal)
    }

    return { close, openAnotherSimpleModal }
  },

  template: `
    <ModalLayout title="Simple modal">
      <button @click="close()">Close</button>
      <button @click="openAnotherSimpleModal()">Another modal</button>
    </ModalLayout>
  `
})

const SimpleModalWithBeforeClose = defineComponent({
  components: {
    ModalLayout
  },

  setup() {
    return {
      close: useCloseModal((close) => {
        if (confirm('Are you sure?')) {
          close()
        }
      })
    }
  },

  template: `
    <ModalLayout title="Simple modal with onBeforeClose handleer">
        <button @click="close()">Confirm and close</button>
    </ModalLayout>
  `
})

const Template: StoryFn<typeof ModalStack> = () => ({
  components: {
    ModalStack,
    Button
  },

  setup() {
    const modal = useModal()

    const openSimpleModal = async () => {
      await modal.open(SimpleModal)
    }

    const openSimpleModalWithBeforeClose = async () => {
      await modal.open(SimpleModalWithBeforeClose)
    }

    const openConfirmationModal = async () => {
      await modal.confirm('Are you sure?')
    }

    const openAlert = () => {
      modal.alert('Alert!')
    }

    return {
      openSimpleModal,
      openConfirmationModal,
      openSimpleModalWithBeforeClose,
      openAlert
    }
  },

  template: `
    <div>
        <ModalStack />

        <div style="display: flex; flex-flow: column; gap: 0.25rem">
            <div>
                <Button variant="primary" label="Open simple modal" @click="openSimpleModal()" />
            </div>

            <div>
                <Button variant="primary" label="Open simple modal with confirmation" @click="openSimpleModalWithBeforeClose()" />
            </div>

            <div>
                <Button variant="primary" label="Open confirmation modal" @click="openConfirmationModal()" />
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
