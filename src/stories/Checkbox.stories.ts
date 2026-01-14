import { type Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import Checkbox from "../components/Checkbox.vue";
import DumpValue from "./helpers/components/DumpValue.vue";

export default {
  title: "Example/Checkbox",
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: "Standard checkbox",
      },
    },
  },
  args: {
    label: "Agree with terms and conditions",
  },
} as Meta<typeof Checkbox>;

export const Default: StoryObj<typeof Checkbox> = {};

export const Disabled: StoryObj<typeof Checkbox> = {
  args: { disabled: true },
};

export const Description: StoryObj<typeof Checkbox> = {
  args: { description: "Lorem ipsum dolor sid amed melonis quo." },
};

export const Switch: StoryObj<typeof Checkbox> = {
  args: { switch: true },
};

export const Sizes: StoryObj<typeof Checkbox> = {
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 4rem">
        <div style="display: flex; flex-flow: column; gap: 1rem">
          <Checkbox v-bind="args" size="small" />
          <Checkbox v-bind="args" size="normal" />
          <Checkbox v-bind="args" size="large" />
        </div>

        <div style="display: flex; flex-flow: column; gap: 1rem">
          <Checkbox v-bind="args" size="small" switch />
          <Checkbox v-bind="args" size="normal" switch />
          <Checkbox v-bind="args" size="large" switch />
        </div>
      </div>
    `,
  }),
};

export const CustomLabelSlot: StoryObj<typeof Checkbox> = {
  render: () => ({
    components: { Checkbox },
    template: `
      <Checkbox required>
        Agree with <a href="#" target="_blank" @click.prevent>terms and conditions</a>
      </Checkbox>
    `,
  }),
};

export const ValueParsing: StoryObj<typeof Checkbox> = {
  args: {
    valueParser: {
      stringify: (rawValue) => rawValue === "yes",
      parse: (serializedValue) => (serializedValue ? "yes" : "no"),
    },
  },
  render: (args) => ({
    components: { Checkbox, DumpValue },
    setup: () => ({ args, value: ref("yes") }),
    template: `
      <div>
        <Checkbox v-bind="args" v-model="value" />
        <DumpValue :value="value" />
      </div>
    `,
  }),
};

export const CustomCheckboxSymbol: StoryObj<typeof Checkbox> = {
  render: () => ({
    components: { Checkbox },
    template: `
      <Checkbox label="Custom checkbox">
        <template #checkbox="{ checked }">
          <span>{{ checked ? '[ ]' : '[x]' }}</span>
        </template>
      </Checkbox>
    `,
  }),
};
