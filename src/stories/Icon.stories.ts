import { type Meta, StoryObj } from '@storybook/vue3'

import Icon from '../components/Icon.vue'
import { icons } from './assets/icons'
import { iconSizes } from './assets/iconSizes'

export default {
  title: 'Example/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: 'Standard icon'
      }
    }
  },
  argTypes: {
    name: {
      control: 'select',
      options: icons
    },
    size: {
      control: 'select',
      options: iconSizes
    }
  },
  args: {
    name: 'spinner',
    size: 'normal'
  }
} as Meta<typeof Icon>

export const Default: StoryObj<typeof Icon> = {}

export const Gallery: StoryObj<typeof Icon> = {
  render: (args) => ({
    components: { Icon },
    setup: () => ({ icons, args }),
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 2rem;">
        <div v-for="icon in icons" :key="icons" style="display: flex; flex-flow: column; align-items: center; width: 6rem;">
          <div style="border: 1px solid #ddd; padding: .5rem; margin: 0 auto .25rem;">
            <Icon v-bind="args" :name="icon" />
          </div>

          <div style="text-align: center; font-size: 14px">{{ icon }}</div>
        </div>
      </div>
    `
  })
}
