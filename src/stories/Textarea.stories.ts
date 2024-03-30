import { StoryObj, type Meta } from '@storybook/vue3'

import Textarea from '../components/Textarea.vue'
import { inputSizes } from './assets/inputSizes'

export default {
  title: 'Example/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: 'Standard textarea field'
      }
    }
  },
  args: {
    modelValue: '',
    size: 'normal',
    placeholder: 'Placeholder'
  },
  argTypes: {
    modelValue: {
      control: { type: 'text' }
    },
    size: {
      control: { type: 'select' },
      options: inputSizes
    },
    placeholder: {
      control: { type: 'text' },
      defaultValue: 'Placeholder'
    },
    required: {
      control: { type: 'boolean' }
    },
    disabled: {
      control: { type: 'boolean' }
    },
    readonly: {
      control: { type: 'boolean' }
    }
  }
} as Meta<typeof Textarea>

export const Default: StoryObj<typeof Textarea> = {}

export const Disabled: StoryObj<typeof Textarea> = {
  args: { disabled: true }
}

export const Readonly: StoryObj<typeof Textarea> = {
  args: { readonly: true, modelValue: 'Readonly text' }
}

export const Invalid: StoryObj<typeof Textarea> = {
  args: { invalid: true }
}
