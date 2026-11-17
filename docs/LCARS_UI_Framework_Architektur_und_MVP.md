# LCARS UI Framework – Architektur und MVP-Plan

## 1. Zielsetzung

Entwicklung eines **frameworkunabhängigen Designsystems mit vollständigen Layouts** für Webanwendungen im Stil von Star Trek LCARS (*Library Computer Access/Retrieval System*).

Die Bibliothek soll sowohl einzelne Komponenten in vorhandenen Webanwendungen als auch vollständige LCARS-Oberflächen ermöglichen. Nutzer der Bibliothek definieren die **Inhalte und die Struktur** eines Bildschirms; die Bibliothek erzeugt die typischen LCARS-Balken, Bögen, Rahmen, Abstände und Farben.

### Festgelegte Anforderungen

| Bereich | Entscheidung |
| --- | --- |
| Zielplattform | Webanwendungen im Browser |
| Design | Mehrere LCARS-Varianten als umschaltbare Themes |
| Umfang | Vollständiges Designsystem einschließlich Layout-Komponenten |
| Integration | Frameworkunabhängig; verwendbar mit HTML, React, Vue, Angular etc. |

### Leitprinzipien

1. **Webstandards zuerst:** Custom Elements, Slots, CSS Custom Properties und DOM-Events.
2. **Layout vor Dekoration:** LCARS-Formen unterstützen das Layout, bestimmen es aber nicht allein.
3. **Komposition statt starrer Vorlagen:** Komponenten lassen sich flexibel zusammenstellen.
4. **Theming ohne Umbau:** Themes ändern Farben und Geometrie, nicht die HTML-Struktur.
5. **Zugänglichkeit und Responsivität:** Tastaturbedienung, ausreichende Kontraste und sinnvolle Darstellung auf unterschiedlichen Geräten.
6. **Kleine, stabile öffentliche API:** Interne Implementierungsdetails bleiben austauschbar.

## 2. Empfohlener Tech-Stack

| Bereich | Technologie | Aufgabe |
| --- | --- | --- |
| Programmiersprache | TypeScript | Komponentenlogik und Typdefinitionen |
| Komponenten | Lit / native Web Components | Reaktive, frameworkunabhängige Custom Elements |
| Layout | CSS Grid, Flexbox, Container Queries | Responsive Struktur |
| Formen | CSS + SVG | Balken, Rundungen und komplizierte Verbindungen |
| Themes | CSS Custom Properties | Farben, Typografie, Geometrie und Varianten |
| Entwicklung / Build | Vite + TypeScript | Playground, Bundling und Builds |
| Dokumentation | Storybook | Interaktiver Komponentenkatalog |
| Unit-Tests | Vitest | Logik und Hilfsfunktionen |
| Browser-Tests | Playwright | Interaktion, Accessibility-Checks und Screenshots |
| Paketverwaltung | pnpm | Dependencies und Scripts |
| Distribution | npm | Verwendung in anderen Projekten |
| CI | GitHub Actions | Test, Build und Veröffentlichung |

**Warum Lit?** Lit reduziert den Boilerplate bei Web Components, während die veröffentlichte API aus Standard-HTML-Elementen, Properties, Slots und Events besteht. Das konsumierende Projekt muss weder React noch Lit als UI-Framework verwenden.

## 3. Architektur

```text
Anwendungen
(HTML / React / Vue / Angular)
          |
          v
+-----------------------------+
| Öffentliche Custom Elements |
| Layouts + UI-Komponenten    |
+-----------------------------+
          |
          v
+-----------------------------+
| LCARS-Geometrie und Styles  |
| Rails, Elbows, Caps, Frames |
+-----------------------------+
          |
          v
+-----------------------------+
| Design Tokens und Themes    |
+-----------------------------+
```

Die Architektur besteht aus vier logisch getrennten Bereichen:

### 3.1 Design Tokens

Tokens sind die einzige verbindliche Quelle für globale visuelle Werte. Sie werden als CSS Custom Properties bereitgestellt und in TypeScript, falls notwendig, typisiert.

Beispiele:

```css
--lcars-color-primary: #d99e73;
--lcars-color-secondary: #a99bd3;
--lcars-color-background: #08080b;
--lcars-color-text: #f3e5d5;
--lcars-color-alert: #ef7b76;

--lcars-rail-width: 1.75rem;
--lcars-elbow-radius: 2rem;
--lcars-gap: 0.5rem;
--lcars-font-family: system-ui, sans-serif;
--lcars-font-size: 1rem;
```

Die Werte oben sind **illustrative Startwerte**, keine verbindliche Rekonstruktion einer Star-Trek-Farbpalette.

