import { type Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import FilePicker from "../components/FilePicker.vue";
import IconButton from "../components/IconButton.vue";
import DumpValue from "./helpers/components/DumpValue.vue";

export default {
  title: "Components/FilePicker",
  component: FilePicker,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    multiple: { control: "boolean" },
    accept: { control: "text" },
    label: { control: "text" },
  },
  args: {
    label: "Upload file",
  },
} as Meta<typeof FilePicker>;

export const Default: StoryObj<typeof FilePicker> = {};

export const Multiple: StoryObj<typeof FilePicker> = {
  args: {
    multiple: true,
    label: "Upload files",
  },
};

export const AcceptImages: StoryObj<typeof FilePicker> = {
  args: {
    accept: "image/*",
    label: "Upload image",
  },
};

export const WithFileHandler: StoryObj<typeof FilePicker> = {
  render: (args) => ({
    components: { FilePicker, DumpValue },
    setup: () => ({ args, files: ref<File[]>([]) }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
        <FilePicker v-bind="args" @files="files = $event" />
        <DumpValue :value="files.map(f => ({ name: f.name, size: f.size, type: f.type }))" />
      </div>
    `,
  }),
};

export const CustomSlot: StoryObj<typeof FilePicker> = {
  render: (args) => ({
    components: { FilePicker, IconButton },
    setup: () => ({ args }),
    template: `
      <FilePicker v-bind="args">
        <IconButton icon="plus" variant="primary" />
      </FilePicker>
    `,
  }),
};
