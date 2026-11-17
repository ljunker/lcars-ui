import { defineMain } from '@storybook/web-components-vite/node';

export default defineMain({
  core: { disableTelemetry: true },
  stories: ['../apps/storybook/*.stories.ts'],
  framework: '@storybook/web-components-vite',
});
