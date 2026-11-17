import { LitElement, css, html } from 'lit';
import { foundations } from '../tokens/foundations.js';

const states = {
  nominal: 'Nominal',
  warning: 'Warning',
  alert: 'Alert',
  offline: 'Offline',
};

export class LcarsStatus extends LitElement {
  static override properties = { state: { reflect: true } };
  declare state: keyof typeof states;

  constructor() {
    super();
    this.state = 'nominal';
  }

  static override styles = [foundations, css`
    :host {
      --_lcars-status: var(--_lcars-nominal);
      display: inline-block;
      max-inline-size: 100%;
    }

    :host([state="warning"]) { --_lcars-status: var(--_lcars-warning); }
    :host([state="alert"]) { --_lcars-status: var(--_lcars-alert); }
    :host([state="offline"]) { --_lcars-status: var(--_lcars-muted); }

    .status {
      display: inline-flex;
      align-items: center;
      gap: .375rem;
      max-inline-size: 100%;
      padding: .3125rem .625rem;
      border: 1px solid color-mix(in srgb, var(--_lcars-status) 36%, transparent);
      border-radius: 100vmax;
      background: color-mix(in srgb, var(--_lcars-status) 8%, var(--_lcars-background));
      color: var(--_lcars-status);
      font: 500 .625rem/1.4 var(--_lcars-mono);
      letter-spacing: .05em;
      overflow-wrap: anywhere;
      text-transform: uppercase;
    }

    .dot {
      flex: none;
      inline-size: .375rem;
      block-size: .375rem;
      border-radius: 100%;
      background: currentColor;
      forced-color-adjust: none;
    }
  `];

  protected override render() {
    const fallback = Object.hasOwn(states, this.state) ? states[this.state] : states.nominal;
    return html`
      <span class="status" part="status" role="status" aria-atomic="true">
        <span class="dot" part="indicator" aria-hidden="true"></span>
        <slot>${fallback}</slot>
      </span>
    `;
  }
}
