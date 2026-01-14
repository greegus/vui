import { type Meta, type StoryFn, StoryObj } from '@storybook/vue3-vite'

import FormGroup from '../components/FormGroup.vue'
import Input from '../components/Input.vue'

export default {
  title: 'Example/FormGroup',
  component: FormGroup,
  parameters: {
    docs: {
      description: {
        component: 'Standard FormGroup'
      }
    }
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' }
  },
  args: {
    label: 'Full name'
  }
} as Meta<typeof FormGroup>

const Template: StoryFn<typeof FormGroup> = (args) => ({
  components: { FormGroup, Input },
  setup: () => ({ args }),
  template: `
    <FormGroup v-bind="args">
      <Input placeholder="John Doe" :invalid="args.error" />
    </FormGroup>
  `
})

export const Default: StoryObj<typeof FormGroup> = {
  render: Template
}

export const Required: StoryObj<typeof FormGroup> = {
  args: { required: true },
  render: Template
}

export const Description: StoryObj<typeof FormGroup> = {
  args: { description: 'Please enter your full name' },
  render: Template
}

export const Hint: StoryObj<typeof FormGroup> = {
  args: { hint: 'Please enter your full name' },
  render: Template
}

export const Error: StoryObj<typeof FormGroup> = {
  args: { error: 'Full name is required' },
  render: Template
}
