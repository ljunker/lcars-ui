import { LitElement, css, html } from 'lit';
import { cap, rail } from '../geometry/frames.js';
import { foundations } from '../tokens/foundations.js';

export class LcarsDivider extends LitElement {
  static override styles = [foundations, rail, cap, css`
    :host { display: block; }

    .divider {
      --_lcars-rail-width: var(--lcars-divider-height, .3125rem);
      display: flex;
      gap: .25rem;
    }

    .cap { --_lcars-geometry-color: var(--_lcars-secondary); }
  `];

  protected override render() {
    return html`
      <div class="divider" part="divider" role="separator">
        <span class="rail" part="rail"></span>
        <span class="cap" part="cap"></span>
      </div>
    `;
  }
}
