import { ref } from "vue";
import { type Meta, type StoryObj } from "@storybook/vue3-vite";

import Input from "../components/Input.vue";
import { DateValueParser } from "../valueParsers/dateValueParser";
import { NumberValueParser } from "../valueParsers/numberValueParser";
import { icons } from "./assets/icons";
import { inputSizes } from "./assets/inputSizes";

export default {
  title: "Components/Input",
  component: Input,
  parameters: {
    docs: {
      description: {
        component: `Standard input field.

Supports \`valueParser\` prop for typed bindings with date/number inputs.
See [Value Parsers Guide](?path=/docs/guides-value-parsers--docs) for details.`,
      },
    },
  },
  args: {
    modelValue: "",
    size: "normal",
    placeholder: "Placeholder",
  },
  argTypes: {
    modelValue: {
      control: { type: "text" },
    },
    size: {
      control: { type: "select" },
      options: inputSizes,
    },
    prefixIcon: {
      control: { type: "select" },
      options: icons,
    },
    suffixIcon: {
      control: { type: "select" },
      options: icons,
    },
    placeholder: {
      control: { type: "text" },
      defaultValue: "Placeholder",
    },
    required: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    readonly: {
      control: { type: "boolean" },
    },
  },
} as Meta<typeof Input>;

export const Default: StoryObj<typeof Input> = {};

export const Disabled: StoryObj<typeof Input> = {
  args: { disabled: true },
};

export const Readonly: StoryObj<typeof Input> = {
  args: { readonly: true },
};

export const Invalid: StoryObj<typeof Input> = {
  args: { invalid: true },
};

export const PrefixIcon: StoryObj<typeof Input> = {
  args: { prefixIcon: "mail" },
};

export const SuffixIcon: StoryObj<typeof Input> = {
  args: { suffixIcon: "x" },
};

export const Pill: StoryObj<typeof Input> = {
  args: { pill: true },
};

export const Sizes: StoryObj<typeof Input> = {
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: .5rem;">
        <Input v-bind="args" size="small" />
        <Input v-bind="args" />
        <Input v-bind="args" size="large" />
      </div>
    `,
  }),
};

/**
 * Use `DateValueParser` to bind a `Date` object instead of a string.
 * The parser converts between `Date` and the `YYYY-MM-DD` format used by date inputs.
 */
export const DateWithParser: StoryObj<typeof Input> = {
  render: () => ({
    components: { Input },
    setup: () => {
      const date = ref<Date>(new Date());
      return { date, DateValueParser };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: .5rem;">
        <Input type="date" v-model="date" :value-parser="DateValueParser" />
        <div style="font-size: 12px; color: #666;">
          <strong>Bound value:</strong> {{ date }}<br>
          <strong>Type:</strong> {{ date?.constructor?.name }}
        </div>
      </div>
    `,
  }),
};

/**
 * Use `NumberValueParser` to bind a `number` instead of a string.
 * The parser converts between `number` and string formats.
 */
export const NumberWithParser: StoryObj<typeof Input> = {
  render: () => ({
    components: { Input },
    setup: () => {
      const value = ref<number>(42);
      return { value, NumberValueParser };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: .5rem;">
        <Input type="number" v-model="value" :value-parser="NumberValueParser" />
        <div style="font-size: 12px; color: #666;">
          <strong>Bound value:</strong> {{ value }}<br>
          <strong>Type:</strong> {{ typeof value }}
        </div>
      </div>
    `,
  }),
};
