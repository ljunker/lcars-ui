import 'lcars-ui';
import type { LcarsToggle } from 'lcars-ui';

const screen = document.querySelector('lcars-screen')!;

function onToggle(id: string, update: (checked: boolean) => void) {
  const toggle = document.querySelector<LcarsToggle>(`#${id}`)!;
  toggle.addEventListener('change', () => update(toggle.checked));
}

onToggle('theme', (checked) => {
  screen.theme = checked ? 'voyager' : 'tng';
});

onToggle('wide', (checked) => {
  screen.style.setProperty('--lcars-rail-width', checked ? '1.25rem' : '');
});

onToggle('large', (checked) => {
  screen.style.setProperty('--lcars-elbow-radius', checked ? '3rem' : '');
});
