import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

interface LayoutArgs {
  theme: string;
  columns: number;
  railWidth: string;
  elbowRadius: string;
}

const meta = {
  title: 'LCARS/Layouts',
  args: { theme: 'tng', columns: 2, railWidth: '', elbowRadius: '' },
  argTypes: {
    theme: { control: 'radio', options: ['tng', 'voyager'] },
    columns: { control: { type: 'range', min: 1, max: 4, step: 1 } },
    railWidth: { control: 'text' },
    elbowRadius: { control: 'text' },
  },
  render: ({ theme, columns, railWidth, elbowRadius }) => html`
    <lcars-screen
      theme=${theme}
      style=${styleMap({
        '--lcars-rail-width': railWidth || undefined,
        '--lcars-elbow-radius': elbowRadius || undefined,
      })}
    >
      <lcars-header title="Outpost 47" slot="header">
        <span slot="leading">LCARS</span>
        Station telemetry
      </lcars-header>
      <lcars-sidebar slot="navigation" label="Station navigation">
        <span slot="heading">Station</span>
        <lcars-button appearance="navigation" active>Overview</lcars-button>
        <lcars-button appearance="navigation" tone="secondary">Diagnostics</lcars-button>
        <lcars-divider slot="footer"></lcars-divider>
      </lcars-sidebar>
      <lcars-grid columns=${columns}>
        <lcars-panel title="Power">
          <lcars-status slot="meta" state="nominal"></lcars-status>
          <lcars-stack>
            <lcars-progress label="Power reserve" value="75" segmented></lcars-progress>
            <lcars-divider></lcars-divider>
            <lcars-progress label="Solar charging" value="40" tone="secondary"></lcars-progress>
          </lcars-stack>
        </lcars-panel>
        <lcars-panel title="Settings">
          <lcars-input label="Call sign" value="UFP-47"></lcars-input>
          <lcars-toggle label="Beacon" checked></lcars-toggle>
        </lcars-panel>
      </lcars-grid>
    </lcars-screen>
  `,
} satisfies Meta<LayoutArgs>;

export default meta;
type Story = StoryObj<LayoutArgs>;

export const TngClassic: Story = {};

export const Voyager: Story = {
  args: { theme: 'voyager' },
};
