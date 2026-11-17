# LCARS UI

Frameworkunabhängige Web Components für LCARS-Oberflächen. Die Bibliothek enthält Layouts, Controls und die zur Laufzeit umschaltbaren Themes **TNG Classic** und **Voyager**.

## Dashboard starten

Voraussetzungen sind Node.js 24 und pnpm 11.

```sh
pnpm install
pnpm dev
```

| Pfad | Inhalt |
| --- | --- |
| `/` | USS-Enterprise-Dashboard mit Navigation, Telemetrie und bedienbaren Controls |
| `/apps/playground/geometry.html` | Rails, Caps und Elbows mit veränderbarer Geometrie |
| `/examples/vanilla-html/` | HTML-Integration mit nativen DOM-Events |
| `/examples/react/` | React-Integration mit TypeScript und nativen DOM-Events |

`pnpm storybook` startet den interaktiven Komponentenkatalog.

## Paket installieren

Das lokale Paket lässt sich in einem separaten Projekt installieren und mit einem ESM-fähigen Bundler wie Vite laden.

```sh
pnpm build
pnpm pack
cd /pfad/zur/anwendung
npm install /pfad/zu/lcars-ui/lcars-ui-0.1.3.tgz
```

Das veröffentlichte Paket lässt sich mit `npm install lcars-ui` installieren. In einem Projekt mit Vite reicht dieser Modulimport.

```html
<script type="module">
  import 'lcars-ui';
</script>

<lcars-screen theme="tng">
  <lcars-header slot="header" title="Outpost 47">Station controls</lcars-header>
  <lcars-sidebar slot="navigation" label="Station">
    <lcars-button appearance="navigation" active>Overview</lcars-button>
  </lcars-sidebar>
  <lcars-grid columns="2">
    <lcars-panel title="Power reserves">
      <lcars-progress label="Battery" value="75" max="100"></lcars-progress>
    </lcars-panel>
    <lcars-panel title="Telemetry">
      <lcars-status state="nominal">Online</lcars-status>
    </lcars-panel>
  </lcars-grid>
</lcars-screen>
```

Der Import registriert die Custom Elements im Browser und exportiert ihre Klassen und Typen. Bereits belegte Elementnamen bleiben bei einem erneuten Import erhalten. TypeScript kennt die Elementtypen über `HTMLElementTagNameMap`. Für JSX zeigt das [React-Beispiel](examples/react/main.tsx) die passenden Typdeklarationen.

## Komponenten-API

| Element | Attribute | Slots | CSS Parts |
| --- | --- | --- | --- |
| `lcars-screen` | `theme="tng\|voyager"` | `header`, `navigation`, Standard für Hauptinhalt | `screen`, `body`, `main` |
| `lcars-header` | `title` | `leading`, `actions`, Standard für Untertitel | `header`, `leading`, `title`, `frame`, `elbow`, `rail`, `cap` |
| `lcars-sidebar` | `label` für den Navigationsbereich | `heading`, `footer`, Standard für Navigation | `navigation`, `links`, `footer`, `rail` |
| `lcars-grid` | `columns` von 1 bis 12, Standard 2 | Standard | `grid` |
| `lcars-panel` | `title`, `frameless` | `meta` neben dem Titel, Standard für Inhalt | `frame`, `header`, `title`, `content` |
| `lcars-stack` | `direction="horizontal"` für umbrechende Zeilen, `justify="between"` | Standard | `stack` |
| `lcars-divider` | | | `divider`, `rail`, `cap` |
| `lcars-button` | `label` für einen optionalen zugänglichen Namen, `active`, `disabled`, `tone`, `appearance="outline\|navigation"` | Standard für Beschriftung | `control` |
| `lcars-progress` | `label`, `value`, `max`, `tone`, `segmented`, `hide-readout` | | `track`, `readout` |
| `lcars-status` | `state="nominal\|warning\|alert\|offline"` | Standard für Statustext | `status`, `indicator` |
| `lcars-input` | `label`, `value`, `placeholder`, `disabled` | | `label`, `control` |
| `lcars-select` | `label`, `value`, `disabled` | | `label`, `control` |
| `lcars-slider` | `label`, `value`, `min`, `max`, `step`, `disabled` | | `label`, `control`, `readout` |
| `lcars-toggle` | `label`, `checked`, `disabled` | | `label`, `control`, `track` |

Bei wenig Platz rückt die Navigation über den Hauptinhalt. Das Raster reduziert die Spalten anhand seiner verfügbaren Breite. `tone` unterstützt `primary` (Standard), `secondary` und `accent`. Boolean-Attribute werden durch ihre Anwesenheit aktiviert. `active` kennzeichnet die aktuelle Auswahl mit `aria-current`. `lcars-progress` begrenzt den angezeigten Wert auf `0…max` und verwendet bei ungültigem Maximum den Wert 100.

### Properties und Events

