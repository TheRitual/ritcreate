import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Button", variant: "primary" },
};

export const Secondary: Story = {
  args: { children: "Button", variant: "secondary" },
};

export const Outline: Story = {
  args: { children: "Button", variant: "outline" },
};

export const Small: Story = {
  args: { children: "Small", size: "sm" },
};

export const Large: Story = {
  args: { children: "Large", size: "lg" },
};

export const FullWidth: Story = {
  args: { children: "Full width", fullWidth: true },
};

export const Round: Story = {
  args: { children: "Round", round: true },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};
