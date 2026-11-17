import { css, html } from 'lit';
import { foundations, LcarsControl } from '../tokens/foundations.js';
import { fieldLayout, fieldSurface } from './field-styles.js';

export class LcarsSelect extends LcarsControl {
  static override properties = {
    label: {},
    value: { noAccessor: true },
    disabled: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare disabled: boolean;

  private requestedValue: string | null = null;

  private readonly optionObserver = new MutationObserver((records) => {
    if (records.some((record) => record.target !== this || record.type === 'childList')) {
      this.syncOptions();
    }
  });

  constructor() {
    super();
    this.label = 'Select';
    this.disabled = false;
  }

  static override styles = [foundations, fieldLayout, fieldSurface, css`
    select { color-scheme: dark; }
  `];

  private get control() {
    return this.renderRoot?.querySelector('select');
  }

  get value(): string {
    return this.control?.value ?? '';
  }

  set value(value: string | null) {
    this.requestedValue = value;
    const control = this.control;
    if (!control) return;
    if (value === null) this.syncOptions();
    else if (value !== control.value || control.selectedIndex === -1) control.value = value;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.optionObserver.observe(this, {
      attributes: true, childList: true, characterData: true, subtree: true,
    });
    this.syncOptions();
  }

  override disconnectedCallback() {
    this.optionObserver.disconnect();
    super.disconnectedCallback();
  }

  protected override firstUpdated() {
    this.syncOptions();
  }

  private syncOptions() {
    const control = this.control;
    if (!control) return;

    const options = Array.from(this.children)
      .filter((child) => child.matches('option, optgroup'))
      .map((child) => child.cloneNode(true));
    control.replaceChildren(...options);
    if (this.requestedValue !== null) control.value = this.requestedValue;
  }

  private onInput(event: Event) {
    this.requestedValue = (event.currentTarget as HTMLSelectElement).value;
  }

  protected override render() {
    return html`
      <label>
        <span class="label" part="label">${this.label || 'Select'}</span>
        <select class="control" part="control" ?disabled=${this.disabled} @input=${this.onInput} @change=${this.emitChange}></select>
      </label>
    `;
  }
}
