# KalorienTracker - Entwicklungsdokumentation

## Projekt-Übersicht

Statische Single-Page-App für Kalorienverfolgung ohne Bundler oder Framework.

**Architektur:**
- `index.html` - App-Shell mit fixem Layout (Sidebar, View-Container, Modal, Toast)
- `styles.css` - Alle Styles mit Design-Token-System
- `app.js` - Gesamte Anwendungslogik (läuft direkt im Browser, kein Module-System)

## Lokale Entwicklung

**Preview-Server starten:**
```bash
python -m http.server 3000
```

**Wichtig:** Es gibt keine Build-, Lint- oder Test-Commands. Die App ist rein statisch.

## Code-Konventionen

### Namensgebung (IMMER Deutsch!)
- **Funktionen:** `bau*` (HTML generieren), `binde*` (Events binden), `zeige*` (Anzeigen)
- **Datenfelder:** `gewicht_eintraege`, `mahlzeit_vorlagen`, `tages_aktivitaetslevel`
- **Kommentare & UI:** Durchgehend deutsche Texte

**Beispiele:**
```javascript
function bauHeuteView() { /* ... */ }
function bindeHeuteEvents() { /* ... */ }
function zeigeToast(nachricht) { /* ... */ }
```

### Rendering-Pattern

**String-Template + Rebind:**
1. `bau*View()` / `bau*Tab()` Funktionen geben HTML-Strings zurück
2. `renderView()` oder `renderModalBody()` ersetzen `innerHTML`
3. `binde*Events()` muss Event-Listener NACH jedem Render neu binden

**Wichtig:** DOM-Referenzen überleben kein Render nicht → immer rebinden!

```javascript
function bauMeineView() {
  return `<button id="mein-btn">Klick</button>`;
}

function bindeMeineEvents() {
  document.getElementById('mein-btn')?.addEventListener('click', () => {
    // Handler
  });
}
```

## Datenbank (localStorage)

**Schema:** `db` Object in `localStorage` unter Key `kalorientracker_v1`

**Struktur:**
```javascript
{
  version: 3,
  profil: {...},
  gewicht_eintraege: [...],
  aktivitaet_eintraege: [...],
  tages_aktivitaetslevel: {...},
  eintraege: [...],           // Mahlzeiten
  mahlzeit_vorlagen: [...],
  tagesplanungen: [...],
  fasting_timer: null
}
```

### Migration bei neuen Feldern

**Wenn neue Felder hinzugefügt werden, MÜSSEN sie an 2 Stellen ergänzt werden:**

1. **Initial `db` Object** (~Zeile 140):
```javascript
let db = {
  version: 3,
  // ... existierende Felder
  neues_feld: [],  // ← HIER
};
```

2. **`ladeDaten()` Migration** (~Zeile 160):
```javascript
if (!db.neues_feld) db.neues_feld = [];  // ← UND HIER
```

**Warum:** Neue User bekommen das initiale `db`, bestehende User brauchen die Migration.

## Charts

**Bibliotheken:**
- Chart.js 4.4.0
- chartjs-adapter-date-fns 3.0.0 (für zeitbasierte X-Achsen)

**Wichtig:** Für Charts mit `type: 'time'` ist der Date-Adapter ERFORDERLICH.

**Chart Lifecycle:**
- `state.activeCharts` speichert aktive Chart-Instanzen
- `renderView()` zerstört alte Charts vor Rerender
- `initCharts()` erstellt neue Charts (nur in Grafiken-View)

## Nährwertfelder

`NUTRIENT_FIELDS` ist die **single source of truth** für:
- Nährwert-Keys
- Labels
- Einheiten
- Gruppierung

**Immer wiederverwenden, nicht hartcodieren!**

## Navigation

Über `NAV_ITEMS` Array gesteuert:
```javascript
{ view: 'name', label: 'Anzeige', icon: 'icon-key' }
```

Navigation erfolgt via `navigiere(viewName)` → rendert neue View.

## Datums-Format

- **Gespeichert:** `YYYY-MM-DD` Strings (via `toLocaleDateString('sv')`)
- **Events:** ISO-Strings mit Zeit
- **Anzeige:** `datumKurz()` und `datumFormat()` Hilfsfunktionen

## Styling

**Design-Token in `:root`:**
```css
--bg-primary, --bg-secondary, --text-primary, --accent, etc.
```

**Modifier-Klassen:**
```css
.btn--danger, .btn--full, .btn--small
```

**Charts haben eigene Card-Komponenten:**
```css
.chart-card, .chart-card--full, .chart-card-header
```

## Wichtige Hilfsfunktionen

- `speichereDaten()` - Muss nach jeder DB-Mutation aufgerufen werden
- `escHtml()` - IMMER für user-generierten Content in HTML verwenden
- `runden(zahl, stellen)` - Konsistente Zahlen-Formatierung
- `zeigeToast(nachricht)` - User-Feedback
- `zeigeBestaetigung(nachricht, callback)` - Bestätigungs-Dialog

## Bekannte Besonderheiten

1. **Gewichts-Einträge:** Pro Tag nur 1 Eintrag (wird ersetzt bei Duplikat)
2. **AI-Integration:** App ruft KEINE AI-API direkt - User kopiert Prompts manuell
3. **Modal-Workflows:** State über `state.modalTipo`, `state.modalTab`, parsed Preview-Daten
4. **Charts nur in Grafiken-View:** Nicht in anderen Views initialisieren

## Git Repository

- **Repository:** ErroRegro/kalorientracker
- **Branch:** main
- **Remote:** origin

---

*Letzte Aktualisierung: 2026-05-18*
*Commit: 11bf11f - Tagesplanungen-Feature und Gewichtsgrafik-Verbesserung*
