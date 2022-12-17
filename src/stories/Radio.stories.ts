import { Meta, StoryFn } from '@storybook/vue3'

import Radio from '../components/Radio.vue'
import { options } from './options'

export default {
  title: 'Example/Radio',
  component: Radio,
  parameters: {
    docs: {
      description: {
        component: 'Standard radio'
      }
    }
  }
} as Meta<typeof Radio>

const Template: StoryFn<typeof Radio> = (args) => ({
  components: { Radio },
  setup: () => ({
    options
  }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
            <Radio :options="options" label="Subscribe to newsletter" option-value="value" option-label="label" option-description="description" option-disabled="disabled" />
        </div>
    </div>
  `
})

export const Default = Template.bind({})
