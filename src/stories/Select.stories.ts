import { type Meta, type StoryFn } from '@storybook/vue3'

import Select from '../components/Select.vue'
import DumpValue from './helpers/components/DumpValue.vue'
import { groupedOptions, objectOptions, plainArrayOptions } from './assets/options'
import { ref } from 'vue'
import { Parser } from '../types'

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
    size: 'normal',
    options: plainArrayOptions
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
      defaultValue: plainArrayOptions
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
    }
  }
} as Meta<typeof Select>

const Template: StoryFn<typeof Select> = (args) => ({
  components: { Select },
  setup: () => ({ args, value: ref() }),
  template: `
    <Select v-bind="args" v-model="value" />
  `
})

export const Default = {
  render: Template
}

export const Sizes = {
  render: (args) => ({
    components: { Select },
    setup: () => ({ args, value: ref() }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 0.5rem">
        <Select v-bind="args" v-model="value" size="small" />
        <Select v-bind="args" v-model="value" size="normal" />
        <Select v-bind="args" v-model="value" size="large" />
      </div>
    `
  })
}

export const Disabled = {
  args: { disabled: true },
  render: Template
}

export const Groups = {
  args: { options: groupedOptions, groupOptions: 'options', groupLabel: 'label' },
  render: Template
}

export const ValueCasting = {
  render: (args) => ({
    components: { Select, DumpValue },
    setup: () => {
      const options = [1, 2, 3]

      return {
        args: { ...args, options },
        value: ref<number>(2)
      }
    },
    template: `
      <Select v-model="value" v-bind="args" type="number" />
      <DumpValue :value="value" />
    `
  })
}

export const ValueParser = {
  render: (args) => ({
    components: { Select, DumpValue },
    setup: () => {
      const options = [new Date('2021-01-01'), new Date('2022-01-01'), new Date('2023-01-01')]

      const valueParser: Parser<Date> = {
        stringify: (value) => (value ? value.toISOString() : ''),
        parse: (value) => (value ? new Date(value) : undefined)
      }

      return {
        args: { ...args, options, valueParser, optionLabel: (value) => value.getFullYear() },
        value: ref<Date>()
      }
    },
    template: `
      <Select v-model="value" v-bind="args" />
      <DumpValue :value="value" />
    `
  })
}
