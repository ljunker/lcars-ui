import { css } from 'lit';

export const fieldLayout = css`
  :host { display: block; min-inline-size: 0; }

  label { display: grid; gap: .375rem; }

  .label {
    color: var(--_lcars-muted);
    font: 500 .6875rem/1.4 var(--_lcars-mono);
    letter-spacing: .05em;
    text-transform: uppercase;
  }

  .control {
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: var(--_lcars-control-height);
  }

  .control:disabled { color: var(--_lcars-muted); cursor: not-allowed; }
`;

export const fieldSurface = css`
  .control {
    padding: .375rem .75rem;
    border: 1px solid var(--_lcars-line);
    border-inline-start: .25rem solid var(--_lcars-secondary);
    border-radius: .1875rem .375rem .375rem .1875rem;
    background: var(--_lcars-background);
    color: var(--_lcars-text);
    font: 1rem var(--_lcars-mono);
  }
`;
