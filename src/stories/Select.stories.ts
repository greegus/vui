import { type Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import Select from "../components/Select.vue";
import { type ValueParser as ValueParserType } from "../types";
import { inputSizes } from "./assets/inputSizes";
import { groupedOptions, plainArrayOptions, plainObjectOptions } from "./assets/options";
import DumpValue from "./helpers/components/DumpValue.vue";

export default {
  title: "Example/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component: "Standard select field",
      },
    },
  },
  args: {
    placeholder: "Select an option...",
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
      defaultValue: "value",
    },
    optionLabel: {
      control: { type: "text" },
      defaultValue: "label",
    },
    optionDisabled: {
      control: { type: "text" },
      defaultValue: "disabled",
    },
    placeholder: {
      control: { type: "text" },
      defaultValue: "Select an option...",
    },
    required: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} as Meta<typeof Select>;

export const Default: StoryObj<typeof Select> = {};

export const Disabled: StoryObj<typeof Select> = {
  args: { disabled: true },
};

export const Invalid: StoryObj<typeof Select> = {
  args: { invalid: true },
};

export const Groups: StoryObj<typeof Select> = {
  args: { options: groupedOptions, groupOptions: "options", groupLabel: "label" },
};

export const Sizes: StoryObj<typeof Select> = {
  render: (args) => ({
    components: { Select },
    setup: () => ({ args, value: ref() }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 0.5rem">
        <Select v-bind="args" v-model="value" size="small" />
        <Select v-bind="args" v-model="value" size="normal" />
        <Select v-bind="args" v-model="value" size="large" />
      </div>
    `,
  }),
};

export const ValueCasting: StoryObj<typeof Select> = {
  args: { options: plainObjectOptions, type: "number" },
  render: (args) => ({
    components: { Select, DumpValue },
    setup: () => ({ args, value: ref<number>(1) }),
    template: `
      <Select v-model="value" v-bind="args" />
      <DumpValue :value="value" />
    `,
  }),
};

export const ValueParser: StoryObj<typeof Select> = {
  render: (args) => ({
    components: { Select, DumpValue },
    setup: () => {
      const options = [new Date("2021-01-01"), new Date("2022-01-01"), new Date("2023-01-01")];

      const valueParser: ValueParserType<Date> = {
        stringify: (value) => (value ? value.toISOString() : ""),
        parse: (value) => (value ? new Date(value) : undefined),
      };

      return {
        args: { ...args, options, valueParser, optionLabel: (value) => value.getFullYear() },
        value: ref<Date>(),
      };
    },
    template: `
      <Select v-model="value" v-bind="args" />
      <DumpValue :value="value" />
    `,
  }),
};
