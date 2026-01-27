import { type Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import type { Option } from "../types";

import Autocomplete from "../components/Autocomplete.vue";
import { inputSizes } from "./assets/inputSizes";
import { groupedOptions, objectOptions, plainArrayOptions, plainObjectOptions } from "./assets/options";
import DumpValue from "./helpers/components/DumpValue.vue";

export default {
  title: "Example/Autocomplete",
  component: Autocomplete,
  parameters: {
    docs: {
      description: {
        component: "Autocomplete input with dropdown suggestions and keyboard navigation",
      },
    },
  },
  args: {
    placeholder: "Search...",
    size: "normal",
    options: plainArrayOptions,
  },
  argTypes: {
    modelValue: {
      control: { type: "text" },
    },
    size: {
      control: { type: "select" },
      options: inputSizes,
    },
    options: {
      control: { type: "object" },
      defaultValue: plainArrayOptions,
    },
    optionValue: {
      control: { type: "text" },
    },
    optionLabel: {
      control: { type: "text" },
    },
    optionDisabled: {
      control: { type: "text" },
    },
    optionDescription: {
      control: { type: "text" },
    },
    placeholder: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    invalid: {
      control: { type: "boolean" },
    },
    pill: {
      control: { type: "boolean" },
    },
  },
} as Meta<typeof Autocomplete>;

export const Default: StoryObj<typeof Autocomplete> = {
  render: (args) => ({
    components: { Autocomplete, DumpValue },
    setup: () => ({ args, value: ref() }),
    template: `
      <Autocomplete v-bind="args" v-model="value" />
      <DumpValue :value="value" />
    `,
  }),
};

export const Disabled: StoryObj<typeof Autocomplete> = {
  args: { disabled: true },
};

export const Invalid: StoryObj<typeof Autocomplete> = {
  args: { invalid: true },
};

export const WithSuffixIcon: StoryObj<typeof Autocomplete> = {
  args: { suffixIcon: "triangle-down" },
};

export const Pill: StoryObj<typeof Autocomplete> = {
  args: { pill: true },
};

export const Sizes: StoryObj<typeof Autocomplete> = {
  render: (args) => ({
    components: { Autocomplete },
    setup: () => ({ args, value: ref() }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 0.5rem">
        <Autocomplete v-bind="args" v-model="value" size="small" placeholder="Small" />
        <Autocomplete v-bind="args" v-model="value" size="normal" placeholder="Normal" />
        <Autocomplete v-bind="args" v-model="value" size="large" placeholder="Large" />
      </div>
    `,
  }),
};

export const ObjectOptions: StoryObj<typeof Autocomplete> = {
  args: {
    options: objectOptions,
    optionValue: "value",
    optionLabel: "label",
    optionDisabled: "disabled",
  },
  render: (args) => ({
    components: { Autocomplete, DumpValue },
    setup: () => ({ args, value: ref() }),
    template: `
      <Autocomplete v-bind="args" v-model="value" />
      <DumpValue :value="value" />
    `,
  }),
};

export const WithDescriptions: StoryObj<typeof Autocomplete> = {
  args: {
    options: objectOptions,
    optionValue: "value",
    optionLabel: "label",
    optionDisabled: "disabled",
    optionDescription: "description",
  },
  render: (args) => ({
    components: { Autocomplete, DumpValue },
    setup: () => ({ args, value: ref() }),
    template: `
      <Autocomplete v-bind="args" v-model="value" />
      <DumpValue :value="value" />
    `,
  }),
};

export const PlainObjectOptions: StoryObj<typeof Autocomplete> = {
  args: {
    options: plainObjectOptions,
  },
  render: (args) => ({
    components: { Autocomplete, DumpValue },
    setup: () => ({ args, value: ref() }),
    template: `
      <Autocomplete v-bind="args" v-model="value" />
      <DumpValue :value="value" />
    `,
  }),
};

export const GroupedOptions: StoryObj<typeof Autocomplete> = {
  args: {
    options: groupedOptions,
    groupOptions: "options",
    groupLabel: "label",
  },
  render: (args) => ({
    components: { Autocomplete, DumpValue },
    setup: () => ({ args, value: ref() }),
    template: `
      <Autocomplete v-bind="args" v-model="value" />
      <DumpValue :value="value" />
    `,
  }),
};

export const CustomFilter: StoryObj<typeof Autocomplete> = {
  render: (args) => ({
    components: { Autocomplete, DumpValue },
    setup: () => {
      const value = ref();

      // Custom filter that only matches from the beginning of the string
      const startsWithFilter = (option: Option, query: string) => {
        if (!query) return true;
        return String(option.label).toLowerCase().startsWith(query.toLowerCase());
      };

      return { args, value, startsWithFilter };
    },
    template: `
      <p style="margin-bottom: 0.5rem; color: #666;">Custom filter: only matches options that <strong>start with</strong> the query</p>
      <Autocomplete v-bind="args" v-model="value" :filter="startsWithFilter" />
      <DumpValue :value="value" />
    `,
  }),
};

export const CustomOptionSlot: StoryObj<typeof Autocomplete> = {
  args: {
    options: [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", avatar: "https://i.pravatar.cc/40?u=alice" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", avatar: "https://i.pravatar.cc/40?u=bob" },
      { id: 3, name: "Carol Williams", email: "carol@example.com", avatar: "https://i.pravatar.cc/40?u=carol" },
      { id: 4, name: "David Brown", email: "david@example.com", avatar: "https://i.pravatar.cc/40?u=david" },
    ],
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Search users...",
  },
  render: (args) => ({
    components: { Autocomplete, DumpValue },
    setup: () => ({ args, value: ref() }),
    template: `
      <Autocomplete v-bind="args" v-model="value">
        <template #option="{ option, isHighlighted }">
          <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.25rem 0;">
            <img
              :src="option.data.avatar"
              :alt="option.label"
              style="width: 32px; height: 32px; border-radius: 50%;"
            />
            <div>
              <div style="font-weight: 500;">{{ option.label }}</div>
              <div style="font-size: 0.875em; opacity: 0.7;">{{ option.data.email }}</div>
            </div>
          </div>
        </template>
      </Autocomplete>
      <DumpValue :value="value" />
    `,
  }),
};

export const WithFunctionExtractors: StoryObj<typeof Autocomplete> = {
  render: (args) => ({
    components: { Autocomplete, DumpValue },
    setup: () => {
      const value = ref();

      const users = [
        { id: 1, firstName: "John", lastName: "Doe" },
        { id: 2, firstName: "Jane", lastName: "Smith" },
        { id: 3, firstName: "Bob", lastName: "Johnson" },
      ];

      return {
        args: {
          ...args,
          options: users,
          optionValue: "id",
          optionLabel: (user: (typeof users)[0]) => `${user.firstName} ${user.lastName}`,
          placeholder: "Search by full name...",
        },
        value,
      };
    },
    template: `
      <Autocomplete v-bind="args" v-model="value" />
      <DumpValue :value="value" />
    `,
  }),
};

export const PreselectedValue: StoryObj<typeof Autocomplete> = {
  args: {
    options: objectOptions,
    optionValue: "value",
    optionLabel: "label",
  },
  render: (args) => ({
    components: { Autocomplete, DumpValue },
    setup: () => {
      const value = ref(objectOptions[1].label);
      return { args, value };
    },
    template: `
      <Autocomplete v-bind="args" v-model="value" />
      <DumpValue :value="value" />
    `,
  }),
};
