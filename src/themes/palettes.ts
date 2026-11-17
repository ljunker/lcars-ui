import { css, unsafeCSS } from 'lit';

const tng = {
  primary: '#ffb369',
  secondary: '#bcb0fa',
  accent: '#ed9fb2',
  background: '#0c0b11',
  surface: '#15131d',
  text: '#f6eef5',
  muted: '#bcb4c8',
  line: '#3d344b',
  ink: '#21130f',
  nominal: '#94dfba',
  warning: '#ffce83',
  alert: '#ff9b9d',
  'rail-width': '.6875rem',
  'elbow-radius': '2rem',
};

type Palette = typeof tng;

const voyager: Palette = {
  primary: '#98caff',
  secondary: '#f6bb8c',
  accent: '#beb1ff',
  background: '#0a111b',
  surface: '#111e2e',
  text: '#edf5ff',
  muted: '#c0cadd',
  line: '#394e68',
  ink: '#0c1b2c',
  nominal: '#89e1c9',
  warning: '#ffcf8c',
  alert: '#ffa1b0',
  'rail-width': '.5rem',
  'elbow-radius': '1.25rem',
};

function themeTokens(theme: Palette) {
  return unsafeCSS(Object.entries(theme).map(([name, value]) => `--_lcars-theme-${name}: ${value};`).join('\n'));
}

export const palette = {
  tng: Object.fromEntries(
    Object.entries(tng).map(([name, value]) => [name, unsafeCSS(value)]),
  ),
};

export const screenThemes = css`
  :host { ${themeTokens(tng)} }
  :host([theme="voyager"]) { ${themeTokens(voyager)} }
`;
