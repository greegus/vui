import { type Meta, StoryObj } from "@storybook/vue3-vite";

import Textarea from "../components/Textarea.vue";
import { icons } from "./assets/icons";
import { inputSizes } from "./assets/inputSizes";

export default {
  title: "Example/Textarea",
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: "Standard textarea field",
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
    invalid: {
      control: { type: "boolean" },
    },
    pill: {
      control: { type: "boolean" },
    },
  },
} as Meta<typeof Textarea>;

export const Default: StoryObj<typeof Textarea> = {};

export const Disabled: StoryObj<typeof Textarea> = {
  args: { disabled: true },
};

export const Readonly: StoryObj<typeof Textarea> = {
  args: { readonly: true, modelValue: "Readonly text" },
};

export const Invalid: StoryObj<typeof Textarea> = {
  args: { invalid: true },
};

export const PrefixIcon: StoryObj<typeof Textarea> = {
  args: { prefixIcon: "mail" },
};

export const Pill: StoryObj<typeof Textarea> = {
  args: { pill: true },
};

export const Sizes: StoryObj<typeof Textarea> = {
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: .5rem;">
        <Textarea v-bind="args" size="small" />
        <Textarea v-bind="args" />
        <Textarea v-bind="args" size="large" />
      </div>
    `,
  }),
};
