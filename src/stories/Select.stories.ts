import { Meta, StoryFn } from '@storybook/vue3'

import Select from '../components/Select.vue'
import { groupedOptions, options, plainOptions } from './options'

export default {
  title: 'Example/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: 'Standard select field'
      }
    }
  },
  args: {
    placeholder: 'Select an option...',
    size: 'normal'
  },
  argTypes: {
    modelValue: {
      control: { type: 'text' }
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'normal', 'large']
    },
    options: {
      control: { type: 'object' },
      defaultValue: options
    },
    optionValue: {
      control: { type: 'text' },
      defaultValue: 'value'
    },
    optionLabel: {
      control: { type: 'text' },
      defaultValue: 'label'
    },
    optionDisabled: {
      control: { type: 'text' },
      defaultValue: 'disabled'
    },
    placeholder: {
      control: { type: 'text' },
      defaultValue: 'Select an option...'
    },
    required: {
      control: { type: 'boolean' }
    },
    disabled: {
      control: { type: 'boolean' }
    },
    readonly: {
      control: { type: 'boolean' }
    }
  }
} as Meta<typeof Select>

const DefaultTeplate: StoryFn<typeof Select> = () => ({
  components: { Select },
  setup: () => ({
    options,
    plainOptions,
    groupedOptions
  }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; flex-direction: column; gap: .5rem;">
          <Select placeholder="Select an option…" :options="options" option-value="value" option-label="label" option-disabled="disabled" required />
      </div>

        <div>
          <h3>Sizes</h3>

          <div style="display: flex; flex-direction: column; gap: .5rem;">
              <Select :options="plainOptions" placeholder="Select an option…" size="small" />
              <Select :options="plainOptions" placeholder="Select an option…" />
              <Select :options="plainOptions" placeholder="Select an option…" size="large" />
          </div>
        </div>

        <div>
          <h3>Groups</h3>

          <Select :options="groupedOptions" placeholder="Select an option…" group-options="options" group-label="label" />
        </div>
    </div>
  `
})

export const Default = {
  render: DefaultTeplate
}

const PlaygroundTemplate: StoryFn<typeof Select> = (args) => ({
  components: { Select },
  setup: () => ({ args }),
  template: '<Select v-bind="args" />'
})

export const Playground = {
  render: PlaygroundTemplate
}
