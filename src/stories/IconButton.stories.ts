import { type Meta, StoryObj } from '@storybook/vue3-vite'

import IconButton from '../components/IconButton.vue'
import { icons } from './assets/icons'

export default {
  title: 'Example/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Standard IconButton'
      }
    }
  },
  argTypes: {
    icon: {
      control: 'select',
      options: icons
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large']
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'danger', 'success']
    },
    block: {
      control: 'boolean'
    },
    pill: {
      control: 'boolean'
    }
  },
  args: {
    variant: 'primary',
    icon: 'check'
  }
} as Meta<typeof IconButton>

export const Default = {}

export const Disabled: StoryObj<typeof IconButton> = {
  args: { disabled: true }
}

export const Loading: StoryObj<typeof IconButton> = {
  args: { loading: true }
}

export const Pill: StoryObj<typeof IconButton> = {
  args: { pill: true }
}

export const Sizes: StoryObj<typeof IconButton> = {
  render: (args) => ({
    components: { IconButton },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 1rem;">
        <IconButton v-bind="args" size="small" />
        <IconButton v-bind="args" size="normal" />
        <IconButton v-bind="args" size="large" />
      </div>
    `
  })
}

export const Variants: StoryObj<typeof IconButton> = {
  render: (args) => ({
    components: { IconButton },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-flow: column;  gap: 1rem;">
        <IconButton v-bind="args" variant="default" />
        <IconButton v-bind="args" variant="primary" />
        <IconButton v-bind="args" variant="secondary" />
        <IconButton v-bind="args" variant="danger" />
        <IconButton v-bind="args" variant="success" />
      </div>
    `
  })
}
