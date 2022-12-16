import { Meta, StoryFn } from '@storybook/vue3'

import Icon from '../components/Icon.vue'
import { icons } from './icons'

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

const Template: StoryFn<typeof Icon> = (args) => ({
  components: { Icon },
  setup: () => ({ icons }),
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
      <Icon :name="icon" v-for="icon in icons" :key="icons" />
    </div>
  `
})

export const Default = Template.bind({})
