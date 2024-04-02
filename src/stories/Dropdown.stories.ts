import { type Meta, StoryFn, StoryObj } from '@storybook/vue3'

import Dropdown from '../components/Dropdown.vue'
import DropdownMenu from '../components/DropdownMenu.vue'
import { icons } from './assets/icons'
import { plainArrayOptions } from './assets/options'

export default {
  title: 'Example/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Standard Dropdown'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text'
    },
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
    label: 'Dropdown',
    items: plainArrayOptions
  }
} as Meta<typeof Dropdown>

export const DefaultTemplate: StoryFn<typeof Dropdown> = (args) => ({
  components: { Dropdown, DropdownMenu },
  setup: () => ({ args }),
  template: `
    <Dropdown v-bind="args">
      <template #default="{close}">
        <DropdownMenu :items="args.items" @click-item="close()" />
      </template>
    </Dropdown>
  `
})

export const Default: StoryObj<typeof Dropdown> = {
  render: DefaultTemplate
}
export const Block: StoryObj<typeof Dropdown> = {
  args: { block: true },
  render: DefaultTemplate
}
