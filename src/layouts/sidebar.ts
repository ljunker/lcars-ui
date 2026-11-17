import { LitElement, css, html } from 'lit';
import { rail } from '../geometry/frames.js';
import { foundations } from '../tokens/foundations.js';

export class LcarsSidebar extends LitElement {
  static override properties = { label: {} };
  declare label: string;

  constructor() {
    super();
    this.label = 'Navigation';
  }

  static override styles = [foundations, rail, css`
    :host { display: block; container-type: inline-size; }

    nav {
      display: flex;
      min-block-size: var(--lcars-sidebar-min-height, var(--_lcars-sidebar-height, 31rem));
      gap: var(--_lcars-gap);
    }

    .vertical {
      flex: none;
      border-end-start-radius: var(--_lcars-elbow-radius);
      border-end-end-radius: var(--_lcars-elbow-radius);
    }

    .content {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--_lcars-gap);
      min-inline-size: 0;
    }

    .heading {
      color: var(--_lcars-secondary);
      font: 600 .6875rem/1.5 var(--_lcars-mono);
      letter-spacing: .14em;
      overflow-wrap: anywhere;
      text-transform: uppercase;
    }

    .links {
      display: flex;
      flex-flow: var(--_lcars-sidebar-flow, column nowrap);
      gap: calc(var(--_lcars-gap) / 2);
    }

    .footer { margin-block-start: var(--_lcars-sidebar-footer-margin, auto); }

    @container (min-width: 24rem) {
      nav { min-block-size: auto; }
      .links { flex-flow: row wrap; }
      .footer { margin-block-start: 0; }
    }
  `];

  protected override render() {
    return html`
      <nav aria-label=${this.label} part="navigation">
        <span class="rail vertical" part="rail" aria-hidden="true"></span>
        <div class="content">
          <div class="heading"><slot name="heading"></slot></div>
          <div class="links" part="links"><slot></slot></div>
          <div class="footer" part="footer"><slot name="footer"></slot></div>
        </div>
      </nav>
    `;
  }
}
