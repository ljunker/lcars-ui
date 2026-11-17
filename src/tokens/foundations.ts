import { LitElement, css } from 'lit';
import { palette } from '../themes/palettes.js';

export const foundations = css`
  :host {
    --_lcars-primary: var(--lcars-color-primary, var(--_lcars-theme-primary, ${palette.tng.primary}));
    --_lcars-secondary: var(--lcars-color-secondary, var(--_lcars-theme-secondary, ${palette.tng.secondary}));
    --_lcars-accent: var(--lcars-color-accent, var(--_lcars-theme-accent, ${palette.tng.accent}));
    --_lcars-background: var(--lcars-color-background, var(--_lcars-theme-background, ${palette.tng.background}));
    --_lcars-surface: var(--lcars-color-surface, var(--_lcars-theme-surface, ${palette.tng.surface}));
    --_lcars-text: var(--lcars-color-text, var(--_lcars-theme-text, ${palette.tng.text}));
    --_lcars-muted: var(--lcars-color-muted, var(--_lcars-theme-muted, ${palette.tng.muted}));
    --_lcars-line: var(--lcars-color-line, var(--_lcars-theme-line, ${palette.tng.line}));
    --_lcars-ink: var(--lcars-color-ink, var(--_lcars-theme-ink, ${palette.tng.ink}));
    --_lcars-nominal: var(--lcars-color-nominal, var(--_lcars-theme-nominal, ${palette.tng.nominal}));
    --_lcars-warning: var(--lcars-color-warning, var(--_lcars-theme-warning, ${palette.tng.warning}));
    --_lcars-alert: var(--lcars-color-alert, var(--_lcars-theme-alert, ${palette.tng.alert}));
    --_lcars-gap: var(--lcars-gap, .75rem);
    --_lcars-rail-width: var(--lcars-rail-width, var(--_lcars-theme-rail-width, ${palette.tng['rail-width']}));
    --_lcars-elbow-radius: var(--lcars-elbow-radius, var(--_lcars-theme-elbow-radius, ${palette.tng['elbow-radius']}));
    --_lcars-header-height: var(--lcars-header-height, 5rem);
    --_lcars-control-height: var(--lcars-control-height, 2.75rem);
    --_lcars-navigation-width: var(--lcars-navigation-width, clamp(10.5rem, 17vw, 14.5rem));
    --_lcars-display: var(--lcars-font-display, var(--lcars-font-family, system-ui, sans-serif));
    --_lcars-mono: var(--lcars-font-mono, ui-monospace, monospace);
    box-sizing: border-box;
    color: var(--_lcars-text);
    font: var(--lcars-font-size, 1rem)/1.5 var(--lcars-font-family, system-ui, sans-serif);
  }

  :host([hidden]) { display: none; }

  *, *::before, *::after { box-sizing: border-box; }

  :focus-visible {
    outline: 2px solid var(--_lcars-text);
    outline-offset: 3px;
  }
`;

export class LcarsControl extends LitElement {
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  protected emitChange(): void {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
}
