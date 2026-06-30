import { type Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import RadioButtonGroup from '../components/RadioButtonGroup.vue'
import { objectOptions, plainArrayOptions, plainObjectOptions } from './assets/options'
import DumpValue from './helpers/components/DumpValue.vue'

const iconOptions = [
  { value: 'list', label: 'List', icon: 'list-bullet' },
  { value: 'grid', label: 'Grid', icon: 'squares-2x2' },
  { value: 'table', label: 'Table', icon: 'table-cells' },
]

export default {
  title: 'Components/RadioButtonGroup',
  component: RadioButtonGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Button-styled radio group for single selection with visual button appearance. Each option is rendered as a Button within a ButtonGroup.',
      },
    },
  },

  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'normal', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    options: {
      control: { type: 'object' },
    },
  },

  args: {
    options: plainArrayOptions,
    modelValue: 'First option',
  },
} as Meta<typeof RadioButtonGroup>

export const Default: StoryObj<typeof RadioButtonGroup> = {}

export const Disabled: StoryObj<typeof RadioButtonGroup> = {
  args: { disabled: true },
}

export const Sizes: StoryObj<typeof RadioButtonGroup> = {
  render: (args) => ({
    components: { RadioButtonGroup },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 1rem;">
        <RadioButtonGroup v-bind="args" size="small" />
        <RadioButtonGroup v-bind="args" size="normal" />
        <RadioButtonGroup v-bind="args" size="large" />
      </div>
    `,
  }),
}

export const Variants: StoryObj<typeof RadioButtonGroup> = {
  render: (args) => ({
    components: { RadioButtonGroup },
    setup: () => ({ args, value: ref('First option') }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 1rem;">
        <RadioButtonGroup v-bind="args" v-model="value" variant="filled" />
        <RadioButtonGroup v-bind="args" v-model="value" variant="outlined" />
      </div>
    `,
  }),
}

export const WithIcons: StoryObj<typeof RadioButtonGroup> = {
  render: (args) => ({
    components: { RadioButtonGroup },
    setup: () => ({ args, value: ref('list'), iconOptions }),
    template: `
      <RadioButtonGroup
        v-bind="args"
        v-model="value"
        :options="iconOptions"
        option-value="value"
        option-label="label"
        option-icon="icon"
      />
    `,
  }),
}

export const OptionPropsMapping: StoryObj<typeof RadioButtonGroup> = {
  args: {
    options: objectOptions,
    modelValue: 'first',
    optionValue: 'value',
    optionLabel: 'label',
    optionDisabled: 'disabled',
    optionDescription: 'description',
  },
}

export const ValueCasting: StoryObj<typeof RadioButtonGroup> = {
  args: { options: plainObjectOptions },
  render: (args) => ({
    components: { RadioButtonGroup, DumpValue },
    setup: () => ({ args, value: ref(1) }),
    template: `
      <RadioButtonGroup v-bind="args" v-model="value" />
      <DumpValue :value="value" />
    `,
  }),
}
