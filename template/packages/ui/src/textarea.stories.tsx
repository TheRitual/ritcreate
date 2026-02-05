import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  component: Textarea,
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: "Enter longer text..." },
};

export const WithValue: Story = {
  args: {
    value: "Some longer content here.",
    readOnly: true,
  },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled", disabled: true },
};
