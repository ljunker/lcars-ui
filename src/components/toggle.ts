import { css, html } from 'lit';
import { live } from 'lit/directives/live.js';
import { foundations, LcarsControl } from '../tokens/foundations.js';

export class LcarsToggle extends LcarsControl {
  static override properties = {
    label: {},
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare checked: boolean;
  declare disabled: boolean;

  constructor() {
    super();
    this.label = 'Toggle';
    this.checked = false;
    this.disabled = false;
  }

  static override styles = [foundations, css`
    :host { display: inline-block; max-inline-size: 100%; }

    label {
      position: relative;
      display: inline-flex;
      min-block-size: var(--_lcars-control-height);
      align-items: center;
      gap: .625rem;
      color: var(--_lcars-text);
      font: 500 .75rem/1.4 var(--_lcars-mono);
      cursor: pointer;
    }

    input {
      position: absolute;
      inset: 0;
      inline-size: 100%;
      block-size: 100%;
      margin: 0;
      opacity: 0;
      cursor: inherit;
    }

    .track {
      position: relative;
      flex: none;
      inline-size: 2.375rem;
      block-size: 1.375rem;
      border: 1px solid var(--_lcars-secondary);
      border-radius: 100vmax;
      background: var(--_lcars-background);
      color: var(--_lcars-secondary);
      pointer-events: none;
    }

    .track::before {
      position: absolute;
      inset-block-start: 2px;
      inset-inline-start: 2px;
      inline-size: calc(1rem - 2px);
      block-size: calc(1rem - 2px);
      border-radius: 50%;
      background: currentColor;
      content: '';
    }

    input:checked + .track {
      border-color: var(--_lcars-primary);
      background: var(--_lcars-primary);
      color: var(--_lcars-ink);
    }

    input:checked + .track::before {
      inset-inline-start: auto;
      inset-inline-end: 2px;
    }

    input:focus-visible + .track {
      outline: 2px solid var(--_lcars-text);
      outline-offset: 3px;
    }

    :host([disabled]) label { color: var(--_lcars-muted); cursor: not-allowed; }

    @media (forced-colors: active) {
      .track { border-color: ButtonText; }
      .track::before { background: ButtonText; forced-color-adjust: none; }
    }
  `];

  private onInput(event: Event) {
    this.checked = (event.currentTarget as HTMLInputElement).checked;
  }

  protected override render() {
    return html`
      <label part="control">
        <input
          type="checkbox"
          role="switch"
          .checked=${live(this.checked)}
          ?disabled=${this.disabled}
          @input=${this.onInput}
          @change=${this.emitChange}
        >
        <span class="track" part="track" aria-hidden="true"></span>
        <span part="label">${this.label || 'Toggle'}</span>
      </label>
    `;
  }
}
