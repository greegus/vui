/* eslint vue/one-component-per-file: 0 */

import { Meta, StoryFn } from '@storybook/vue3'

import Button from '@/components/Button.vue'
import SnackbarStack from '@/components/snackbar/SnackbarStack.vue'
import { useSnackbar } from '@/snackbar'

export default {
  title: 'Example/Snackbar',
  component: SnackbarStack,
  parameters: {
    docs: {
      description: {
        component: 'Snackbar'
      }
    }
  }
} as Meta<typeof SnackbarStack>

const Template: StoryFn<typeof SnackbarStack> = () => ({
  components: {
    SnackbarStack,
    Button
  },

  setup() {
    const snackbar = useSnackbar()

    const showSuccessMessage = async () => {
      snackbar.success('Success message!')
    }

    const showErrorMessage = async () => {
      snackbar.error('Errror message!')
    }

    return {
      showSuccessMessage,
      showErrorMessage
    }
  },

  template: `
    <div>
        <SnackbarStack />

        <div style="display: flex; flex-flow: column; gap: 0.25rem">
            <div>
                <Button variant="primary" label="Show success message" @click="showSuccessMessage()" />
            </div>

            <div>
                <Button variant="primary" label="Show error message" @click="showErrorMessage()" />
            </div>
        </div>
    </div>
  `
})

export const Default = {
  render: Template
}
