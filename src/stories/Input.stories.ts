import { type Meta } from '@storybook/vue3'

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

export const Default = {}

export const Disabled = {
  args: { disabled: true }
}

export const Readonly = {
  args: { readonly: true }
}

export const Invalid = {
  args: { invalid: true }
}

export const PrefixIcon = {
  args: { prefixIcon: 'mail' }
}

export const SuffixIcon = {
  args: { suffixIcon: 'x' }
}

export const Pill = {
  args: { pill: true }
}

export const Sizes = {
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
