import type { Meta, StoryObj } from "@storybook/react";
import { PageTitle } from "./page-title";

const meta: Meta<typeof PageTitle> = {
  component: PageTitle,
};

export default meta;

type Story = StoryObj<typeof PageTitle>;

export const Default: Story = {
  args: { children: "Page Title" },
};

export const LongTitle: Story = {
  args: {
    children: "This is a longer page title that might wrap",
  },
};