Zwei Gruppen sind wichtig:

- **Semantische Tokens:** `primary`, `secondary`, `alert`, `background`, `text`, `surface`.
- **Geometrische Tokens:** `rail-width`, `elbow-radius`, `gap`, `header-height`, `control-height`.

Komponenten sollen Tokens verwenden, statt eigene Werte zu duplizieren.

### 3.2 Themes

Vorgesehene Themes:

1. **TNG Classic:** Klassische LCARS-Anmutung, warme Pastelltöne und breite Balken.
2. **Voyager:** Alternative Palette und Varianten der Komponentengestaltung.
3. **Modern LCARS:** Modernisierte Interpretation mit variabler Dichte und verbessertem Kontrast.

Für den MVP werden **TNG Classic und Voyager** umgesetzt. Modern LCARS folgt später.

Theming erfolgt z. B. über ein Attribut auf dem Root-Element:

```html
<lcars-screen theme="tng">...</lcars-screen>
```

Themes müssen zur Laufzeit austauschbar sein:

```js
const screen = document.querySelector('lcars-screen');
screen.setAttribute('theme', 'voyager');
```

Intern setzt `lcars-screen` dazu geeignete Token-Werte. Theme-Variablen werden an Kindkomponenten vererbt, auch über Shadow-DOM-Grenzen. Bei verschachtelten Komponenten muss explizit getestet werden, ob Token-Overrides korrekt greifen.

### 3.3 LCARS-Geometrie

Die Besonderheit des Projekts ist eine wiederverwendbare Geometrieschicht, die die typischen Formen liefert:

- **Rail:** vertikaler bzw. horizontaler Balken.
- **Cap:** abgerundeter Abschluss.
- **Elbow:** Übergang von vertikalem zu horizontalem Balken.
- **Frame:** Zusammensetzung aus Rails, Elbows und freien Inhaltsregionen.

**Rendering-Strategie:**

- Einfache Rechtecke, Rundungen und Abstände mit CSS.
- Komplizierte Verbindungen bei Bedarf mit SVG.
- CSS Grid/Flexbox für das eigentliche Layout.
- Geometrie und Inhalte bewusst getrennt halten.

**Nicht** den gesamten Bildschirm als eine einzige SVG- oder Canvas-Fläche zeichnen: Das würde die Integration normaler HTML-Inhalte, Formularfelder, Browserverhalten und Accessibility erschweren.

Eine spätere **Layout-Engine** kann selbstständig Verbindungen zwischen angrenzenden Regionen berechnen. Für den MVP reichen zunächst deklarative Layout-Komponenten mit klar definierten Rahmenformen.

### 3.4 Komponenten

#### Layout-Komponenten

| Komponente | Zweck |
| --- | --- |
| `lcars-screen` | Root-Element, Theme und Bildschirmstruktur |
| `lcars-header` | Kopfbereich mit Titel und LCARS-Rahmen |
| `lcars-sidebar` | Navigation mit vertikalen LCARS-Balken |
| `lcars-grid` | Responsives Inhaltsraster |
| `lcars-panel` | Inhaltsbereich mit Titel und optionalem Rahmen |
| `lcars-stack` | Horizontale oder vertikale Anordnung |
| `lcars-divider` | Dekorative und funktionale Trennung |
| `lcars-elbow` | Wiederverwendbares Geometrie-Primitiv, ggf. intern |

#### Interaktive Komponenten

- `lcars-button`
- `lcars-input`
- `lcars-select`
- `lcars-toggle`
- `lcars-slider`
- `lcars-tabs`
- `lcars-dialog`

#### Anzeige- und Datenkomponenten

- `lcars-progress`
- `lcars-status`
- `lcars-gauge`
- `lcars-table`
- `lcars-metric`
- `lcars-bar-chart`

Für Diagramme zunächst keine eigene Chart-Engine entwickeln. Gegebenenfalls vorhandene Chart-Libraries durch LCARS-Styles ergänzen.

## 4. Öffentliche API und Integration

### 4.1 Beispiel für eine fertige LCARS-Oberfläche

Das folgende Beispiel beschreibt die **angestrebte API**; die Komponenten müssen im MVP erst implementiert werden.

```html
<script type="module" src="/src/main.ts"></script>

<lcars-screen theme="tng">
  <lcars-header slot="header" title="USS ENTERPRISE">
    NCC-1701-D
  </lcars-header>

  <lcars-sidebar slot="navigation">
    <lcars-button active>Overview</lcars-button>
    <lcars-button>Engineering</lcars-button>
    <lcars-button>Navigation</lcars-button>
  </lcars-sidebar>

  <lcars-grid columns="2">
    <lcars-panel title="Warp Core">
      <lcars-progress value="75" max="100"></lcars-progress>
    </lcars-panel>

    <lcars-panel title="Ship Status">
      <lcars-status state="nominal">
        All systems operational
      </lcars-status>
    </lcars-panel>
  </lcars-grid>
</lcars-screen>
```

