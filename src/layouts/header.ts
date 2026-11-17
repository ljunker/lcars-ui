import { LitElement, css, html } from 'lit';
import { cap, elbow, rail } from '../geometry/frames.js';
import { foundations } from '../tokens/foundations.js';

export class LcarsHeader extends LitElement {
  static override properties = { heading: { attribute: 'title' } };
  private declare heading: string;

  static override styles = [foundations, rail, cap, elbow, css`
    :host { display: block; container-type: inline-size; }

    .header {
      --_lcars-header-gap: var(--lcars-screen-gap, clamp(.875rem, 2vw, 1.75rem));
      display: grid;
      grid-template-columns: var(--_lcars-navigation-width) minmax(0, 1fr);
      align-items: end;
      column-gap: var(--_lcars-header-gap);
      min-block-size: var(--_lcars-header-height);
    }

    .leading {
      display: flex;
      align-items: center;
      align-self: center;
      gap: var(--_lcars-gap);
      color: var(--_lcars-secondary);
      font: 600 .75rem/1.35 var(--_lcars-mono);
      letter-spacing: .12em;
    }

    .identity {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: var(--_lcars-gap);
      flex-wrap: wrap;
      min-inline-size: 0;
      padding-block-end: .375rem;
    }

    .name {
      color: var(--_lcars-primary);
      font: 700 clamp(2rem, 5vw, 3.25rem)/.94 var(--_lcars-display);
      letter-spacing: .045em;
      overflow-wrap: anywhere;
      text-transform: uppercase;
    }

    .subtitle {
      margin-block-start: .4rem;
      color: var(--_lcars-muted);
      font: .6875rem/1.4 var(--_lcars-mono);
      letter-spacing: .11em;
    }

    .frame {
      display: flex;
      gap: .375rem;
      margin-block-start: .875rem;
    }

    .elbow {
      --_lcars-elbow-size: max(
        var(--_lcars-elbow-radius),
        calc(var(--_lcars-rail-width) + var(--_lcars-header-gap))
      );
      margin-inline-end: -.375rem;
    }

    .frame .secondary {
      --_lcars-geometry-color: var(--_lcars-secondary);
      flex: 0 1 clamp(2.75rem, 14vw, 11rem);
    }

    .frame .cap { --_lcars-geometry-color: var(--_lcars-accent); }

    @container (max-width: 46rem) {
      .header { grid-template-columns: minmax(0, 1fr); row-gap: .625rem; }
      .elbow { --_lcars-elbow-size: var(--_lcars-elbow-radius); }
    }
  `];

  protected override render() {
    return html`
      <header part="header">
        <div class="header">
          <div class="leading" part="leading"><slot name="leading"></slot></div>
          <div class="identity">
            <div>
              <div class="name" part="title">${this.heading}</div>
              <div class="subtitle"><slot></slot></div>
            </div>
            <slot name="actions"></slot>
          </div>
        </div>
        <div class="frame" part="frame" aria-hidden="true">
          <span class="elbow" part="elbow"></span>
          <span class="rail" part="rail"></span>
          <span class="rail secondary"></span>
          <span class="cap" part="cap"></span>
        </div>
      </header>
    `;
  }
}
