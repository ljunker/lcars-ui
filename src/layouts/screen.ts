import { LitElement, css, html } from 'lit';
import { foundations } from '../tokens/foundations.js';
import { screenThemes } from '../themes/palettes.js';

export class LcarsScreen extends LitElement {
  static override properties = {
    theme: { reflect: true },
    hasNavigation: { state: true },
  };

  declare theme: 'tng' | 'voyager';
  private declare hasNavigation: boolean;

  constructor() {
    super();
    this.theme = 'tng';
    this.hasNavigation = false;
  }

  static override styles = [foundations, screenThemes, css`
    :host {
      display: block;
      container-type: inline-size;
      color-scheme: dark;
      background: var(--_lcars-background);
    }

    .screen {
      --_lcars-screen-gap: var(--lcars-screen-gap, clamp(.875rem, 2vw, 1.75rem));
      display: grid;
      grid-template-rows: auto 1fr;
      row-gap: var(--_lcars-screen-gap);
      min-block-size: var(--lcars-screen-min-height, 100svh);
      max-inline-size: var(--lcars-screen-max-width, 100rem);
      margin-inline: auto;
      padding: var(--lcars-screen-padding, clamp(1rem, 3.4vw, 3.5rem));
    }

    .body {
      display: flex;
      align-items: flex-start;
      gap: var(--_lcars-screen-gap);
      min-inline-size: 0;
    }

    .navigation { flex: 0 0 var(--_lcars-navigation-width); }

    main {
      flex: 1 1 0;
      min-inline-size: 0;
    }

    @container (max-width: 49rem) {
      .body { flex-direction: column; }
      .navigation {
        --_lcars-sidebar-height: auto;
        --_lcars-sidebar-flow: row wrap;
        --_lcars-sidebar-footer-margin: 0;
      }

      .navigation, main {
        flex: none;
        inline-size: 100%;
      }
    }
  `];

  private updateNavigation(event: Event) {
    this.hasNavigation = (event.currentTarget as HTMLSlotElement).assignedElements().length > 0;
  }

  protected override render() {
    return html`
      <div class="screen" part="screen">
        <slot name="header"></slot>
        <div class="body" part="body">
          <div class="navigation" ?hidden=${!this.hasNavigation}>
            <slot name="navigation" @slotchange=${this.updateNavigation}></slot>
          </div>
          <main part="main"><slot></slot></main>
        </div>
      </div>
    `;
  }
}
