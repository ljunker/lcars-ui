import { useEffect, useRef, useState } from 'react';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { createRoot } from 'react-dom/client';
import 'lcars-ui';
import type {
  LcarsHeader, LcarsPanel, LcarsProgress, LcarsScreen, LcarsToggle,
} from 'lcars-ui';

type ElementProps<ElementType extends HTMLElement, Props = unknown> =
  DetailedHTMLProps<HTMLAttributes<ElementType>, ElementType> & Props;

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lcars-screen': ElementProps<LcarsScreen, { theme?: LcarsScreen['theme'] }>;
      'lcars-header': ElementProps<LcarsHeader>;
      'lcars-panel': ElementProps<LcarsPanel>;
      'lcars-progress': ElementProps<LcarsProgress, { value?: number; label?: string }>;
      'lcars-toggle': ElementProps<LcarsToggle, { label?: string }>;
    }
  }
}

function Station() {
  const [transfer, setTransfer] = useState(false);
  const toggle = useRef<LcarsToggle>(null);

  useEffect(() => {
    const control = toggle.current!;
    const onChange = () => setTransfer(control.checked);
    control.addEventListener('change', onChange);
    return () => control.removeEventListener('change', onChange);
  }, []);

  return (
    <lcars-screen theme="voyager">
      <lcars-header slot="header" title="Outpost 47">
        React station controls
      </lcars-header>
      <lcars-panel title="Auxiliary power">
        <lcars-progress label="Reserve" value={transfer ? 87 : 41} />
        <lcars-toggle ref={toggle} label="Transfer power" />
      </lcars-panel>
    </lcars-screen>
  );
}

createRoot(document.getElementById('root')!).render(<Station />);
