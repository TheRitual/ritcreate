import type { Meta, StoryObj } from "@storybook/react";
import { FormGroup } from "./form-group";
import { Input } from "./input";

const meta: Meta<typeof FormGroup> = {
  component: FormGroup,
};

export default meta;

type Story = StoryObj<typeof FormGroup>;

export const WithLabel: Story = {
  args: {
    label: "Email",
    htmlFor: "email-field",
    children: <Input id="email-field" type="email" placeholder="Email" />,
  },
};

export const WithInput: Story = {
  args: {
    label: "Name",
    children: <Input placeholder="Your name" />,
  },
};

export const LabelOnly: Story = {
  args: {
    label: "Just a label",
    children: <span>Content below label</span>,
  },
};

export const NoLabel: Story = {
  args: {
    children: <Input placeholder="No label" />,
  },
};
