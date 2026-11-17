import { css, html, nothing } from 'lit';
import { foundations, LcarsControl } from '../tokens/foundations.js';

export class LcarsButton extends LcarsControl {
  static override properties = {
    active: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    label: {},
  };

  declare active: boolean;
  declare disabled: boolean;
  declare label: string;

  constructor() {
    super();
    this.active = false;
    this.disabled = false;
    this.label = '';
  }

  static override styles = [foundations, css`
    :host {
      --_lcars-button-color: var(--_lcars-primary);
      display: inline-block;
      min-inline-size: 0;
      vertical-align: middle;
    }

    :host([tone="secondary"]) { --_lcars-button-color: var(--_lcars-secondary); }
    :host([tone="accent"]) { --_lcars-button-color: var(--_lcars-accent); }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .5rem;
      inline-size: 100%;
      min-block-size: var(--_lcars-control-height);
      padding: .375rem 1rem;
      border: 1px solid transparent;
      border-radius: 100vmax;
      background: var(--_lcars-button-color);
      color: var(--_lcars-ink);
      font: 600 .75rem/1.25 var(--_lcars-mono);
      letter-spacing: .04em;
      overflow-wrap: anywhere;
      text-align: start;
      text-transform: uppercase;
      cursor: pointer;
    }

    :host([appearance="outline"]) button {
      border-color: var(--_lcars-button-color);
      background: transparent;
      color: var(--_lcars-button-color);
    }

    :host([appearance="navigation"]) button {
      justify-content: flex-start;
      border-radius: .1875rem 100vmax 100vmax .1875rem;
    }

    :host([appearance="navigation"]:not([active])) button {
      border-color: var(--_lcars-line);
      background: var(--_lcars-surface);
      color: var(--_lcars-button-color);
    }

    :host([appearance="navigation"]) button::before {
      flex: none;
      inline-size: .3125rem;
      block-size: .65rem;
      border-radius: 100vmax;
      background: currentColor;
      content: '';
    }

    :host([active]:not([appearance="navigation"])) button {
      text-decoration: underline;
      text-underline-offset: .2em;
    }

    button:hover:enabled { filter: brightness(1.16); }

    button:disabled {
      border-color: var(--_lcars-line);
      background: var(--_lcars-surface);
      color: var(--_lcars-muted);
      cursor: not-allowed;
    }
  `];

  override click() {
    if (!this.disabled) this.renderRoot?.querySelector('button')?.click();
  }

  protected override render() {
    return html`
      <button
        type="button"
        part="control"
        ?disabled=${this.disabled}
        aria-current=${this.active ? 'true' : nothing}
        aria-label=${this.label || nothing}
      ><slot></slot></button>
    `;
  }
}
