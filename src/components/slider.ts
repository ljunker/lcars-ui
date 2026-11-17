import { html, css, type PropertyValues } from 'lit';
import { foundations, LcarsControl } from '../tokens/foundations.js';
import { fieldLayout } from './field-styles.js';

export class LcarsSlider extends LcarsControl {
  static override properties = {
    label: {},
    value: {
      noAccessor: true,
      converter: (value: string | null) => value?.trim() ? Number(value) : null,
    },
    min: { converter: (value: string | null) => value?.trim() ? Number(value) : 0 },
    max: { converter: (value: string | null) => value?.trim() ? Number(value) : 100 },
    step: { converter: (value: string | null) => value === 'any' ? value : Number(value) || 1 },
    disabled: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare min: number;
  declare max: number;
  declare step: number | 'any';
  declare disabled: boolean;

  private pendingValue: number | null | undefined;

  constructor() {
    super();
    this.label = 'Slider';
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.disabled = false;
  }

  static override styles = [foundations, fieldLayout, css`
    .caption { display: flex; justify-content: space-between; gap: var(--_lcars-gap); }
    .readout { color: var(--_lcars-text); font-variant-numeric: tabular-nums; }

    input {
      margin: 0;
      accent-color: var(--_lcars-primary);
      color-scheme: dark;
    }
  `];

  private get control() {
    return this.renderRoot?.querySelector('input');
  }

  get value(): number {
    return this.control?.valueAsNumber ?? this.pendingValue ?? 50;
  }

  set value(value: number | null) {
    this.pendingValue = value;
    this.requestUpdate();
  }

  protected override update(changedProperties: PropertyValues) {
    // Capture the value before Lit applies the range constraints one at a time.
    const value = this.pendingValue === undefined ? this.control?.value ?? '' : String(this.pendingValue ?? '');
    this.pendingValue = undefined;
    super.update(changedProperties);

    const control = this.control!;
    if (control.value !== value) control.value = value;
    this.updateReadout(control);
  }

  private updateReadout(control: HTMLInputElement) {
    this.renderRoot.querySelector('.readout')!.textContent = control.value;
  }

  private onInput(event: Event) {
    this.updateReadout(event.currentTarget as HTMLInputElement);
  }

  protected override render() {
    return html`
      <label>
        <span class="caption">
          <span class="label" part="label">${this.label || 'Slider'}</span>
          <span class="label readout" part="readout" aria-hidden="true"></span>
        </span>
        <input
          type="range"
          class="control"
          part="control"
          min=${this.min}
          max=${this.max}
          step=${this.step}
          ?disabled=${this.disabled}
          @input=${this.onInput}
          @change=${this.emitChange}
        >
      </label>
    `;
  }
}
