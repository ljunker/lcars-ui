import { LitElement, css, html, nothing } from 'lit';
import { foundations } from '../tokens/foundations.js';

export class LcarsPanel extends LitElement {
  static override properties = { heading: { attribute: 'title' } };
  private declare heading: string;

  static override styles = [foundations, css`
    :host { display: block; min-inline-size: 0; }

    .panel {
      block-size: 100%;
      min-inline-size: 0;
      padding: var(--lcars-panel-padding, clamp(.875rem, 2vw, 1.375rem));
      border: 1px solid var(--_lcars-line);
      border-start-start-radius: var(--_lcars-elbow-radius);
      background: var(--_lcars-surface);
    }

    :host([frameless]) .panel {
      padding: 0;
      border: 0;
      background: transparent;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--_lcars-gap);
      margin-block-end: var(--_lcars-gap);
      padding-block-end: var(--_lcars-gap);
      border-block-end: 1px solid var(--_lcars-line);
    }

    h2 {
      display: flex;
      align-items: center;
      gap: .5rem;
      margin: 0;
      color: var(--_lcars-primary);
      font: 600 1.25rem/1.15 var(--_lcars-display);
      letter-spacing: .075em;
      overflow-wrap: anywhere;
      text-transform: uppercase;
    }

    h2::before {
      flex: none;
      inline-size: 1rem;
      block-size: .375rem;
      border-radius: 100vmax;
      background: currentColor;
      content: '';
    }

    .content {
      display: grid;
      align-content: start;
      gap: var(--lcars-panel-gap, var(--_lcars-gap));
      min-inline-size: 0;
    }

    .content > slot { display: contents; }
  `];

  protected override render() {
    return html`
      <div class="panel" part="frame">
        ${this.heading ? html`
          <header part="header">
            <h2 part="title">${this.heading}</h2>
            <slot name="meta"></slot>
          </header>
        ` : nothing}
        <div class="content" part="content"><slot></slot></div>
      </div>
    `;
  }
}
