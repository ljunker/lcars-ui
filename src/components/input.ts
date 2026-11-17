import { css, html } from 'lit';
import { live } from 'lit/directives/live.js';
import { foundations, LcarsControl } from '../tokens/foundations.js';
import { fieldLayout, fieldSurface } from './field-styles.js';

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

  static override styles = [foundations, fieldLayout, fieldSurface, css`
    input::placeholder { color: var(--_lcars-muted); }
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
          class="control"
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
