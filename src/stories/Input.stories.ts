import { action } from '@storybook/addon-actions'
import { Meta, StoryFn } from '@storybook/vue3'

import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import { icons } from './assets/icons'

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
    size: 'normal'
  },
  argTypes: {
    modelValue: {
      control: { type: 'text' }
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'normal', 'large']
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

const DefaultTeplate: StoryFn<typeof Input> = () => ({
  components: { Input, Button },
  setup: () => ({
    action
  }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; flex-direction: column; gap: .5rem;">
            <Input placeholder="First name" />
            <Input placeholder="Email address" prefix-icon="mail" />
            <Input placeholder="Search" prefix-icon="search" suffix-icon="x" @suffix-icon-click="action('@suffix-icon-click')" />
            <Input placeholder="username">
                <template #prefix>
                    <div style="display: flex; align-items:center; padding-left: 1rem; margin-right: -1.35rem">
                        facebook.com/
                    </div>
                </template>
            </Input>
            <Input placeholder="First name" invalid />
            <Input placeholder="First name" disabled />
        </div>

        <div>
          <h3>Sizes</h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div style="display: flex; flex-direction: column; gap: .5rem;">
                <Input placeholder="First name" size="small" />
                <Input placeholder="First name" />
                <Input placeholder="First name" size="large" />
            </div>

            <div style="display: flex; flex-direction: column; gap: .5rem;">
                <Input placeholder="Search" prefix-icon="search" suffix-icon="x" @suffix-icon-click="action('@suffix-icon-click')" size="small" />
                <Input placeholder="Search" prefix-icon="search" suffix-icon="x" @suffix-icon-click="action('@suffix-icon-click')" />
                <Input placeholder="Search" prefix-icon="search" suffix-icon="x" @suffix-icon-click="action('@suffix-icon-click')" size="large" />
            </div>
          </div>
        </div>

        <div>
          <h3>Pill version</h3>

          <div style="display: flex; align-items: center; gap: 1rem">
            <Input pill prefix-icon="mail" placeholder="Your email" />
            <Button pill variant="primary">Subscribe</Button>
          </div>
        </div>
    </div>
  `
})

export const Default = {
  render: DefaultTeplate
}

const PlaygroundTemplate: StoryFn<typeof Input> = (args) => ({
  components: { Input },
  setup: () => ({ args }),
  template: '<Input v-bind="args" />'
})

export const Playground = {
  render: PlaygroundTemplate
}
