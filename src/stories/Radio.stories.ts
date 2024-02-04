import { Meta, StoryFn } from '@storybook/vue3'

import RadioGroup from '../components/RadioGroup.vue'
import { options } from './assets/options'

export default {
  title: 'Example/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component: 'Standard radio group'
      }
    }
  }
} as Meta<typeof RadioGroup>

const Template: StoryFn<typeof RadioGroup> = () => ({
  components: { RadioGroup },
  setup: () => ({
    options
  }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
            <RadioGroup :options="options" label="Subscribe to newsletter" option-value="value" option-label="label" option-description="description" option-disabled="disabled" />
        </div>
    </div>
  `
})

export const Default = {
  render: Template
}
