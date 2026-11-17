import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import 'lcars-ui';
import type { LcarsButton } from 'lcars-ui';
import './dashboard.css';

function element<Tag extends keyof HTMLElementTagNameMap>(tag: Tag, id?: string) {
  const target = id === undefined ? document.querySelector(tag) : document.getElementById(id);
  if (target?.localName === tag) return target as HTMLElementTagNameMap[Tag];
  throw new Error(`Missing dashboard element ${tag}${id ? `#${id}` : ''}`);
}

const screen = element('lcars-screen');
const theme = element('lcars-toggle', 'theme');
theme.addEventListener('change', () => {
  screen.theme = theme.checked ? 'voyager' : 'tng';
});

const views = {
  overview: { title: 'Command Overview', context: 'Bridge / Sector 001' },
  engineering: { title: 'Engineering', context: 'Deck 36 / Main Engineering' },
  navigation: { title: 'Navigation', context: 'Bridge / Flight Control' },
};

const viewTitle = element('h1', 'view-title');
const viewContext = element('p', 'view-context');
const navigation = document.querySelectorAll<LcarsButton>('lcars-button[data-view]');

function showView(view: keyof typeof views) {
  for (const name of Object.keys(views)) {
    element('lcars-grid', name).hidden = name !== view;
  }
  for (const button of navigation) {
    button.active = button.dataset.view === view;
  }
  viewTitle.textContent = views[view].title;
  viewContext.textContent = views[view].context;
}

for (const button of navigation) {
  button.addEventListener('click', () => {
    const view = button.dataset.view;
    if (view && Object.hasOwn(views, view)) showView(view as keyof typeof views);
  });
}

const core = element('lcars-progress', 'core-output');
element('lcars-button', 'equalize').addEventListener('click', () => {
  core.value = 80;
  element('span', 'core-value').textContent = String(core.value);
  element('span', 'core-message').textContent = 'CORE EQUALIZED';
});

element('lcars-button', 'run-scan').addEventListener('click', () => {
  document.getElementById('new-contact')?.removeAttribute('hidden');
  document.getElementById('sensor-title')!.textContent =
    'Long-range sensors. Three contacts within eight light years.';
  element('span', 'scan-message').textContent = '3 CONTACTS TRACKED';
});

const frequency = element('lcars-input', 'frequency');
const hail = element('lcars-button', 'hail');
frequency.addEventListener('input', () => {
  hail.disabled = !frequency.value.trim();
  element('span', 'hail-message').textContent = 'STANDBY';
});

hail.addEventListener('click', () => {
  element('span', 'hail-message').textContent = `CHANNEL ${frequency.value.trim()} OPEN`;
});

const transfer = element('lcars-toggle', 'transfer');
const auxiliary = element('lcars-progress', 'auxiliary');
transfer.addEventListener('change', () => {
  auxiliary.value = transfer.checked ? 68 : 42;
  element('span', 'transfer-message').textContent =
    transfer.checked ? 'AUXILIARY TRANSFER ACTIVE' : 'TRANSFER NETWORK AVAILABLE';
});

const destination = element('lcars-input', 'destination');
const plot = element('lcars-button', 'plot-course');
const course = element('lcars-status', 'course-status');
const courseMessage = element('span', 'course-message');

destination.addEventListener('input', () => {
  plot.disabled = !destination.value.trim();
  course.state = 'offline';
  course.textContent = 'Awaiting course';
  courseMessage.textContent = 'NO ACTIVE COURSE';
});

plot.addEventListener('click', () => {
  course.state = 'nominal';
  course.textContent = 'Course locked';
  courseMessage.textContent = `HEADING SET / ${destination.value.trim()}`;
});
