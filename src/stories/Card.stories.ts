import { type Meta, StoryObj } from '@storybook/vue3-vite'

import Button from '../components/Button.vue'
import Card from '../components/Card.vue'
import IconButton from '../components/IconButton.vue'

export default {
  title: 'Components/Card',
  component: Card,
  // Default Card stories to the subtle gray backdrop so the (transparent-bordered) card stands out.
  globals: {
    backgrounds: { value: 'gray' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Simple content container with an optional header (title + tools) and a body. Shares padding and border-radius tokens with Dialog.',
      },
    },
  },

  argTypes: {
    title: { control: { type: 'text' } },
  },

  args: {
    title: 'Profile',
  },
} as Meta<typeof Card>

export const Default: StoryObj<typeof Card> = {
  render: (args) => ({
    components: { Card, Button },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" style="max-width: 28rem">
        This is the card body content.

        <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem">
          <Button variant="primary" label="Show more" />
        </div>
      </Card>
    `,
  }),
}

export const WithTools: StoryObj<typeof Card> = {
  args: { title: 'Members' },
  render: (args) => ({
    components: { Card, IconButton },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" style="max-width: 28rem">
        <template #tools>
          <IconButton icon="plus" title="Add member" />
        </template>
        Three members in this workspace.
      </Card>
    `,
  }),
}

export const CustomTitle: StoryObj<typeof Card> = {
  render: () => ({
    components: { Card },
    template: `
      <Card style="max-width: 28rem">
        <template #title><strong style="color: var(--vuiii-color-primary)">★ Featured</strong></template>
        Custom title content via the title slot.
      </Card>
    `,
  }),
}

export const CustomHeader: StoryObj<typeof Card> = {
  render: () => ({
    components: { Card },
    template: `
      <Card style="max-width: 28rem">
        <template #header>
          <div>
            <div style="font-weight: 600">Acme Inc.</div>
            <div style="opacity: .65; font-size: .85em">Enterprise plan</div>
          </div>
        </template>
        <template #tools><span style="opacity:.65">⋯</span></template>
        Full custom header region.
      </Card>
    `,
  }),
}

export const Outlined: StoryObj<typeof Card> = {
  args: { title: 'Outlined' },
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" style="max-width: 28rem; --vuiii-card-borderColor: var(--vuiii-divider-color)">
        Override --vuiii-card-borderColor to get a visible (outlined) border.
      </Card>
    `,
  }),
}

export const NoHeader: StoryObj<typeof Card> = {
  args: { title: undefined },
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" style="max-width: 28rem; --vuiii-card-borderColor: var(--vuiii-divider-color)">
        Body-only card (no title, no header).
      </Card>
    `,
  }),
}
