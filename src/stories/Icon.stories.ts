import { type Meta, type StoryFn } from '@storybook/vue3'

import Icon from '../components/Icon.vue'
import { icons } from './assets/icons'

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Example/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: 'Standard icon'
      }
    }
  }
} as Meta<typeof Icon>

const Template: StoryFn<typeof Icon> = () => ({
  components: { Icon },
  setup: () => ({ icons }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div v-for="icon in icons" :key="icons" style="display: flex; gap: 0.5rem; align-items: center">
        <Icon :name="icon" style="width: 32px" />
        <div>{{ icon }}</div>
      </div>
    </div>
  `
})

export const Default = {
  render: Template
}
