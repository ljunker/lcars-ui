import { LitElement, css, html } from 'lit';
import { progressRange } from '../geometry/values.js';
import { foundations } from '../tokens/foundations.js';

export class LcarsProgress extends LitElement {
  static override properties = {
    label: {},
    value: { type: Number, reflect: true },
    max: { type: Number, reflect: true },
  };

  declare label: string;
  declare value: number;
  declare max: number;

  constructor() {
    super();
    this.label = 'Progress';
    this.value = 0;
    this.max = 100;
  }

  static override styles = [foundations, css`
    :host {
      --_lcars-fill: var(--_lcars-primary);
      display: block;
      min-inline-size: 0;
    }

    :host([tone="secondary"]) { --_lcars-fill: var(--_lcars-secondary); }
    :host([tone="accent"]) { --_lcars-fill: var(--_lcars-accent); }

    .readout {
      display: flex;
      justify-content: space-between;
      gap: var(--_lcars-gap);
      margin-block-end: .375rem;
      color: var(--_lcars-muted);
      font: 500 .6875rem/1.4 var(--_lcars-mono);
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    .readout span:last-child { color: var(--_lcars-text); }
    :host([hide-readout]) .readout { display: none; }

    progress {
      display: block;
      inline-size: 100%;
      block-size: var(--lcars-progress-height, .625rem);
      appearance: none;
      border: 0;
      border-radius: 100vmax;
      background: var(--_lcars-line);
      color: var(--_lcars-fill);
      overflow: hidden;
    }

    progress::-webkit-progress-bar { background: var(--_lcars-line); }
    progress::-webkit-progress-value { background: var(--_lcars-fill); }
    progress::-moz-progress-bar { background: var(--_lcars-fill); }

    :host([segmented]) progress {
      --_lcars-segment: calc(100% / 24);
      block-size: var(--lcars-progress-height, 1.625rem);
      border-radius: .25rem;
      mask-image: repeating-linear-gradient(
        to right, #000 0 calc(var(--_lcars-segment) - 3px),
        transparent calc(var(--_lcars-segment) - 3px) var(--_lcars-segment)
      );
    }

    @media (forced-colors: active) {
      progress { appearance: auto; }
      :host([segmented]) progress { mask-image: none; }
    }
  `];

  protected override render() {
    const { value, max } = progressRange(this.value, this.max);
    const label = this.label || 'Progress';
    return html`
      <div class="readout" part="readout" aria-hidden="true">
        <span>${label}</span>
        <span>${Math.round(value / max * 100)}%</span>
      </div>
      <progress part="track" aria-label=${label} max=${max} value=${value}></progress>
    `;
  }
}
