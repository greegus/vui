import { type Meta, type StoryFn, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import CheckboxGroup from "../components/CheckboxGroup.vue";
import { objectOptions, plainObjectOptions } from "./assets/options";
import DumpValue from "./helpers/components/DumpValue.vue";

export default {
  title: "Example/CheckboxGroup",
  component: CheckboxGroup,
  parameters: {
    docs: {
      description: {
        component: "Standard checkboxgroup",
      },
    },
  },
  args: {
    options: objectOptions,
    optionValue: "value",
    optionLabel: "label",
    optionDescription: "description",
    optionDisabled: "disabled",
  },
} as Meta<typeof CheckboxGroup>;

const TemplateWithDumpValue: StoryFn<typeof CheckboxGroup> = (args) => ({
  components: { CheckboxGroup, DumpValue },
  setup: () => ({ args, value: ref() }),
  template: `
    <CheckboxGroup v-bind="args" v-model="value" />
    <DumpValue :value="value" hide-type />
  `,
});

export const Default: StoryObj<typeof CheckboxGroup> = {
  render: TemplateWithDumpValue,
};

export const ValueCasting: StoryObj<typeof CheckboxGroup> = {
  args: {
    options: plainObjectOptions,
    optionValue: undefined,
    optionLabel: undefined,
    type: "number",
  },
  render: TemplateWithDumpValue,
};

export const Disabled: StoryObj<typeof CheckboxGroup> = {
  args: { disabled: true },
  render: TemplateWithDumpValue,
};

export const Sizes: StoryObj<typeof CheckboxGroup> = {
  render: (args) => ({
    components: { CheckboxGroup },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 4rem">
        <CheckboxGroup v-bind="args" size="small" />
        <CheckboxGroup v-bind="args" size="normal" />
        <CheckboxGroup v-bind="args" size="large" />
      </div>
    `,
  }),
};

export const CustomCheckboxSymbol: StoryObj<typeof CheckboxGroup> = {
  args: {
    options: objectOptions,
  },
  render: (args) => ({
    components: { CheckboxGroup, DumpValue },
    setup: () => ({ args, value: ref() }),
    template: `
      <CheckboxGroup v-bind="args" v-model="value">
        <template #symbol="{ checked }">
          {{ checked ? '[x]' : '[ ]' }}
        </template>
      </CheckboxGroup>
      <DumpValue :value="value" />
    `,
  }),
};
