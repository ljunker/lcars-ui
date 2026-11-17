import { LitElement, css, html } from 'lit';
import { foundations } from '../tokens/foundations.js';
import { columnCount } from '../geometry/values.js';

export class LcarsGrid extends LitElement {
  static override properties = { columns: { type: Number, reflect: true } };
  declare columns: number;

  constructor() {
    super();
    this.columns = 2;
  }

  static override styles = [foundations, css`
    :host { display: block; container-type: inline-size; }

    .grid {
      display: grid;
      grid-template-columns: var(--lcars-grid-template-columns, repeat(var(--_lcars-columns), minmax(0, 1fr)));
      gap: var(--lcars-grid-gap, calc(var(--_lcars-gap) * 1.5));
    }

    slot { display: contents; }

    @container (max-width: 58rem) {
      .grid { grid-template-columns: repeat(min(var(--_lcars-columns), 2), minmax(0, 1fr)); }
    }

    @container (max-width: 36rem) {
      .grid { grid-template-columns: minmax(0, 1fr); }
    }
  `];

  protected override render() {
    return html`
      <div class="grid" part="grid" style="--_lcars-columns: ${columnCount(this.columns)}">
        <slot></slot>
      </div>
    `;
  }
}