Die Komponente `lcars-screen` stellt dafür Slots für `header` und `navigation` sowie einen Standard-Slot für den Hauptinhalt bereit. `lcars-grid` interpretiert die Spaltenzahl und passt sie bei kleinen Viewports an.

### 4.2 API-Konventionen

- **Attribute** für einfache Werte (`theme`, `value`, `max`, `title`, `active`).
- **JavaScript-Properties** für komplexe Daten.
- **Native DOM-Events** für Interaktion; nach Möglichkeit das Verhalten vorhandener HTML-Elemente übernehmen.
- **Slots** für frei zusammensetzbare Inhalte.
- **CSS Custom Properties** für Theming und einfache Anpassung.
- **`::part()`** für gezielt freigegebene interne Styling-Hooks.
- **Semantische Elemente** in Shadow DOM, z. B. echte `<button>`- und `<input>`-Elemente, inklusive Fokus- und Tastaturverhalten.
- **Dokumentierte TypeScript-Definitionen** und konsistentes Naming.

Besonders bei Formularen muss früh entschieden werden, ob Custom Elements mittels `ElementInternals` form-associated werden sollen. Für den MVP sollten `lcars-input` und `lcars-toggle` entweder korrekt mit Formularen integrierbar sein oder diese Einschränkung ausdrücklich dokumentieren.

## 5. Repository-Struktur

Anfangs wird nur **ein npm-Package** veröffentlicht. Eine Aufteilung in mehrere veröffentlichte Packages ist optional und erst später sinnvoll.

