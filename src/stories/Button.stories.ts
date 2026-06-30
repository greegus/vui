import { type Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Button from '../components/Button.vue'
import ButtonGroupComponent from '../components/ButtonGroup.vue'
import { icons } from './assets/icons'

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Standard button',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'text'],
    },
    prefixIcon: {
      control: 'select',
      options: icons,
    },
    suffixIcon: {
      control: 'select',
      options: icons,
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
    label: 'Add to Cart',
  },
} as Meta<typeof Button>

export const Default = {}

export const Disabled: StoryObj<typeof Button> = {
  args: { disabled: true },
}

export const PrefixIcon: StoryObj<typeof Button> = {
  args: { prefixIcon: 'check' },
}

export const SuffixIcon: StoryObj<typeof Button> = {
  args: { suffixIcon: 'arrow-narrow-right' },
}

export const Loading: StoryObj<typeof Button> = {
  args: { loading: true },
}

export const Pill: StoryObj<typeof Button> = {
  args: { pill: true },
}

export const Link: StoryObj<typeof Button> = {
  args: { href: 'https://google.com', target: '_blank', label: 'Link to Google' },
}

export const ButtonGroup: StoryObj<typeof Button> = {
  render: () => ({
    components: { ButtonGroup: ButtonGroupComponent, Button },
    setup: () => ({ active: ref(0) }),
    template: `
      <ButtonGroup>
        <Button color="primary" :variant="active === 0 ? 'filled' : 'outlined'" @click="active = 0" label="First" />
        <Button color="primary" :variant="active === 1 ? 'filled' : 'outlined'" @click="active = 1" label="Second" />
        <Button color="primary" :variant="active === 2 ? 'filled' : 'outlined'" @click="active = 2" label="Third" />
      </ButtonGroup>
    `,
  }),
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
    `,
  }),
}

export const Colors: StoryObj<typeof Button> = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 1rem;">
        <Button color="primary" label="Primary" />
        <Button color="secondary" label="Secondary" />
        <Button color="success" label="Success" />
        <Button color="danger" label="Danger" />
      </div>
    `,
  }),
}

export const Variants: StoryObj<typeof Button> = {
  render: () => ({
    components: { Button },
    setup: () => ({ colors: ['primary', 'secondary', 'success', 'danger'] }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 1rem;">
        <div v-for="color in colors" :key="color" style="display: flex; gap: 1rem;">
          <Button :color="color" variant="filled" label="Filled" />
          <Button :color="color" variant="outlined" label="Outlined" />
          <Button :color="color" variant="text" label="Text" />
        </div>
      </div>
    `,
  }),
}
