import { LitElement, css, html } from 'lit';
import { foundations } from '../tokens/foundations.js';

export class LcarsDialog extends LitElement {
  static override properties = { heading: { attribute: 'title' } };
  private declare heading?: string;

  static override styles = [foundations, css`
    :host { display: contents; }

    dialog {
      inline-size: min(32rem, calc(100% - 2rem));
      max-inline-size: none;
      max-block-size: calc(100% - 2rem);
      margin: auto;
      padding: clamp(1rem, 4vw, 1.5rem);
      overflow: auto;
      overflow-wrap: anywhere;
      border: 1px solid var(--_lcars-line);
      border-inline-start: var(--_lcars-rail-width) solid var(--_lcars-primary);
      border-radius: var(--_lcars-elbow-radius) .5rem .5rem .5rem;
      background: var(--_lcars-surface);
      color: inherit;
    }

    dialog::backdrop { background: rgb(0 0 0 / .65); }

    h2 {
      margin: 0;
      padding-block-end: var(--_lcars-gap);
      border-block-end: 1px solid var(--_lcars-line);
      color: var(--_lcars-primary);
      font: 600 1.5rem/1.15 var(--_lcars-display);
      letter-spacing: .075em;
      text-transform: uppercase;
    }

    .content { margin-block: var(--_lcars-gap); }

    .actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: var(--_lcars-gap);
    }

    .actions > slot { display: contents; }
  `];

  private get dialog() {
    return this.renderRoot?.querySelector('dialog');
  }

  get open(): boolean {
    return this.dialog?.open ?? false;
  }

  showModal(): void {
    const dialog = this.dialog;
    if (!dialog) {
      throw new DOMException('Connect lcars-dialog and await updateComplete before calling showModal().', 'InvalidStateError');
    }
    dialog.showModal();
  }

  close(): void {
    this.dialog?.close();
  }

  override disconnectedCallback() {
    this.close();
    super.disconnectedCallback();
  }

  private onClose(event: Event) {
    if (event.target === event.currentTarget) {
      this.dispatchEvent(new Event('close', { bubbles: true, composed: true }));
    }
  }

  protected override render() {
    return html`
      <dialog part="dialog" aria-labelledby="title" @close=${this.onClose}>
        <h2 id="title" part="title">${this.heading?.trim() || 'Dialog'}</h2>
        <div class="content" part="content"><slot></slot></div>
        <div class="actions" part="actions">
          <slot name="actions"><lcars-button @click=${this.close}>Close</lcars-button></slot>
        </div>
      </dialog>
    `;
  }
}
