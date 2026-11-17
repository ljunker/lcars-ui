import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

export default { title: 'LCARS/Controls' } satisfies Meta;

function sample(content: TemplateResult) {
  return html`
    <lcars-screen style="--lcars-screen-min-height: auto">
      <lcars-stack direction="horizontal">${content}</lcars-stack>
    </lcars-screen>
  `;
}

export const Buttons: StoryObj = {
  render: () => sample(html`
    <lcars-button>Action</lcars-button>
    <lcars-button tone="secondary" appearance="outline">Outlined</lcars-button>
    <lcars-button appearance="navigation" active>Current</lcars-button>
    <lcars-button disabled>Disabled</lcars-button>
  `),
};

export const Input: StoryObj = {
  render: () => sample(html`
    <lcars-input label="Call sign" placeholder="UFP-47"></lcars-input>
    <lcars-input label="Station ID" value="47" disabled></lcars-input>
  `),
};

export const Toggle: StoryObj = {
  render: () => sample(html`
    <lcars-toggle label="Beacon"></lcars-toggle>
    <lcars-toggle label="Locked channel" checked disabled></lcars-toggle>
  `),
};

export const Progress: StoryObj = {
  render: () => sample(html`
    <lcars-progress label="Shield strength" value="75" style="width: 16rem"></lcars-progress>
    <lcars-progress label="Warp core" value="125" max="200" tone="accent" segmented style="width: 16rem"></lcars-progress>
  `),
};

export const Status: StoryObj = {
  render: () => sample(html`
    <lcars-status state="nominal"></lcars-status>
    <lcars-status state="warning"></lcars-status>
    <lcars-status state="alert"></lcars-status>
    <lcars-status state="offline"></lcars-status>
  `),
};
