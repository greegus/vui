import { type Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";

import Checkbox from "../components/Checkbox.vue";
import DumpValue from "./helpers/components/DumpValue.vue";

export default {
  title: "Components/Checkbox",
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

export const Indeterminate: StoryObj<typeof Checkbox> = {
  render: () => ({
    components: { Checkbox },
    setup: () => {
      const items = ref([false, true, false]);
      const allChecked = computed(() => items.value.every(Boolean));
      const indeterminate = computed(() => !allChecked.value && items.value.some(Boolean));

      function toggleAll() {
        const newValue = !allChecked.value;
        items.value = items.value.map(() => newValue);
      }

      return { items, allChecked, indeterminate, toggleAll };
    },
    template: `
      <div style="display: flex; flex-flow: column; gap: 0.5rem">
        <Checkbox
          label="Select all"
          :model-value="allChecked"
          :indeterminate="indeterminate"
          @update:model-value="toggleAll"
        />

        <div style="display: flex; flex-flow: column; gap: 0.5rem; margin-left: 1.5rem">
          <Checkbox v-model="items[0]" label="Item 1" />
          <Checkbox v-model="items[1]" label="Item 2" />
          <Checkbox v-model="items[2]" label="Item 3" />
        </div>
      </div>
    `,
  }),
};
