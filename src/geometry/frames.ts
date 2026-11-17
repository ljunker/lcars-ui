import { css } from 'lit';

export const rail = css`
  .rail {
    display: block;
    flex: 1;
    min-inline-size: 0;
    block-size: var(--_lcars-rail-width);
    background: var(--_lcars-geometry-color, var(--_lcars-primary));
  }

  .rail.vertical {
    inline-size: var(--_lcars-rail-width);
    block-size: auto;
  }
`;

export const cap = css`
  .cap {
    flex: none;
    inline-size: var(--_lcars-cap-length, 2rem);
    block-size: var(--_lcars-rail-width);
    border-radius: 0 100vmax 100vmax 0;
    background: var(--_lcars-geometry-color, var(--_lcars-primary));
  }
`;

export const elbow = css`
  .elbow {
    position: relative;
    flex: none;
    inline-size: max(var(--_lcars-elbow-radius), var(--_lcars-rail-width));
    block-size: var(--_lcars-rail-width);
  }

  .elbow::before {
    position: absolute;
    inset: 0;
    block-size: var(--_lcars-elbow-size, var(--_lcars-elbow-radius));
    border-block-start: var(--_lcars-rail-width) solid var(--_lcars-geometry-color, var(--_lcars-primary));
    border-inline-start: var(--_lcars-rail-width) solid var(--_lcars-geometry-color, var(--_lcars-primary));
    border-start-start-radius: var(--_lcars-elbow-radius);
    content: '';
  }
`;
