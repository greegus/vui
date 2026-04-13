import { type Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Icon from '../components/Icon.vue'
import { icons } from './assets/icons'
import { iconSizes } from './assets/iconSizes'

export default {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: 'Standard icon',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: icons,
    },
    size: {
      control: 'select',
      options: iconSizes,
    },
  },
  args: {
    name: 'spinner',
    size: 'normal',
  },
} as Meta<typeof Icon>

export const Default: StoryObj<typeof Icon> = {}

export const DynamicName: StoryObj<typeof Icon> = {
  render: (args) => ({
    components: { Icon },
    setup: () => {
      const currentIcon = ref(icons[0])
      return { icons, currentIcon, args }
    },
    template: `
      <div style="display: flex; flex-flow: column; gap: 1rem; align-items: flex-start;">
        <select v-model="currentIcon" style="padding: 0.25rem 0.5rem;">
          <option v-for="icon in icons" :key="icon" :value="icon">{{ icon }}</option>
        </select>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <Icon v-bind="args" :name="currentIcon" />
          <span>{{ currentIcon }}</span>
        </div>
      </div>
    `,
  }),
}

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
    `,
  }),
}