```text
lcars-ui/
├── src/
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── geometry.ts
│   ├── themes/
│   │   ├── tng.css
│   │   ├── voyager.css
│   │   └── modern.css
│   ├── geometry/
│   │   ├── elbow.ts
│   │   ├── rail.ts
│   │   └── cap.ts
│   ├── components/
│   │   ├── button/
│   │   ├── input/
│   │   ├── progress/
│   │   └── status/
│   ├── layouts/
│   │   ├── screen/
│   │   ├── header/
│   │   ├── sidebar/
│   │   ├── panel/
│   │   └── grid/
│   ├── styles/
│   │   └── base.css
│   └── index.ts
├── apps/
│   ├── playground/
│   └── storybook/
├── examples/
│   ├── vanilla-html/
│   └── react/
├── tests/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Beim Export darauf achten, dass Custom Elements nicht mehrfach registriert werden. Der Package-Entry-Point kann die Elemente importieren und einmalig registrieren; optional gibt es später getrennte Component-Entries für Tree-Shaking.

## 6. MVP-Implementierungsplan

Der MVP dient als technischer Proof of Concept für eine **vollständig funktionierende LCARS-Dashboard-Anwendung**, die nur mit Komponenten der Bibliothek aufgebaut wird.

### Phase 1 – Designsystem und Geometrie

- [ ] TypeScript-, Lit- und Vite-Projekt aufsetzen.
- [ ] Gemeinsame Design Tokens definieren.
- [ ] Themes TNG Classic und Voyager erstellen.
- [ ] Rails, Caps und Elbows umsetzen.
- [ ] Geometrie bei variablen Breiten/Höhen prüfen.
- [ ] Einfachen Playground für Formen und Tokens erstellen.

**Ergebnis:** Wiederverwendbare Formen und zwei umschaltbare Themes.

### Phase 2 – Layout-System

- [ ] `lcars-screen` erstellen.
- [ ] `lcars-header` erstellen.
- [ ] `lcars-sidebar` erstellen.
- [ ] `lcars-panel` erstellen.
- [ ] `lcars-grid` erstellen.
- [ ] Slots, Abstände und Inhaltsfluss festlegen.
- [ ] Responsives Verhalten für Tablet und kleine Viewports testen.

**Ergebnis:** Vollständiger statischer LCARS-Bildschirm ohne individuelles Layout-CSS in der Demo.

### Phase 3 – Funktionale UI-Komponenten

- [ ] `lcars-button` einschließlich `disabled`, `active` und Tastaturbedienung.
- [ ] `lcars-progress` einschließlich Wertebereich.
- [ ] `lcars-status` mit semantischen Zuständen.
- [ ] `lcars-input` einschließlich Fokuszuständen.
- [ ] `lcars-toggle` einschließlich Zustand und Event.
- [ ] Einheitliche Events, Properties und dokumentierte Styling-Schnittstellen.
- [ ] Kontrast und Fokusindikatoren prüfen.

**Ergebnis:** Ein Dashboard mit tatsächlich nutzbaren Bedienelementen.

### Phase 4 – Showcase-Anwendung

- [ ] Beispiel-Dashboard mit Navigation, Statusanzeigen und dynamischen Werten.
- [ ] Theme-Wechsel zur Laufzeit.
- [ ] Bildschirmgrößen und Touch-Bedienung testen.
- [ ] Vanilla-HTML-Integration als Referenz prüfen.
- [ ] Prüfen, ob die Demo ohne zusätzliche CSS-Sonderlösungen auskommt.

**Ergebnis:** Vollständige, lauffähige LCARS-Beispielanwendung als Qualitätsmaßstab für die API.

### Phase 5 – Tests, Dokumentation und Release

- [ ] Storybook-Komponentenkatalog.
- [ ] Vitest-Tests für Logik, Zustände und Geometrie-Hilfen.
- [ ] Playwright-Tests für Interaktion und Keyboard-Navigation.
- [ ] Visuelle Regressionstests für beide Themes und mehrere Viewportgrößen.
- [ ] Integrationsbeispiele für HTML und React.
- [ ] README, Installationsanleitung und API-Dokumentation.
- [ ] GitHub Actions für Build, Tests und Release.
- [ ] npm-Package als erste Version veröffentlichen.

**Ergebnis:** Dokumentierte, testbare, installierbare Komponentenbibliothek.

## 7. Definition of Done für den MVP

Der MVP ist abgeschlossen, wenn:

1. Ein neues Webprojekt die Bibliothek installieren und ohne UI-Framework nutzen kann.
2. Ein vollständiger LCARS-Bildschirm aus den Layout-Komponenten erstellt werden kann.
3. Zwischen mindestens **TNG Classic** und **Voyager** gewechselt werden kann, ohne Markup umzubauen.
4. Buttons und Eingabekomponenten benutzbar sind und erwartbare DOM-Events auslösen.
5. Desktop und Tablet sinnvoll unterstützt werden.
6. Farben, Abstände und grundlegende Formen über Tokens angepasst werden können.
7. Basistests, Dokumentation und mindestens ein vollständiges Beispiel vorhanden sind.

### Bewusst nicht im MVP

- Visueller Drag-and-Drop-Screen-Editor.
- Eigenes Routing oder State-Management.
- Umfangreiche Animations-Engine.
- Eigene Diagramm-Engine.
- Vollautomatische Verbindung beliebig angeordneter Panels.
- Vollständige Rekonstruktion aller Star-Trek-LCARS-Varianten.

## 8. Weiterentwicklung nach dem MVP

### Weitere Themes

Modern LCARS und zusätzliche historische bzw. gestalterische Varianten.

### Größere Komponentenbibliothek

Tabellen, Dialoge, Tabs, Gauges, Datenvisualisierungen und weitere Eingabekomponenten.

### Deklarative LCARS-Layout-Engine

Entwickler beschreiben Bildschirmregionen und ihre Beziehungen, nicht die einzelnen dekorativen Linien. Die Engine erzeugt selbstständig passende Rails, Caps und Elbows, wenn Panels nebeneinanderliegen.

Beispiel einer langfristigen API-Idee:

```html
<lcars-layout>
  <lcars-region name="navigation" position="left">...</lcars-region>
  <lcars-region name="main" position="center">...</lcars-region>
  <lcars-region name="status" position="bottom">...</lcars-region>
</lcars-layout>
```

Die genaue Syntax und das Verhalten müssen nach Erfahrungen mit dem MVP festgelegt werden.

## 9. Empfehlung für den allerersten Proof of Concept

Vor einer großen Komponentenbibliothek sollten diese vier Elemente gemeinsam funktionieren:

- `lcars-screen`
- `lcars-header`
- `lcars-sidebar`
- `lcars-panel`

Dazu zwei Themes und ein kleines responsives Dashboard. Wenn daraus ein überzeugendes LCARS-Layout entsteht, ohne dass die Beispielanwendung eigene CSS-Hacks schreiben muss, ist die zentrale Architekturentscheidung validiert.

## 10. Hinweise für eine öffentliche Veröffentlichung

LCARS ist eng mit *Star Trek* verbunden. Für ein öffentliches Projekt sollten Grafiken und Assets eigenständig erstellt bzw. korrekt lizenziert werden. Schriftlizenzen und mögliche Marken-/Designrechte sind insbesondere bei kommerzieller Nutzung gesondert zu prüfen.
