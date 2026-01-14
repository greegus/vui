import { type Meta, setup, StoryObj } from '@storybook/vue3-vite'

import Typography from '../components/Typography.vue'

export default {
  title: 'Example/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Typography'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display',
        'heading1',
        'heading2',
        'heading3',
        'heading4',
        'heading5',
        'heading6',
        'body1',
        'body2',
        'label',
        'caption'
      ]
    },
    tag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'caption']
    }
  }
} as Meta<typeof Typography>

export const Display: StoryObj<typeof Typography> = {
  args: { variant: 'display' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Display</Typography>
    `
  })
}

export const Heading1: StoryObj<typeof Typography> = {
  args: { variant: 'heading1' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Heading1</Typography>
    `
  })
}

export const Heading2: StoryObj<typeof Typography> = {
  args: { variant: 'heading2' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Heading2</Typography>
    `
  })
}

export const Heading3: StoryObj<typeof Typography> = {
  args: { variant: 'heading3' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Heading3</Typography>
    `
  })
}

export const Heading4: StoryObj<typeof Typography> = {
  args: { variant: 'heading4' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Heading4</Typography>
    `
  })
}

export const Heading5: StoryObj<typeof Typography> = {
  args: { variant: 'heading5' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Heading5</Typography>
    `
  })
}

export const Heading6: StoryObj<typeof Typography> = {
  args: { variant: 'heading6' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Heading6</Typography>
    `
  })
}

export const Body1: StoryObj<typeof Typography> = {
  args: { variant: 'body1' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Body1</Typography>
    `
  })
}

export const Body2: StoryObj<typeof Typography> = {
  args: { variant: 'body2' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Body2</Typography>
    `
  })
}

export const Label: StoryObj<typeof Typography> = {
  args: { variant: 'label' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Label</Typography>
    `
  })
}

export const Caption: StoryObj<typeof Typography> = {
  args: { variant: 'caption' },
  render: (args) => ({
    setup: () => ({ args }),
    components: { Typography },
    template: `
        <Typography v-bind="args">Caption</Typography>
    `
  })
}
