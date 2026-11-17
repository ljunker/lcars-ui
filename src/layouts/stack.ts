import { LitElement, css, html } from 'lit';
import { foundations } from '../tokens/foundations.js';

export class LcarsStack extends LitElement {
  static override styles = [foundations, css`
    :host { display: block; min-inline-size: 0; }

    .stack {
      display: flex;
      flex-direction: column;
      gap: var(--lcars-stack-gap, var(--_lcars-gap));
    }

    :host([direction="horizontal"]) .stack {
      flex-flow: row wrap;
      align-items: center;
    }

    :host([justify="between"]) .stack { justify-content: space-between; }
    slot { display: contents; }
  `];

  protected override render() {
    return html`<div class="stack" part="stack"><slot></slot></div>`;
  }
}
