import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "@emotion/react";
import { GlassPanel } from "./glass-panel";

const theme = {
  colors: {
    glass: {
      light: "rgba(255,255,255,0.4)",
      medium: "rgba(255,255,255,0.5)",
      dark: "rgba(0,0,0,0.1)",
    },
  },
  borderRadius: { xl: "1rem" },
  shadows: { glass: "0 8px 32px rgba(0,0,0,0.1)" },
};

const meta: Meta<typeof GlassPanel> = {
  component: GlassPanel,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof GlassPanel>;

export const Default: Story = {
  args: {
    children: "Content in glass panel",
  },
};
