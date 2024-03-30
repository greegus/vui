import { ref } from 'vue'
import { StoryObj, type Meta, type StoryFn } from '@storybook/vue3'

import CheckboxGroup from '../components/CheckboxGroup.vue'
import DumpValue from './helpers/components/DumpValue.vue'
import { objectOptions, plainObjectOptions } from './assets/options'

export default {
  title: 'Example/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {
    docs: {
      description: {
        component: 'Standard checkboxgroup'
      }
    }
  },
  args: {
    options: objectOptions,
    optionValue: 'value',
    optionLabel: 'label',
    optionDescription: 'description',
    optionDisabled: 'disabled'
  }
} as Meta<typeof CheckboxGroup>

const TemplateWithDumpValue: StoryFn<typeof CheckboxGroup> = (args) => ({
  components: { CheckboxGroup, DumpValue },
  setup: () => ({ args, value: ref() }),
  template: `
    <CheckboxGroup v-bind="args" v-model="value" />
    <DumpValue :value="value" hide-type />
  `
})

export const Default: StoryObj<typeof CheckboxGroup> = {
  render: TemplateWithDumpValue
}

export const ValueCasting: StoryObj<typeof CheckboxGroup> = {
  args: { options: plainObjectOptions, type: 'number' },
  render: TemplateWithDumpValue
}
