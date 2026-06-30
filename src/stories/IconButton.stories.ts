import { type Meta, StoryObj } from '@storybook/vue3-vite'

import IconButton from '../components/IconButton.vue'
import { icons } from './assets/icons'

export default {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Standard IconButton',
      },
    },
  },
  argTypes: {
    icon: {
      control: 'select',
      options: icons,
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'accent'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'text'],
    },
    block: {
      control: 'boolean',
    },
    pill: {
      control: 'boolean',
    },
  },
  args: {
    color: 'primary',
    variant: 'filled',
    icon: 'check',
  },
} as Meta<typeof IconButton>

export const Default = {}

export const Disabled: StoryObj<typeof IconButton> = {
  args: { disabled: true },
}

export const Loading: StoryObj<typeof IconButton> = {
  args: { loading: true },
}

export const Pill: StoryObj<typeof IconButton> = {
  args: { pill: true },
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
    `,
  }),
}

export const Colors: StoryObj<typeof IconButton> = {
  render: (args) => ({
    components: { IconButton },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 1rem;">
        <IconButton v-bind="args" color="primary" />
        <IconButton v-bind="args" color="secondary" />
        <IconButton v-bind="args" color="success" />
        <IconButton v-bind="args" color="danger" />
      </div>
    `,
  }),
}

export const Variants: StoryObj<typeof IconButton> = {
  render: (args) => ({
    components: { IconButton },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 1rem;">
        <IconButton v-bind="args" variant="filled" />
        <IconButton v-bind="args" variant="outlined" />
        <IconButton v-bind="args" variant="text" />
      </div>
    `,
  }),
}
