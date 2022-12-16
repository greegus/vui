import { Meta, StoryFn } from '@storybook/vue3'

import Select from '../components/Select.vue'

const options: { value: string; label: string; disabled?: boolean }[] = [
  { value: 'first', label: 'First option' },
  { value: 'second', label: 'Second option' },
  { value: 'third', label: 'Third option', disabled: true }
]

const plainOptions: string[] = ['First option', 'Second option', 'Third option']

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
      options: ['small', 'normal', 'large', 'xlarge']
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

const Template: StoryFn<typeof Select> = (args) => ({
  components: { Select },
  setup: () => ({ args }),
  template: '<Select v-bind="args" />'
})

export const Playground = Template.bind({})

const GalleryTeplate: StoryFn<typeof Select> = () => ({
  components: { Select },
  setup: () => ({
    options,
    plainOptions
  }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; flex-direction: column; gap: .5rem;">
            <Select placeholder="Select an option…" :options="options" option-value="value" option-label="label" />
      </div>

        <div>
          <h3>Sizes</h3>

          <div style="display: flex; flex-direction: column; gap: .5rem;">
              <Select :options="plainOptions" placeholder="Select an option…" :options="options" size="small" />
              <Select :options="plainOptions" placeholder="Select an option…" :options="options" />
              <Select :options="plainOptions" placeholder="Select an option…" :options="options" size="large" />
              <Select :options="plainOptions" placeholder="Select an option…" :options="options" size="xlarge" />
          </div>
        </div>
    </div>
  `
})

export const Gallery = GalleryTeplate.bind({})

Gallery.storyName = 'Showcase of input fields'
