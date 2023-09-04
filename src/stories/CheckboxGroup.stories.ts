import { Meta, StoryFn } from '@storybook/vue3'

import CheckboxGroup from '@/components/CheckboxGroup.vue'

import { options } from './options'

export default {
  title: 'Example/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {
    docs: {
      description: {
        component: 'Standard checkboxgroup'
      }
    }
  }
} as Meta<typeof CheckboxGroup>

const Template: StoryFn<typeof CheckboxGroup> = () => ({
  components: { CheckboxGroup },
  setup: () => ({
    options
  }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
            <CheckboxGroup :options="options" label="Subscribe to newsletter" option-value="value" option-label="label" option-description="description" option-disabled="disabled" />
        </div>
    </div>
  `
})

export const Default = {
  render: Template
}
