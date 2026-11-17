import { LcarsButton } from './components/button.js';
import { LcarsInput } from './components/input.js';
import { LcarsProgress } from './components/progress.js';
import { LcarsStatus } from './components/status.js';
import { LcarsToggle } from './components/toggle.js';
import { LcarsDivider } from './layouts/divider.js';
import { LcarsGrid } from './layouts/grid.js';
import { LcarsHeader } from './layouts/header.js';
import { LcarsPanel } from './layouts/panel.js';
import { LcarsScreen } from './layouts/screen.js';
import { LcarsSidebar } from './layouts/sidebar.js';
import { LcarsStack } from './layouts/stack.js';

export {
  LcarsButton, LcarsDivider, LcarsGrid, LcarsHeader, LcarsInput, LcarsPanel,
  LcarsProgress, LcarsScreen, LcarsSidebar, LcarsStack, LcarsStatus, LcarsToggle,
};

const elements = {
  'lcars-button': LcarsButton,
  'lcars-divider': LcarsDivider,
  'lcars-grid': LcarsGrid,
  'lcars-header': LcarsHeader,
  'lcars-input': LcarsInput,
  'lcars-panel': LcarsPanel,
  'lcars-progress': LcarsProgress,
  'lcars-screen': LcarsScreen,
  'lcars-sidebar': LcarsSidebar,
  'lcars-stack': LcarsStack,
  'lcars-status': LcarsStatus,
  'lcars-toggle': LcarsToggle,
};

declare global {
  interface HTMLElementTagNameMap {
    'lcars-button': LcarsButton;
    'lcars-divider': LcarsDivider;
    'lcars-grid': LcarsGrid;
    'lcars-header': LcarsHeader;
    'lcars-input': LcarsInput;
    'lcars-panel': LcarsPanel;
    'lcars-progress': LcarsProgress;
    'lcars-screen': LcarsScreen;
    'lcars-sidebar': LcarsSidebar;
    'lcars-stack': LcarsStack;
    'lcars-status': LcarsStatus;
    'lcars-toggle': LcarsToggle;
  }
}

for (const [tag, element] of Object.entries(elements)) {
  if (globalThis.customElements && !customElements.get(tag)) {
    customElements.define(tag, element);
  }
}
