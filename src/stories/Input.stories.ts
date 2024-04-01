import { type Meta,StoryObj } from '@storybook/vue3'

import Input from '../components/Input.vue'
import { icons } from './assets/icons'
import { inputSizes } from './assets/inputSizes'

export default {
  title: 'Example/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: 'Standard input field'
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
    prefixIcon: {
      control: { type: 'select' },
      options: icons
    },
    suffixIcon: {
      control: { type: 'select' },
      options: icons
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
} as Meta<typeof Input>

export const Default: StoryObj<typeof Input> = {}

export const Disabled: StoryObj<typeof Input> = {
  args: { disabled: true }
}

export const Readonly: StoryObj<typeof Input> = {
  args: { readonly: true }
}

export const Invalid: StoryObj<typeof Input> = {
  args: { invalid: true }
}

export const PrefixIcon: StoryObj<typeof Input> = {
  args: { prefixIcon: 'mail' }
}

export const SuffixIcon: StoryObj<typeof Input> = {
  args: { suffixIcon: 'x' }
}

export const Pill: StoryObj<typeof Input> = {
  args: { pill: true }
}

export const Sizes: StoryObj<typeof Input> = {
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: .5rem;">
        <Input v-bind="args" size="small" />
        <Input v-bind="args" />
        <Input v-bind="args" size="large" />
      </div>
    `
  })
}
