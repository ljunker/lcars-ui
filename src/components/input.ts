import { css, html } from 'lit';
import { live } from 'lit/directives/live.js';
import { foundations, LcarsControl } from '../tokens/foundations.js';

export class LcarsInput extends LcarsControl {
  static override properties = {
    label: {},
    value: { converter: (value: string | null) => value ?? '' },
    placeholder: {},
    disabled: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare value: string;
  declare placeholder: string;
  declare disabled: boolean;

  constructor() {
    super();
    this.label = 'Text';
    this.value = '';
    this.placeholder = '';
    this.disabled = false;
  }

  static override styles = [foundations, css`
    :host { display: block; min-inline-size: 0; }

    label { display: grid; gap: .375rem; }

    .label {
      color: var(--_lcars-muted);
      font: 500 .6875rem/1.4 var(--_lcars-mono);
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    input {
      inline-size: 100%;
      min-inline-size: 0;
      min-block-size: var(--_lcars-control-height);
      padding: .375rem .75rem;
      border: 1px solid var(--_lcars-line);
      border-inline-start: .25rem solid var(--_lcars-secondary);
      border-radius: .1875rem .375rem .375rem .1875rem;
      background: var(--_lcars-background);
      color: var(--_lcars-text);
      font: 1rem var(--_lcars-mono);
    }

    input::placeholder { color: var(--_lcars-muted); }
    input:disabled { color: var(--_lcars-muted); cursor: not-allowed; }
  `];

  private onInput(event: Event) {
    this.value = (event.currentTarget as HTMLInputElement).value;
  }

  protected override render() {
    return html`
      <label>
        <span class="label" part="label">${this.label || 'Text'}</span>
        <input
          type="text"
          part="control"
          .value=${live(this.value)}
          placeholder=${this.placeholder ?? ''}
          ?disabled=${this.disabled}
          @input=${this.onInput}
          @change=${this.emitChange}
        >
      </label>
    `;
  }
}