- `lcars-button` gibt den nativen `click` des internen Buttons weiter. Tastaturaktivierung erfolgt mit Enter oder Leertaste.
- `lcars-input` aktualisiert `value` bei der Eingabe. `input` signalisiert laufende Änderungen, `change` die bestätigte Änderung.
- `lcars-select` und `lcars-slider` stellen den aktuellen Wert als String bzw. Zahl über `.value` bereit.
- `lcars-toggle` aktualisiert `checked`. Alle vier Controls geben bei Bedienung `input` und `change` über die Shadow-DOM-Grenze weiter. Programmatische Zuweisungen aktualisieren die Anzeige ohne Eingabe-Events.
- Formulardaten liest die Anwendung aus `.value` bzw. `.checked` aus. Datenerfassung, Reset und Validierung dieser Controls liegen im Anwendungscode.

### Select und Slider

```html
<lcars-select label="Approach mode">
  <option value="">Choose a mode</option>
  <optgroup label="Flight">
    <option value="standard" selected>Standard</option>
    <option value="docking">Docking</option>
  </optgroup>
</lcars-select>
<lcars-slider label="Maneuvering thrust" min="0" max="100" step="5" value="25"></lcars-slider>
```

Das Select übernimmt direkte `<option>`- und `<optgroup>`-Kinder und synchronisiert Änderungen am Markup. Ohne Wertvorgabe gilt die native Standardauswahl. Ein gesetzter oder gewählter Wert bleibt bei Optionsänderungen maßgeblich. Fehlt die passende Option, ist die Auswahl leer. Das Entfernen eines gesetzten `value`-Attributs oder `select.value = null` stellt die Standardauswahl wieder her.

Der Slider verwendet standardmäßig `min=0`, `max=100` und `step=1`. `step="any"` erlaubt beliebige Zwischenschritte. Ohne Wertvorgabe bestimmt das native Range-Feld den Startwert. Nach einer programmatischen Änderung liefert `.value` den normalisierten Wert, sobald `slider.updateComplete` aufgelöst ist.

### Themes und Tokens

Setze `screen.theme = 'voyager'` oder ändere das `theme`-Attribut. Farben und Maße ändern sich sofort im gesamten Screen. Ohne Theme-Attribut gilt TNG Classic. Die öffentlichen Tokens werden über Shadow-DOM-Grenzen vererbt. Lokale Overrides gelten für den jeweiligen Teilbaum.

```css
lcars-screen.brand-theme {
  --lcars-color-primary: #a0ffb0;
  --lcars-rail-width: 0.875rem;
  --lcars-elbow-radius: 1.5rem;
  --lcars-gap: 1rem;
}

lcars-button::part(control) {
  letter-spacing: 0.08em;
}
```

| Bereich | Tokens |
| --- | --- |
| Farben | `--lcars-color-primary`, `--lcars-color-secondary`, `--lcars-color-accent`, `--lcars-color-background`, `--lcars-color-surface`, `--lcars-color-text`, `--lcars-color-muted`, `--lcars-color-line`, `--lcars-color-ink`, `--lcars-color-nominal`, `--lcars-color-warning`, `--lcars-color-alert` |
| Geometrie | `--lcars-rail-width`, `--lcars-elbow-radius`, `--lcars-gap`, `--lcars-header-height`, `--lcars-control-height`, `--lcars-navigation-width` |
| Typografie | `--lcars-font-family`, `--lcars-font-display`, `--lcars-font-mono`, `--lcars-font-size` |
| Layout | `--lcars-screen-padding`, `--lcars-screen-gap`, `--lcars-screen-min-height`, `--lcars-screen-max-width`, `--lcars-sidebar-min-height`, `--lcars-grid-gap`, `--lcars-grid-template-columns` (für breite Grids), `--lcars-panel-padding`, `--lcars-panel-gap`, `--lcars-stack-gap` |
| Anzeigen | `--lcars-progress-height`, `--lcars-divider-height` |

## Bauen und testen

```sh
pnpm typecheck
pnpm test
pnpm exec playwright install chromium
pnpm test:browser
pnpm build
pnpm build:showcase
pnpm build:storybook
```

Playwright prüft Tastatur, Touch, Kontrast mit axe, Token-Vererbung und Integrationen. Die Screenshot-Referenzen für beide Themes bei Desktop- und Tabletbreite liegen unter `tests/browser/snapshots/` für Linux und macOS. Bei beabsichtigten visuellen Änderungen kannst du sie mit `pnpm test:browser --update-snapshots` aktualisieren.

Der Showcase enthält Barlow Condensed und IBM Plex Mono. Ihre SIL-OFL-Lizenztexte liegen im Showcase-Build unter `licenses/`. Die Bibliothek verwendet standardmäßig Systemschriften.

## Release

Der GitHub-Workflow prüft Build, Tests und Beispiele. Ein Tag wie `v0.1.3` muss zur Paketversion passen. Bei einem Tag-Push packt der Workflow die Bibliothek nach erfolgreichen Prüfungen und veröffentlicht den Tarball über npm Trusted Publishing in der GitHub-Umgebung `npm`. [GitHub-Workflow](.github/workflows/ci.yml), [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)
