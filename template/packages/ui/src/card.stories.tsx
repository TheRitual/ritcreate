import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./card";

const meta: Meta<typeof Card> = {
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: "Card content goes here.",
  },
};

export const WithParagraph: Story = {
  args: {
    children: (
      <>
        <h3 style={{ margin: "0 0 0.5rem 0" }}>Card heading</h3>
        <p style={{ margin: 0 }}>
          This card contains a heading and a paragraph of text.
        </p>
      </>
    ),
  },
};
