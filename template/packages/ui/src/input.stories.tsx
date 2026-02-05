import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  component: Input,
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text" },
};

export const WithValue: Story = {
  args: { value: "Some value", readOnly: true },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled", disabled: true },
};

export const Email: Story = {
  args: { type: "email", placeholder: "email@example.com" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Password" },
};
