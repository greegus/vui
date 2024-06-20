import { type Meta, StoryObj } from '@storybook/vue3'

import Button from '../components/Button.vue'
import { icons } from './assets/icons'

export default {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Standard button'
      }
    }
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'normal', 'large']
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'danger', 'success']
    },
    prefixIcon: {
      control: 'select',
      options: icons
    },
    suffixIcon: {
      control: 'select',
      options: icons
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
    label: 'Add to Cart'
  }
} as Meta<typeof Button>

export const Default = {}

export const Disabled: StoryObj<typeof Button> = {
  args: { disabled: true }
}

export const PrefixIcon: StoryObj<typeof Button> = {
  args: { prefixIcon: 'check' }
}

export const SuffixIcon: StoryObj<typeof Button> = {
  args: { suffixIcon: 'arrow-narrow-right' }
}

export const Loading: StoryObj<typeof Button> = {
  args: { loading: true }
}

export const Pill: StoryObj<typeof Button> = {
  args: { pill: true }
}

export const Link: StoryObj<typeof Button> = {
  args: { href: 'https://google.com', target: '_blank', label: 'Link to Google' }
}

export const Sizes: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 1rem;">
        <Button v-bind="args" size="small" />
        <Button v-bind="args" size="normal" />
        <Button v-bind="args" size="large" />
      </div>
    `
  })
}

export const Variants: StoryObj<typeof Button> = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-flow: column;  gap: 1rem;">
        <Button v-bind="args" variant="default" />
        <Button v-bind="args" variant="primary" />
        <Button v-bind="args" variant="secondary" />
        <Button v-bind="args" variant="danger" />
        <Button v-bind="args" variant="success" />
      </div>
    `
  })
}
