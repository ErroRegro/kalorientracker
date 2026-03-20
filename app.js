'use strict';

// ===== KONFIGURATION =====

const STORAGE_KEY = 'kalorientracker_v1';

const NUTRIENT_FIELDS = [
  { key: 'kalorien',                   label: 'Kalorien',                   unit: 'kcal', group: 'main' },
  { key: 'protein',                    label: 'Protein',                    unit: 'g',    group: 'main' },
  { key: 'fett',                       label: 'Fett',                       unit: 'g',    group: 'main' },
  { key: 'fett_gesaettigt',            label: 'davon gesättigt',            unit: 'g',    group: 'fett' },
  { key: 'fett_einfach_ungesaettigt',  label: 'davon einfach ungesättigt',  unit: 'g',    group: 'fett' },
  { key: 'fett_mehrfach_ungesaettigt', label: 'davon mehrfach ungesättigt', unit: 'g',    group: 'fett' },
  { key: 'fett_trans',                 label: 'davon Trans-Fettsäuren',     unit: 'g',    group: 'fett' },
  { key: 'kohlenhydrate',              label: 'Kohlenhydrate',              unit: 'g',    group: 'main' },
  { key: 'zucker',                     label: 'davon Zucker',               unit: 'g',    group: 'kh'   },
  { key: 'ballaststoffe',              label: 'Ballaststoffe',              unit: 'g',    group: 'main' },
  { key: 'salz',                       label: 'Salz',                       unit: 'g',    group: 'main' },
];

const AKTIVITAETS_LEVELS = [
  { key: 'sitzend',  label: 'Sitzend',  beschreibung: 'Bürojob, wenig Bewegung', faktor: 1.2 },
  { key: 'gemischt', label: 'Gemischt', beschreibung: 'Etwas Alltagsbewegung',   faktor: 1.4 },
  { key: 'aktiv',    label: 'Aktiv',    beschreibung: 'Körperlich aktiver Job',   faktor: 1.6 },
];

const NAV_ITEMS = [
  { view: 'heute',    label: 'Heute',    icon: 'home'      },
  { view: 'verlauf',  label: 'Verlauf',  icon: 'calendar'  },
  { view: 'grafiken', label: 'Grafiken', icon: 'chart'     },
  { view: 'profil',   label: 'Profil',   icon: 'user'      },
  { view: 'daten',    label: 'Daten',    icon: 'database'  },
];

const ICONS = {
  home:      `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
  calendar:  `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  chart:     `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
  user:      `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  database:  `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/></svg>`,
  plus:      `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.25" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>`,
  trash:     `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
  download:  `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`,
  upload:    `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>`,
  copy:      `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
  bookmark:  `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>`,
  chevronR:  `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>`,
  chevronL:  `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>`,
  lightning: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  scale:     `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 3v1M3 9h18M5 9l2 9h10l2-9M9 9V6a3 3 0 016 0v3"/></svg>`,
};

const AI_PROMPT_MAHLZEIT = `Analysiere die folgende Mahlzeit und erstelle ein JSON-Array.
Erstelle für jede Zutat ein eigenes Objekt. Erstelle danach die json die gut formatiert ist und leicht zu kopieren ist.

Mahlzeit: [HIER DEINE MAHLZEIT BESCHREIBEN]

Gib ausschließlich ein JSON-Array zurück (kein Text davor oder danach, kein Markdown):
[
  {
    "name": "Zutatname",
    "menge": 100,
    "kalorien": 0,
    "protein": 0,
    "fett": 0,
    "fett_gesaettigt": 0,
    "fett_einfach_ungesaettigt": 0,
    "fett_mehrfach_ungesaettigt": 0,
    "fett_trans": 0,
    "kohlenhydrate": 0,
    "zucker": 0,
    "ballaststoffe": 0,
    "salz": 0
  }
]

Regeln:
- "menge" immer in Gramm (bei Flüssigkeiten: ml ≈ g)
- Alle Nährwerte für die angegebene Menge (NICHT pro 100g)
- Alle Werte als Dezimalzahl (z.B. 1.5, nicht "1,5")
- Nur das JSON-Array ausgeben, nichts anderes

Die Mahlzeiten folgen im weiteren Verlauf des Chats. Halte dich IMMER an die Vorgaben.
`;

function getAktivitaetsPrompt() {
  if (!db.profil) return '(Bitte zuerst das Profil ausfüllen)';
  const gw = letzteGewicht(heuteStr());
  const alter = berechneAlter();
  const geschlecht = db.profil.geschlecht === 'mann' ? 'Mann' : 'Frau';
  const gewichtStr = gw ? `${gw.gewicht} kg` : '? kg';
  return `Ich bin ${geschlecht}, ${alter} Jahre alt, ${db.profil.groesse} cm groß und wiege ${gewichtStr}. Im nachfolgenden Chat werde ich die Aktivitäten beschreiben. Berechne den Kalorienverbrauch für diese. IMMER im JSON-Format.

JSON-Format:
[{ "name": "...", "dauer_min": 0, "verbrauch_kcal": 0 }]

Regeln:
- "dauer_min" ist die Dauer in Minuten (0 wenn unbekannt)
- "verbrauch_kcal" ist der Gesamtverbrauch für die Aktivität
- Nur das JSON-Array ausgeben, nichts anderes

Die Aktivitäten folgen im weiteren Verlauf des Chats. Halte dich IMMER an das Format.`;
}

// ===== STATE =====

const state = {
  currentView: 'heute',
  verlaufDate: null,
  chartRange: 14,
  modalTab: 'json',
  modalTipo: 'mahlzeit',
  modalDate: null,
  parsedIngredients: null,
  parsedActivities: null,
  parsedWeights: null,
  activeCharts: {},
  showGewichtForm: false,
  vorlagenEdit: null,     // null = liste, Array = deep-copy zutaten in Bearbeitung
  vorlagenOriginal: null, // Originalwerte der Vorlage als Referenz für Proportionalrechnung
  vorlagePending: null,   // zutaten die als neue Vorlage gespeichert werden sollen
};

// ===== DATENBANK =====

let db = {
  version: 3,
  profil: null,
  gewicht_eintraege: [],
  aktivitaet_eintraege: [],
  tages_aktivitaetslevel: {},
  eintraege: [],
  mahlzeit_vorlagen: [],
};

function ladeDaten() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.eintraege) {
        db = parsed;
        // Migration: neue Felder ergänzen falls noch nicht vorhanden
        if (!db.profil) db.profil = null;
        if (!db.gewicht_eintraege) db.gewicht_eintraege = [];
        if (!db.aktivitaet_eintraege) db.aktivitaet_eintraege = [];
        if (!db.tages_aktivitaetslevel) db.tages_aktivitaetslevel = {};
        if (!db.mahlzeit_vorlagen) db.mahlzeit_vorlagen = [];
        db.version = 3;
      }
    }
  } catch (e) {
    console.error('Fehler beim Laden:', e);
  }
}

function speichereDaten() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    zeigeToast('Speichern fehlgeschlagen', 'error');
  }
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function heuteStr() {
  return new Date().toLocaleDateString('sv');
}

// ===== MAHLZEIT-DATEN =====

function eintraegeVonDatum(datum) {
  return db.eintraege
    .filter(e => e.datum === datum)
    .sort((a, b) => a.zeitstempel.localeCompare(b.zeitstempel));
}

function aktiveDaten() {
  return [...new Set(db.eintraege.map(e => e.datum))].sort((a, b) => b.localeCompare(a));
}

function summiereNaehrstoffe(zutaten) {
  const summen = {};
  NUTRIENT_FIELDS.forEach(f => {
    summen[f.key] = zutaten.reduce((s, z) => s + (Number(z[f.key]) || 0), 0);
  });
  return summen;
}

function tagesSumme(datum) {
  return summiereNaehrstoffe(eintraegeVonDatum(datum).flatMap(e => e.zutaten));
}

function eintragHinzufuegen(eintrag) {
  db.eintraege.push(eintrag);
  speichereDaten();
}

function eintragLoeschen(id) {
  db.eintraege = db.eintraege.filter(e => e.id !== id);
  speichereDaten();
}

// ===== VORLAGEN =====

function vorlageHinzufuegen(vorlage) {
  db.mahlzeit_vorlagen.push(vorlage);
  speichereDaten();
}

function vorlageLoeschen(id) {
  db.mahlzeit_vorlagen = db.mahlzeit_vorlagen.filter(v => v.id !== id);
  speichereDaten();
}

// ===== GEWICHT-DATEN =====

function letzteGewicht(datum) {
  return db.gewicht_eintraege
    .filter(e => e.datum <= datum)
    .sort((a, b) => b.datum.localeCompare(a.datum))[0] || null;
}

function gewichtHinzufuegen(eintrag) {
  // Wenn gleicher Datums-Eintrag vorhanden → ersetzen
  db.gewicht_eintraege = db.gewicht_eintraege.filter(e => e.datum !== eintrag.datum);
  db.gewicht_eintraege.push(eintrag);
  speichereDaten();
}

function gewichtLoeschen(id) {
  db.gewicht_eintraege = db.gewicht_eintraege.filter(e => e.id !== id);
  speichereDaten();
}

function gewichteSortiert() {
  return [...db.gewicht_eintraege].sort((a, b) => b.datum.localeCompare(a.datum));
}

// ===== AKTIVITÄTS-DATEN =====

function getAktivitaetenVonDatum(datum) {
  return db.aktivitaet_eintraege.filter(e => e.datum === datum);
}

function alleAktivitaetenVonDatum(datum) {
  return db.aktivitaet_eintraege
    .filter(e => e.datum === datum)
    .flatMap(e => e.aktivitaeten.map(a => ({ ...a, eintragId: e.id })));
}

function aktivitaetHinzufuegen(eintrag) {
  db.aktivitaet_eintraege.push(eintrag);
  speichereDaten();
}

function aktivitaetLoeschen(eintragId, aktivitaetId) {
  const eintrag = db.aktivitaet_eintraege.find(e => e.id === eintragId);
  if (!eintrag) return;
  eintrag.aktivitaeten = eintrag.aktivitaeten.filter(a => a.id !== aktivitaetId);
  if (eintrag.aktivitaeten.length === 0) {
    db.aktivitaet_eintraege = db.aktivitaet_eintraege.filter(e => e.id !== eintragId);
  }
  speichereDaten();
}

// ===== AKTIVITÄTSLEVEL PRO TAG =====

function getTagesLevel(datum) {
  return db.tages_aktivitaetslevel[datum] || db.profil?.basis_aktivitaet || 'sitzend';
}

function setTagesLevel(datum, level) {
  db.tages_aktivitaetslevel[datum] = level;
  speichereDaten();
}

// ===== PROFIL & TDEE =====

function istProfilVollstaendig() {
  if (!db.profil) return false;
  const { geburtsdatum, geschlecht, groesse, basis_aktivitaet } = db.profil;
  if (!geburtsdatum || !geschlecht || !groesse || !basis_aktivitaet) return false;
  if (db.gewicht_eintraege.length === 0) return false;
  return true;
}

function berechneAlter(datum = null) {
  if (!db.profil?.geburtsdatum) return 0;
  const ref = datum ? new Date(datum + 'T00:00:00') : new Date();
  const geb = new Date(db.profil.geburtsdatum);
  let alter = ref.getFullYear() - geb.getFullYear();
  const m = ref.getMonth() - geb.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < geb.getDate())) alter--;
  return alter;
}

function berechneBMR(datum) {
  if (!db.profil) return null;
  const gw = letzteGewicht(datum);
  if (!gw) return null;
  const { groesse, geschlecht } = db.profil;
  const alter = berechneAlter(datum);
  const basis = 10 * gw.gewicht + 6.25 * groesse - 5 * alter;
  return geschlecht === 'mann' ? basis + 5 : basis - 161;
}

function berechneTDEE(datum) {
  const bmr = berechneBMR(datum);
  if (bmr === null) return null;
  const levelKey = getTagesLevel(datum);
  const level = AKTIVITAETS_LEVELS.find(l => l.key === levelKey) || AKTIVITAETS_LEVELS[0];
  const basisTDEE = bmr * level.faktor;
  const aktKcal = alleAktivitaetenVonDatum(datum)
    .reduce((s, a) => s + (Number(a.verbrauch_kcal) || 0), 0);
  return {
    bmr: Math.round(bmr),
    basisZusatz: Math.round(basisTDEE - bmr),
    basisTDEE: Math.round(basisTDEE),
    aktKcal: Math.round(aktKcal),
    tdee: Math.round(basisTDEE + aktKcal),
    level,
  };
}

// ===== HILFSFUNKTIONEN =====

function datumFormatieren(str) {
  if (!str) return '';
  return new Date(str + 'T00:00:00').toLocaleDateString('de-DE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function datumKurz(str) {
  if (!str) return '';
  return new Date(str + 'T00:00:00').toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function zeitFormatieren(iso) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function runden(n, dez = 1) {
  return Math.round(n * 10 ** dez) / 10 ** dez;
}

function letzteNTage(n) {
  const heute = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(heute);
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toLocaleDateString('sv');
  });
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function numFmt(n) {
  return Math.round(n).toLocaleString('de-DE');
}

// ===== NAVIGATION =====

function navigiere(view) {
  state.currentView = view;
  if (view !== 'verlauf') state.verlaufDate = null;
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  renderView();
}

// ===== VIEWS =====

function renderView() {
  Object.values(state.activeCharts).forEach(c => c.destroy());
  state.activeCharts = {};

  const sidebar = document.getElementById('sidebar');
  const bottomNav = document.getElementById('bottom-nav');
  const vollstaendig = istProfilVollstaendig();
  sidebar.style.display = vollstaendig ? '' : 'none';
  bottomNav.style.display = vollstaendig ? '' : 'none';

  const container = document.getElementById('view-container');

  if (!vollstaendig) {
    container.innerHTML = bauOnboardingView();
    bindeOnboardingEvents();
    return;
  }

  switch (state.currentView) {
    case 'heute':    container.innerHTML = bauHeuteView();    break;
    case 'verlauf':  container.innerHTML = bauVerlaufView();  break;
    case 'grafiken': container.innerHTML = bauGrafikenView(); break;
    case 'profil':   container.innerHTML = bauProfilView();   break;
    case 'daten':    container.innerHTML = bauDatenView();    break;
  }

  if (state.currentView === 'grafiken') initCharts();
  bindeViewEvents();
}

// ===== ONBOARDING =====

function bauOnboardingView() {
  const levels = AKTIVITAETS_LEVELS.map(l =>
    `<option value="${l.key}">${l.label} – ${l.beschreibung}</option>`
  ).join('');
  return `
    <div class="onboarding">
      <div class="onboarding-card">
        <div class="onboarding-icon">${ICONS.user}</div>
        <h1 class="onboarding-title">Willkommen!</h1>
        <p class="onboarding-subtitle">
          Fülle dein Profil aus, um die App zu nutzen.<br>
          Diese Daten werden für die TDEE-Berechnung benötigt.
        </p>
        <div class="onboarding-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Geburtsdatum</label>
              <input type="date" id="ob-geb" class="form-input" max="${heuteStr()}">
            </div>
            <div class="form-group">
              <label class="form-label">Geschlecht</label>
              <select id="ob-geschlecht" class="form-input form-select">
                <option value="">Wählen …</option>
                <option value="mann">Männlich</option>
                <option value="frau">Weiblich</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Größe (cm)</label>
              <input type="number" id="ob-groesse" class="form-input" min="100" max="250" placeholder="175">
            </div>
            <div class="form-group">
              <label class="form-label">Aktuelles Gewicht (kg)</label>
              <input type="number" id="ob-gewicht" class="form-input" min="30" max="300" step="0.1" placeholder="75.0">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Basis-Aktivitätslevel</label>
            <select id="ob-level" class="form-input form-select">
              ${levels}
            </select>
          </div>
          <p id="ob-error" class="form-error hidden"></p>
          <button class="btn btn-primary btn-full" id="ob-submit" style="margin-top:8px">
            Loslegen →
          </button>
        </div>
      </div>
    </div>`;
}

function bindeOnboardingEvents() {
  document.getElementById('ob-submit')?.addEventListener('click', () => {
    const geb       = document.getElementById('ob-geb').value;
    const geschlecht = document.getElementById('ob-geschlecht').value;
    const groesse   = parseFloat(document.getElementById('ob-groesse').value);
    const gewicht   = parseFloat(document.getElementById('ob-gewicht').value);
    const level     = document.getElementById('ob-level').value;
    const errorEl   = document.getElementById('ob-error');

    if (!geb || !geschlecht || !groesse || !gewicht) {
      errorEl.textContent = 'Bitte alle Felder ausfüllen.';
      errorEl.classList.remove('hidden');
      return;
    }
    errorEl.classList.add('hidden');

    db.profil = { geburtsdatum: geb, geschlecht, groesse, basis_aktivitaet: level };
    gewichtHinzufuegen({ id: genId(), datum: heuteStr(), gewicht });
    speichereDaten();
    bauNav();
    navigiere('heute');
  });
}

// ===== HEUTE =====

function bauHeuteView() {
  const heute = heuteStr();
  const eintraege = eintraegeVonDatum(heute);
  const summen = tagesSumme(heute);
  return `
    <div class="view-header">
      <div>
        <h1 class="view-title">Heute</h1>
        <p class="view-subtitle">${datumFormatieren(heute)}</p>
      </div>
      <button class="btn btn-primary btn-add" id="add-meal-btn" data-date="${heute}">
        ${ICONS.plus} Mahlzeit hinzufügen
      </button>
    </div>
    ${bauSummaryCards(summen, eintraege.length > 0)}
    ${bauBilanzSection(heute)}
    <div class="entries-section">
      ${eintraege.length === 0
        ? bauLeerStatus('Noch keine Mahlzeiten heute', 'Füge deine erste Mahlzeit hinzu')
        : eintraege.map(bauEintragCard).join('')}
    </div>`;
}

// ===== VERLAUF =====

function bauVerlaufView() {
  if (state.verlaufDate) return bauTagesDetailView(state.verlaufDate);
  const daten = aktiveDaten();
  return `
    <div class="view-header">
      <div>
        <h1 class="view-title">Verlauf</h1>
        <p class="view-subtitle">${daten.length} Tag${daten.length !== 1 ? 'e' : ''} mit Einträgen</p>
      </div>
    </div>
    <div class="date-list">
      ${daten.length === 0
        ? bauLeerStatus('Noch keine Daten', 'Beginne mit deiner ersten Mahlzeit')
        : daten.map(bauDatumListItem).join('')}
    </div>`;
}

function bauDatumListItem(datum) {
  const summen = tagesSumme(datum);
  const eintraege = eintraegeVonDatum(datum);
  const kcal = Math.round(summen.kalorien || 0);
  const tdee = berechneTDEE(datum);
  const bilanz = tdee ? Math.round(tdee.tdee - kcal) : null;
  const istHeute = datum === heuteStr();
  const wochentag = new Date(datum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long' });

  let bilanzHtml = '';
  if (bilanz !== null) {
    const cls = bilanz >= 0 ? 'surplus-text' : 'deficit-text';
    bilanzHtml = `<span class="date-bilanz ${cls}">${bilanz > 0 ? '+' : ''}${numFmt(bilanz)} kcal</span>`;
  }

  return `
    <button class="date-list-item" data-date="${datum}">
      <div class="date-info">
        <span class="date-label">${datumKurz(datum)}${istHeute ? ' <span class="heute-badge">Heute</span>' : ''}</span>
        <span class="date-weekday">${wochentag}</span>
      </div>
      <div class="date-stats">
        <span class="date-kcal">${kcal} kcal</span>
        ${bilanzHtml}
        <span class="date-entries">${eintraege.length} Einträge</span>
      </div>
      ${ICONS.chevronR}
    </button>`;
}

function bauTagesDetailView(datum) {
  const eintraege = eintraegeVonDatum(datum);
  const summen = tagesSumme(datum);
  return `
    <div class="view-header">
      <div>
        <button class="back-btn" id="back-btn">${ICONS.chevronL} Verlauf</button>
        <h1 class="view-title">${datumFormatieren(datum)}</h1>
      </div>
      <button class="btn btn-primary btn-add" id="add-meal-btn" data-date="${datum}">
        ${ICONS.plus} Mahlzeit hinzufügen
      </button>
    </div>
    ${bauSummaryCards(summen, eintraege.length > 0)}
    ${bauBilanzSection(datum)}
    <div class="entries-section">
      ${eintraege.length === 0
        ? bauLeerStatus('Keine Mahlzeiten', 'Für diesen Tag wurden keine Mahlzeiten erfasst')
        : eintraege.map(bauEintragCard).join('')}
    </div>`;
}

// ===== BILANZ-SEKTION =====

function bauBilanzSection(datum) {
  const tdee = berechneTDEE(datum);
  const gegessen = Math.round(tagesSumme(datum).kalorien || 0);
  const aktivitaeten = alleAktivitaetenVonDatum(datum);
  const currentLevel = getTagesLevel(datum);

  if (!tdee) {
    return `
      <div class="bilanz-section bilanz-section--empty">
        <p>Kein Gewichtseintrag vorhanden – bitte im <a href="#" id="go-profil-link">Profil</a> aktualisieren.</p>
      </div>`;
  }

  const bilanz = tdee.tdee - gegessen;
  // bilanz > 0: weniger gegessen als verbraucht → Defizit (gut ✅)
  // bilanz < 0: mehr gegessen als verbraucht   → Überschuss (schlecht ⚠️)
  const istDefizit = bilanz >= 0;
  const bilanzCls = istDefizit ? 'deficit' : 'surplus';
  const bilanzLabel = istDefizit ? 'Defizit' : 'Überschuss';
  const bilanzIcon = istDefizit ? '✅' : '⚠️';

  const levelOptionen = AKTIVITAETS_LEVELS.map(l =>
    `<option value="${l.key}" ${l.key === currentLevel ? 'selected' : ''}>${l.label} (×${l.faktor})</option>`
  ).join('');

  const aktivitaetenHtml = aktivitaeten.map(a => `
    <div class="bilanz-row bilanz-row--activity">
      <span class="bilanz-label-activity">
        ${escHtml(a.name)}${a.dauer_min ? `, ${a.dauer_min} Min` : ''}
      </span>
      <div class="bilanz-value-group">
        <span class="bilanz-value">+${numFmt(a.verbrauch_kcal)} kcal</span>
        <button class="icon-btn icon-btn--danger delete-aktivitaet-btn"
          data-eintrag-id="${a.eintragId}" data-akt-id="${a.id}" title="Löschen">
          ${ICONS.trash}
        </button>
      </div>
    </div>`).join('');

  return `
    <div class="bilanz-section">
      <h2 class="bilanz-title">Tagesbilanz</h2>
      <div class="bilanz-rows">
        <div class="bilanz-row">
          <span class="bilanz-label">Grundumsatz (BMR)</span>
          <span class="bilanz-value">${numFmt(tdee.bmr)} kcal</span>
        </div>
        <div class="bilanz-row bilanz-row--level">
          <div class="bilanz-level-left">
            <span class="bilanz-label">Alltagsaktivität</span>
            <select class="level-select" id="level-select" data-datum="${datum}">
              ${levelOptionen}
            </select>
          </div>
          <span class="bilanz-value">+${numFmt(tdee.basisZusatz)} kcal</span>
        </div>
        ${aktivitaetenHtml}
        <div class="bilanz-row bilanz-row--subtotal">
          <span class="bilanz-label"><strong>Verbrauch (TDEE)</strong></span>
          <span class="bilanz-value bilanz-value--strong">${numFmt(tdee.tdee)} kcal</span>
        </div>
        <div class="bilanz-row">
          <span class="bilanz-label">Gegessen</span>
          <span class="bilanz-value">${numFmt(gegessen)} kcal</span>
        </div>
        <div class="bilanz-row bilanz-row--result bilanz-row--${bilanzCls}">
          <span class="bilanz-label"><strong>${bilanzLabel}</strong></span>
          <span class="bilanz-value bilanz-value--strong">
            ${numFmt(Math.abs(bilanz))} kcal ${bilanzIcon}
          </span>
        </div>
      </div>
      <div class="bilanz-footer">
        <button class="btn btn-secondary btn-sm" id="add-activity-btn" data-date="${datum}">
          ${ICONS.lightning} Aktivität hinzufügen
        </button>
      </div>
    </div>`;
}

// ===== GRAFIKEN =====

function bauGrafikenView() {
  const hatGewicht = db.gewicht_eintraege.length > 0;
  return `
    <div class="view-header">
      <div><h1 class="view-title">Grafiken</h1></div>
      <div class="range-selector">
        ${[7, 14, 30].map(r => `
          <button class="range-btn ${r === state.chartRange ? 'active' : ''}" data-range="${r}">${r} Tage</button>
        `).join('')}
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <h2 class="chart-title">Kalorien pro Tag</h2>
        <div class="chart-container"><canvas id="chart-kcal"></canvas></div>
      </div>
      <div class="chart-card">
        <h2 class="chart-title">Makros Ø pro Tag</h2>
        <div class="chart-container chart-container--small"><canvas id="chart-makro-donut"></canvas></div>
      </div>
      <div class="chart-card chart-card--full">
        <h2 class="chart-title">Makronährstoffe im Verlauf</h2>
        <div class="chart-container"><canvas id="chart-makro-verlauf"></canvas></div>
      </div>
      <div class="chart-card chart-card--full">
        <h2 class="chart-title">Tägliche Bilanz (Defizit / Überschuss)</h2>
        <div class="chart-container"><canvas id="chart-bilanz"></canvas></div>
      </div>
      ${hatGewicht ? `
        <div class="chart-card chart-card--full">
          <h2 class="chart-title">Gewichtsverlauf</h2>
          <div class="chart-container"><canvas id="chart-gewicht"></canvas></div>
        </div>` : ''}
    </div>`;
}

function initCharts() {
  const tage = letzteNTage(state.chartRange);
  const labels = tage.map(d => new Date(d + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }));

  const kcalDaten    = tage.map(d => Math.round(tagesSumme(d).kalorien || 0));
  const proteinDaten = tage.map(d => runden(tagesSumme(d).protein || 0));
  const fettDaten    = tage.map(d => runden(tagesSumme(d).fett || 0));
  const khDaten      = tage.map(d => runden(tagesSumme(d).kohlenhydrate || 0));
  const bilanzDaten  = tage.map(d => {
    const tdee = berechneTDEE(d);
    if (!tdee) return null;
    return Math.round(tdee.tdee - (tagesSumme(d).kalorien || 0)) * -1; // negativ = Defizit
  });

  const tooltipDefaults = {
    backgroundColor: '#191d2a', borderColor: '#272e42', borderWidth: 1,
    titleColor: '#e2e8f2', bodyColor: '#8892a6', padding: 10,
  };
  const achsenDefaults = {
    x: { ticks: { color: '#8892a6', font: { size: 11 } }, grid: { color: '#1c2233' } },
    y: { ticks: { color: '#8892a6', font: { size: 11 } }, grid: { color: '#1c2233' } },
  };

  // Kalorien
  const kcalCtx = document.getElementById('chart-kcal');
  if (kcalCtx) {
    state.activeCharts.kcal = new Chart(kcalCtx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Kalorien (kcal)', data: kcalDaten, backgroundColor: 'rgba(251,146,60,0.65)', borderColor: 'rgba(251,146,60,0.9)', borderWidth: 1, borderRadius: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipDefaults }, scales: achsenDefaults }
    });
  }

  // Makro Donut
  const tageAktiv = tage.filter(d => eintraegeVonDatum(d).length > 0).length || 1;
  const makroDonutCtx = document.getElementById('chart-makro-donut');
  if (makroDonutCtx) {
    state.activeCharts.donut = new Chart(makroDonutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Protein', 'Fett', 'Kohlenhydrate'],
        datasets: [{
          data: [
            runden(proteinDaten.reduce((a, b) => a + b, 0) / tageAktiv),
            runden(fettDaten.reduce((a, b) => a + b, 0) / tageAktiv),
            runden(khDaten.reduce((a, b) => a + b, 0) / tageAktiv),
          ],
          backgroundColor: ['rgba(96,165,250,0.8)', 'rgba(250,204,21,0.8)', 'rgba(167,139,250,0.8)'],
          borderColor: ['#60a5fa', '#facc15', '#a78bfa'], borderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#8892a6', font: { size: 11 }, padding: 14 } },
          tooltip: { ...tooltipDefaults, callbacks: { label: ctx => ` ${ctx.formattedValue}g (Ø)` } }
        }
      }
    });
  }

  // Makro-Verlauf gestapelt
  const makroVerlaufCtx = document.getElementById('chart-makro-verlauf');
  if (makroVerlaufCtx) {
    state.activeCharts.makroVerlauf = new Chart(makroVerlaufCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Protein (g)', data: proteinDaten, backgroundColor: 'rgba(96,165,250,0.75)', stack: 'makros' },
          { label: 'Fett (g)',    data: fettDaten,    backgroundColor: 'rgba(250,204,21,0.75)',  stack: 'makros' },
          { label: 'KH (g)',      data: khDaten,      backgroundColor: 'rgba(167,139,250,0.75)', stack: 'makros' },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#8892a6', font: { size: 11 } } }, tooltip: tooltipDefaults },
        scales: { x: { ...achsenDefaults.x, stacked: true }, y: { ...achsenDefaults.y, stacked: true } }
      }
    });
  }

  // Bilanz-Chart
  const bilanzCtx = document.getElementById('chart-bilanz');
  if (bilanzCtx) {
    const bilanzColors = bilanzDaten.map(v => v === null ? 'transparent' : (v <= 0 ? 'rgba(52,211,153,0.7)' : 'rgba(244,63,94,0.7)'));
    const bilanzBorder = bilanzDaten.map(v => v === null ? 'transparent' : (v <= 0 ? '#34d399' : '#f43f5e'));
    state.activeCharts.bilanz = new Chart(bilanzCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Bilanz (kcal)',
          data: bilanzDaten,
          backgroundColor: bilanzColors,
          borderColor: bilanzBorder,
          borderWidth: 1,
          borderRadius: 5,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipDefaults,
            callbacks: {
              label: ctx => {
                const v = ctx.raw;
                if (v === null) return ' Kein Verbrauch berechnet';
                return v <= 0 ? ` Defizit: ${Math.abs(v)} kcal` : ` Überschuss: ${v} kcal`;
              }
            }
          }
        },
        scales: {
          ...achsenDefaults,
          y: {
            ...achsenDefaults.y,
            ticks: {
              ...achsenDefaults.y.ticks,
              callback: v => `${v > 0 ? '+' : ''}${v}`
            }
          }
        }
      }
    });
  }

  // Gewichtsverlauf
  const gewichtCtx = document.getElementById('chart-gewicht');
  if (gewichtCtx && db.gewicht_eintraege.length > 0) {
    const gewichtSorted = [...db.gewicht_eintraege].sort((a, b) => a.datum.localeCompare(b.datum));
    const gwLabels = gewichtSorted.map(e => datumKurz(e.datum));
    const gwDaten = gewichtSorted.map(e => e.gewicht);
    state.activeCharts.gewicht = new Chart(gewichtCtx, {
      type: 'line',
      data: {
        labels: gwLabels,
        datasets: [{
          label: 'Gewicht (kg)',
          data: gwDaten,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#6366f1',
          pointRadius: 5,
          tension: 0.3,
          fill: true,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { ...tooltipDefaults, callbacks: { label: ctx => ` ${ctx.formattedValue} kg` } } },
        scales: {
          x: achsenDefaults.x,
          y: { ...achsenDefaults.y, ticks: { ...achsenDefaults.y.ticks, callback: v => `${v} kg` } }
        }
      }
    });
  }
}

// ===== PROFIL =====

function bauProfilView() {
  const p = db.profil;
  const gewichte = gewichteSortiert();
  const aktuellesGewicht = gewichte[0];
  const levels = AKTIVITAETS_LEVELS.map(l =>
    `<option value="${l.key}" ${l.key === p.basis_aktivitaet ? 'selected' : ''}>${l.label} – ${l.beschreibung}</option>`
  ).join('');

  const gewichtHistorie = gewichte.map(e => `
    <div class="gewicht-item">
      <div>
        <span class="gewicht-item-date">${datumKurz(e.datum)}</span>
      </div>
      <div class="gewicht-item-right">
        <span class="gewicht-item-value">${e.gewicht} kg</span>
        <button class="icon-btn icon-btn--danger delete-gewicht-btn" data-id="${e.id}" title="Löschen">
          ${ICONS.trash}
        </button>
      </div>
    </div>`).join('');

  return `
    <div class="view-header">
      <div><h1 class="view-title">Profil</h1></div>
    </div>
    <div class="profil-sections">

      <div class="profil-card">
        <h2 class="profil-card-title">Persönliche Daten</h2>
        <div class="profil-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Geburtsdatum</label>
              <input type="date" id="p-geb" class="form-input" value="${p.geburtsdatum}" max="${heuteStr()}">
            </div>
            <div class="form-group">
              <label class="form-label">Geschlecht</label>
              <select id="p-geschlecht" class="form-input form-select">
                <option value="mann" ${p.geschlecht === 'mann' ? 'selected' : ''}>Männlich</option>
                <option value="frau" ${p.geschlecht === 'frau' ? 'selected' : ''}>Weiblich</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Größe (cm)</label>
              <input type="number" id="p-groesse" class="form-input" value="${p.groesse}" min="100" max="250">
            </div>
            <div class="form-group">
              <label class="form-label">Alter (berechnet)</label>
              <input type="text" class="form-input" value="${berechneAlter()} Jahre" readonly style="opacity:0.5;cursor:default">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Basis-Aktivitätslevel (Standard für alle Tage)</label>
            <select id="p-level" class="form-input form-select">${levels}</select>
          </div>
          <button class="btn btn-primary" id="save-profil-btn">Speichern</button>
        </div>
      </div>

      <div class="profil-card">
        <h2 class="profil-card-title">Gewicht</h2>
        ${aktuellesGewicht ? `
          <div class="gewicht-current">
            <span class="gewicht-current-value">${aktuellesGewicht.gewicht}</span>
            <span class="gewicht-current-unit">kg</span>
            <span class="gewicht-current-date">Stand: ${datumKurz(aktuellesGewicht.datum)}</span>
          </div>` : ''}
        <div class="gewicht-actions">
          <button class="btn btn-secondary btn-sm" id="toggle-gewicht-form">
            ${ICONS.plus} Eintragen
          </button>
          <button class="btn btn-secondary btn-sm" id="import-gewicht-btn">
            ${ICONS.upload} JSON importieren
          </button>
        </div>
        <div id="gewicht-form" class="gewicht-add-form ${state.showGewichtForm ? '' : 'hidden'}">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Datum</label>
              <input type="date" id="gw-datum" class="form-input" value="${heuteStr()}" max="${heuteStr()}">
            </div>
            <div class="form-group">
              <label class="form-label">Gewicht (kg)</label>
              <input type="number" id="gw-wert" class="form-input" step="0.1" min="30" max="300" placeholder="75.0">
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:4px">
            <button class="btn btn-primary" id="save-gewicht-btn">Speichern</button>
            <button class="btn btn-ghost" id="cancel-gewicht-btn">Abbrechen</button>
          </div>
        </div>
        ${gewichte.length > 0 ? `
          <div class="gewicht-history">${gewichtHistorie}</div>` : ''}
      </div>

    </div>`;
}

// ===== DATEN =====

function bauDatenView() {
  const daten = aktiveDaten();
  return `
    <div class="view-header">
      <div><h1 class="view-title">Daten</h1></div>
    </div>
    <div class="data-sections">
      <div class="data-card">
        <h2 class="data-card-title">Übersicht</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">${daten.length}</span>
            <span class="stat-label">Tage erfasst</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${db.eintraege.length}</span>
            <span class="stat-label">Mahlzeit-Einträge</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${db.gewicht_eintraege.length}</span>
            <span class="stat-label">Gewichts-Einträge</span>
          </div>
          ${daten.length > 0 ? `
            <div class="stat-item">
              <span class="stat-value">${datumKurz(daten[daten.length - 1])}</span>
              <span class="stat-label">Erster Eintrag</span>
            </div>` : ''}
        </div>
      </div>

      <div class="data-card">
        <h2 class="data-card-title">KI-Prompt – Mahlzeiten</h2>
        <p class="data-card-desc">
          Kopiere diesen Prompt und füge ihn in <strong>ChatGPT</strong> oder <strong>Claude</strong> ein.
          Beschreibe anschließend was du gegessen hast.
        </p>
        <div class="prompt-box">
          <button class="btn btn-ghost btn-copy" id="copy-prompt-mahlzeit">${ICONS.copy} Kopieren</button>
          <pre class="prompt-text">${escHtml(AI_PROMPT_MAHLZEIT)}</pre>
        </div>
      </div>

      <div class="data-card">
        <h2 class="data-card-title">KI-Prompt – Aktivitäten</h2>
        <p class="data-card-desc">
          Personalisierter Prompt mit deinen aktuellen Körperdaten. Füge ihn in die KI ein und beschreibe deine Aktivitäten.
        </p>
        <div class="prompt-box">
          <button class="btn btn-ghost btn-copy" id="copy-prompt-aktivitaet">${ICONS.copy} Kopieren</button>
          <pre class="prompt-text" id="aktivitaet-prompt-text">${escHtml(getAktivitaetsPrompt())}</pre>
        </div>
      </div>

      <div class="data-card">
        <h2 class="data-card-title">Export & Import</h2>
        <p class="data-card-desc">Exportiere alle Daten als JSON-Datei zur Sicherung oder zum Übertragen auf ein anderes Gerät.</p>
        <div class="data-actions">
          <button class="btn btn-primary" id="export-btn">${ICONS.download} Alle Daten exportieren</button>
          <button class="btn btn-secondary" id="import-btn">${ICONS.upload} Backup importieren</button>
          <input type="file" id="import-file-input" accept=".json" class="hidden">
        </div>
      </div>

      <div class="data-card data-card--danger">
        <h2 class="data-card-title">Gefahrenzone</h2>
        <p class="data-card-desc">Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <button class="btn btn-danger" id="clear-btn">${ICONS.trash} Alle Daten löschen</button>
      </div>
    </div>`;
}

// ===== KOMPONENTEN =====

function bauSummaryCards(summen, hatDaten) {
  const karten = [
    { key: 'kalorien',     label: 'Kalorien',     unit: 'kcal', cls: 'kcal',    dez: 0 },
    { key: 'protein',      label: 'Protein',       unit: 'g',    cls: 'protein', dez: 1 },
    { key: 'fett',         label: 'Fett',          unit: 'g',    cls: 'fat',     dez: 1 },
    { key: 'kohlenhydrate',label: 'Kohlenhydrate', unit: 'g',    cls: 'carbs',   dez: 1 },
  ];
  return `
    <div class="summary-cards">
      ${karten.map(k => `
        <div class="summary-card summary-card--${k.cls}">
          <span class="summary-value">${hatDaten ? runden(summen[k.key] || 0, k.dez) : '—'}</span>
          <span class="summary-unit">${k.unit}</span>
          <span class="summary-label">${k.label}</span>
        </div>`).join('')}
    </div>`;
}

function bauNaehrstoffDetail(zutat) {
  return NUTRIENT_FIELDS.map(f => {
    const val = Number(zutat[f.key]) || 0;
    const isSub = f.group === 'fett' || f.group === 'kh';
    return `
      <div class="detail-row${isSub ? ' detail-row--sub' : ''}">
        <span class="detail-label">${f.label}</span>
        <span class="detail-value">${f.key === 'kalorien' ? Math.round(val) : runden(val)} ${f.unit}</span>
      </div>`;
  }).join('');
}

function bauEintragCard(eintrag) {
  const summen = summiereNaehrstoffe(eintrag.zutaten);
  const detailId = `detail-${eintrag.id}`;

  const detailZutaten = eintrag.zutaten.map(z => `
    <div class="detail-zutat">
      <div class="detail-zutat-name">
        ${escHtml(z.name)} <span class="detail-zutat-menge">${z.menge}g</span>
      </div>
      <div class="detail-nutrient-list">
        ${bauNaehrstoffDetail(z)}
      </div>
    </div>`).join('');

  const detailGesamt = eintrag.zutaten.length > 1 ? `
    <div class="detail-zutat detail-zutat--gesamt">
      <div class="detail-zutat-name">Gesamt</div>
      <div class="detail-nutrient-list">
        ${bauNaehrstoffDetail(summen)}
      </div>
    </div>` : '';

  return `
    <div class="entry-card">
      <div class="entry-header">
        <div class="entry-meta">
          <span class="entry-time">${zeitFormatieren(eintrag.zeitstempel)} Uhr</span>
          ${eintrag.notiz ? `<span class="entry-note">${escHtml(eintrag.notiz)}</span>` : ''}
        </div>
        <div class="entry-actions">
          <span class="entry-kcal">${Math.round(summen.kalorien)} kcal</span>
          <button class="icon-btn icon-btn--bookmark save-vorlage-btn" data-id="${eintrag.id}" title="Als Vorlage speichern">
            ${ICONS.bookmark}
          </button>
          <button class="icon-btn icon-btn--danger delete-btn" data-id="${eintrag.id}" title="Löschen">
            ${ICONS.trash}
          </button>
        </div>
      </div>
      <div class="ingredient-list">
        ${eintrag.zutaten.map(z => `
          <div class="ingredient-row">
            <span class="ingredient-name">${escHtml(z.name)}</span>
            <span class="ingredient-amount">${z.menge}g</span>
            <span class="ingredient-kcal">${Math.round(z.kalorien || 0)} kcal</span>
          </div>`).join('')}
      </div>
      <div class="entry-totals">
        ${[
          { key: 'protein',       label: 'P',    cls: 'protein' },
          { key: 'fett',          label: 'F',    cls: 'fat'     },
          { key: 'kohlenhydrate', label: 'KH',   cls: 'carbs'   },
          { key: 'ballaststoffe', label: 'BS',   cls: 'fiber'   },
          { key: 'salz',          label: 'Salz', cls: 'salt'    },
        ].map(p => `<span class="nutrient-pill nutrient-pill--${p.cls}">${p.label}: ${runden(summen[p.key] || 0)}g</span>`).join('')}
      </div>
      <button class="btn-details-toggle" data-target="${detailId}">Details anzeigen ▾</button>
      <div class="entry-details hidden" id="${detailId}">
        ${detailZutaten}
        ${detailGesamt}
      </div>
    </div>`;
}

function bauLeerStatus(titel, untertitel) {
  return `
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24" opacity="0.25">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <p class="empty-title">${titel}</p>
      <p class="empty-subtitle">${untertitel}</p>
    </div>`;
}

// ===== MODAL =====

function oeffneModal(tipo, datum) {
  state.parsedIngredients = null;
  state.parsedActivities = null;
  state.parsedWeights = null;
  state.vorlagenEdit = null;
  state.vorlagenOriginal = null;
  state.modalTipo = tipo;
  state.modalDate = datum || heuteStr();

  const titles = {
    mahlzeit:            'Mahlzeit hinzufügen',
    aktivitaet:          'Aktivität hinzufügen',
    'gewicht-json':      'Gewicht importieren (JSON)',
    'vorlage-speichern': 'Als Vorlage speichern',
  };
  document.getElementById('modal-title').textContent = titles[tipo] || 'Hinzufügen';

  // Standard-Tab je nach Typ
  if (tipo === 'aktivitaet') state.modalTab = 'manuell';
  else if (tipo === 'vorlage-speichern') state.modalTab = 'speichern';
  else state.modalTab = 'json';

  document.getElementById('modal-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderModalBody();
}

function schliesseModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
  state.parsedIngredients = null;
  state.parsedActivities = null;
  state.parsedWeights = null;
  state.vorlagenEdit = null;
  state.vorlagenOriginal = null;
  state.vorlagePending = null;
}

function renderModalBody() {
  // Tabs rendern
  const vorlagenAnzahl = db.mahlzeit_vorlagen.length;
  const tabsKonfig = {
    mahlzeit:            [{ key: 'json', label: 'JSON einfügen' }, { key: 'vorlagen', label: `Vorlagen${vorlagenAnzahl > 0 ? ` (${vorlagenAnzahl})` : ''}` }, { key: 'prompt', label: 'KI-Prompt' }],
    aktivitaet:          [{ key: 'manuell', label: 'Manuell' }, { key: 'json', label: 'JSON einfügen' }, { key: 'prompt', label: 'KI-Prompt' }],
    'gewicht-json':      [{ key: 'json', label: 'JSON einfügen' }],
    'vorlage-speichern': [],
  };
  const tabs = tabsKonfig[state.modalTipo] ?? tabsKonfig.mahlzeit;
  const tabsEl = document.getElementById('modal-tabs');
  tabsEl.innerHTML = tabs.map(t =>
    `<button class="tab-btn ${t.key === state.modalTab ? 'active' : ''}" data-tab="${t.key}">${t.label}</button>`
  ).join('');
  tabsEl.style.display = tabs.length === 0 ? 'none' : '';

  // Tabs neu binden
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => { state.modalTab = btn.dataset.tab; renderModalBody(); });
  });

  // Body rendern
  const body = document.getElementById('modal-body');
  if (state.modalTipo === 'mahlzeit') {
    if (state.modalTab === 'json') {
      body.innerHTML = bauMahlzeitJsonTab();
      bindeModalMahlzeitEvents();
    } else if (state.modalTab === 'vorlagen') {
      body.innerHTML = bauMahlzeitVorlagenTab();
      bindeModalVorlagenEvents();
    } else {
      body.innerHTML = bauMahlzeitPromptTab();
      bindeModalMahlzeitEvents();
    }
  } else if (state.modalTipo === 'vorlage-speichern') {
    body.innerHTML = bauVorlageSpeichernTab();
    bindeModalVorlageSpeichernEvents();
  } else if (state.modalTipo === 'aktivitaet') {
    if (state.modalTab === 'manuell') body.innerHTML = bauAktivitaetManuellTab();
    else if (state.modalTab === 'json') body.innerHTML = bauAktivitaetJsonTab();
    else body.innerHTML = bauAktivitaetPromptTab();
    bindeModalAktivitaetEvents();
  } else if (state.modalTipo === 'gewicht-json') {
    body.innerHTML = bauGewichtJsonTab();
    bindeModalGewichtEvents();
  }
}

// ---- Mahlzeit Modal ----

function bauMahlzeitJsonTab() {
  const jetzt = new Date();
  const zeitStr = jetzt.toTimeString().slice(0, 5);
  return `
    <div class="modal-json-tab">
      <div class="form-group">
        <label class="form-label">Datum & Uhrzeit</label>
        <div class="datetime-row">
          <input type="date" id="entry-date" class="form-input" value="${state.modalDate}" max="${heuteStr()}">
          <input type="time" id="entry-time" class="form-input" value="${zeitStr}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Notiz (optional)</label>
        <input type="text" id="entry-note" class="form-input" placeholder="z.B. Frühstück, Mittagessen …">
      </div>
      <div class="form-group">
        <label class="form-label">JSON von der KI einfügen</label>
        <textarea id="json-input" class="form-textarea" rows="8"
          placeholder='[\n  {\n    "name": "Haferbrei",\n    "menge": 80,\n    "kalorien": 295,\n    ...\n  }\n]'></textarea>
      </div>
      <button class="btn btn-secondary btn-full" id="parse-btn">JSON analysieren</button>
      <div id="json-preview"></div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="modal-cancel">Abbrechen</button>
        <button class="btn btn-primary" id="modal-confirm" disabled>Hinzufügen</button>
      </div>
    </div>`;
}

function bauMahlzeitPromptTab() {
  return `
    <div class="prompt-tab">
      <p class="prompt-instructions">
        Kopiere diesen Prompt, füge ihn in <strong>ChatGPT</strong> oder <strong>Claude</strong> ein
        und beschreibe dann was du gegessen hast.
      </p>
      <div class="prompt-box">
        <button class="btn btn-ghost btn-copy" id="copy-prompt-modal">${ICONS.copy} Kopieren</button>
        <pre class="prompt-text">${escHtml(AI_PROMPT_MAHLZEIT)}</pre>
      </div>
    </div>`;
}

function bauMahlzeitVorlagenTab() {
  if (state.vorlagenEdit) return bauVorlagenEditView();

  const vorlagen = db.mahlzeit_vorlagen;
  if (vorlagen.length === 0) {
    return `
      <div class="vorlagen-leer">
        <p>Noch keine Vorlagen gespeichert.</p>
        <p class="vorlagen-leer-hint">Klicke auf das ${ICONS.bookmark}-Symbol bei einer gespeicherten Mahlzeit, um sie als Vorlage zu speichern.</p>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="modal-cancel">Abbrechen</button>
        </div>
      </div>`;
  }

  return `
    <div class="vorlagen-liste">
      ${vorlagen.map(v => {
        const summen = summiereNaehrstoffe(v.zutaten);
        return `
          <div class="vorlage-item">
            <div class="vorlage-item-header">
              <div>
                <span class="vorlage-name">${escHtml(v.name)}</span>
                <span class="vorlage-meta">${v.zutaten.length} Zutat${v.zutaten.length !== 1 ? 'en' : ''} · ${Math.round(summen.kalorien)} kcal</span>
              </div>
              <button class="icon-btn icon-btn--danger delete-vorlage-btn" data-id="${v.id}" title="Vorlage löschen">
                ${ICONS.trash}
              </button>
            </div>
            <div class="vorlage-zutaten-preview">${v.zutaten.map(z => escHtml(z.name)).join(', ')}</div>
            <button class="btn btn-primary btn-full verwenden-btn" data-id="${v.id}">Verwenden →</button>
          </div>`;
      }).join('')}
      <div class="modal-footer">
        <button class="btn btn-ghost" id="modal-cancel">Abbrechen</button>
      </div>
    </div>`;
}

function bauVorlagenEditView() {
  const zutaten = state.vorlagenEdit;
  const jetzt = new Date();
  const zeitStr = jetzt.toTimeString().slice(0, 5);
  return `
    <div class="vorlagen-edit">
      <div class="form-group">
        <label class="form-label">Datum & Uhrzeit</label>
        <div class="datetime-row">
          <input type="date" id="vl-datum" class="form-input" value="${state.modalDate}" max="${heuteStr()}">
          <input type="time" id="vl-zeit" class="form-input" value="${zeitStr}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Notiz (optional)</label>
        <input type="text" id="vl-notiz" class="form-input" placeholder="z.B. Frühstück …">
      </div>
      <p class="form-label" style="margin: 12px 0 8px">Menge anpassen:</p>
      ${zutaten.map((z, i) => `
        <div class="vorlage-zutat-card">
          <div class="vorlage-zutat-header">
            <span class="vorlage-zutat-name">${escHtml(z.name)}</span>
          </div>
          <div class="vorlage-zutat-menge-row">
            <label class="form-label">Menge (g)</label>
            <input type="number" class="form-input vl-menge-field" data-idx="${i}" value="${z.menge}" min="0" step="1">
          </div>
          <div class="vorlage-zutat-stats">
            <span class="vl-calc" data-idx="${i}" data-field="kalorien" data-unit="kcal">${Math.round(z.kalorien)} kcal</span>
            <span class="vl-calc" data-idx="${i}" data-field="protein" data-label="P">${runden(z.protein)}g P</span>
            <span class="vl-calc" data-idx="${i}" data-field="fett" data-label="F">${runden(z.fett)}g F</span>
            <span class="vl-calc" data-idx="${i}" data-field="kohlenhydrate" data-label="KH">${runden(z.kohlenhydrate)}g KH</span>
          </div>
        </div>`).join('')}
      <div class="modal-footer">
        <button class="btn btn-ghost" id="vl-back-btn">← Zurück</button>
        <button class="btn btn-primary" id="vl-confirm-btn">Hinzufügen</button>
      </div>
    </div>`;
}

function bauVorlageSpeichernTab() {
  const zutaten = state.vorlagePending;
  if (!zutaten) return '<p>Fehler: Keine Zutaten.</p>';
  const summen = summiereNaehrstoffe(zutaten);
  return `
    <div class="modal-json-tab">
      <div class="form-group">
        <label class="form-label">Name der Vorlage</label>
        <input type="text" id="vorlage-name-input" class="form-input" placeholder="z.B. Frühstück, Haferbrei Standard …" autofocus>
      </div>
      <div class="preview-section" style="margin-top:12px">
        <p class="preview-title">${zutaten.length} Zutat${zutaten.length !== 1 ? 'en' : ''} · ${Math.round(summen.kalorien)} kcal</p>
        <div class="vorlage-zutaten-preview">${zutaten.map(z => escHtml(z.name)).join(', ')}</div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="modal-cancel">Abbrechen</button>
        <button class="btn btn-primary" id="vorlage-speichern-btn">Speichern</button>
      </div>
    </div>`;
}

function analysiereJSON() {
  const input = document.getElementById('json-input')?.value.trim() || '';
  const preview = document.getElementById('json-preview');
  const confirmBtn = document.getElementById('modal-confirm');
  if (!preview || !confirmBtn) return;

  if (!input) { preview.innerHTML = ''; confirmBtn.disabled = true; return; }

  let parsed;
  try { parsed = JSON.parse(input); }
  catch (e) {
    preview.innerHTML = `<div class="parse-error">Ungültiges JSON: ${escHtml(e.message)}</div>`;
    confirmBtn.disabled = true; return;
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    preview.innerHTML = `<div class="parse-error">Erwartet wird ein JSON-Array mit mindestens einem Eintrag.</div>`;
    confirmBtn.disabled = true; return;
  }

  const validiert = [];
  const warnungen = [];
  for (const item of parsed) {
    if (!item.name) { warnungen.push('Ein Eintrag ohne Namen wurde übersprungen.'); continue; }
    const n = { name: String(item.name), menge: Number(item.menge) || 0 };
    NUTRIENT_FIELDS.forEach(f => { n[f.key] = Number(item[f.key]) || 0; });
    validiert.push(n);
  }

  if (validiert.length === 0) {
    preview.innerHTML = `<div class="parse-error">Keine gültigen Einträge gefunden.</div>`;
    confirmBtn.disabled = true; return;
  }

  state.parsedIngredients = validiert;
  const summen = summiereNaehrstoffe(validiert);

  preview.innerHTML = `
    <div class="preview-section">
      <p class="preview-title">${validiert.length} Zutat${validiert.length !== 1 ? 'en' : ''} erkannt</p>
      ${warnungen.length ? `<div class="parse-warnings">${warnungen.map(w => `<p>${escHtml(w)}</p>`).join('')}</div>` : ''}
      <table class="preview-table">
        <thead><tr><th>Zutat</th><th>Menge</th><th>kcal</th><th>P</th><th>F</th><th>KH</th></tr></thead>
        <tbody>
          ${validiert.map(z => `
            <tr>
              <td>${escHtml(z.name)}</td><td>${z.menge}g</td>
              <td>${Math.round(z.kalorien)}</td>
              <td>${runden(z.protein)}g</td><td>${runden(z.fett)}g</td><td>${runden(z.kohlenhydrate)}g</td>
            </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Gesamt</strong></td><td>—</td>
            <td><strong>${Math.round(summen.kalorien)}</strong></td>
            <td><strong>${runden(summen.protein)}g</strong></td>
            <td><strong>${runden(summen.fett)}g</strong></td>
            <td><strong>${runden(summen.kohlenhydrate)}g</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>`;
  confirmBtn.disabled = false;
}

function eintragBestaetigen() {
  if (!state.parsedIngredients?.length) return;
  const datum = document.getElementById('entry-date')?.value || heuteStr();
  const zeit  = document.getElementById('entry-time')?.value || '00:00';
  const notiz = document.getElementById('entry-note')?.value.trim() || '';
  eintragHinzufuegen({
    id: genId(), datum,
    zeitstempel: new Date(`${datum}T${zeit}:00`).toISOString(),
    notiz, zutaten: state.parsedIngredients,
  });
  schliesseModal();
  renderView();
  zeigeToast('Mahlzeit hinzugefügt', 'success');
}

function bindeModalMahlzeitEvents() {
  let debounce;
  document.getElementById('json-input')?.addEventListener('input', () => {
    clearTimeout(debounce); debounce = setTimeout(analysiereJSON, 700);
  });
  document.getElementById('parse-btn')?.addEventListener('click', analysiereJSON);
  document.getElementById('modal-confirm')?.addEventListener('click', eintragBestaetigen);
  document.getElementById('modal-cancel')?.addEventListener('click', schliesseModal);
  document.getElementById('copy-prompt-modal')?.addEventListener('click', () => {
    navigator.clipboard.writeText(AI_PROMPT_MAHLZEIT).then(() => zeigeToast('Prompt kopiert', 'success'));
  });

  // Automatisch aus Zwischenablage einfügen wenn JSON vorhanden
  const textarea = document.getElementById('json-input');
  if (textarea && navigator.clipboard?.readText) {
    navigator.clipboard.readText().then(text => {
      const trimmed = text.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        textarea.value = trimmed;
        analysiereJSON();
      }
    }).catch(() => {}); // Berechtigung verweigert – still ignorieren
  }
}

function bindeModalVorlagenEvents() {
  document.getElementById('modal-cancel')?.addEventListener('click', schliesseModal);

  document.querySelectorAll('.delete-vorlage-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      zeigeBestaetigung('Vorlage löschen?', () => {
        vorlageLoeschen(btn.dataset.id);
        renderModalBody();
      });
    });
  });

  document.querySelectorAll('.verwenden-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vorlage = db.mahlzeit_vorlagen.find(v => v.id === btn.dataset.id);
      if (!vorlage) return;
      state.vorlagenOriginal = JSON.parse(JSON.stringify(vorlage.zutaten));
      state.vorlagenEdit = JSON.parse(JSON.stringify(vorlage.zutaten));
      renderModalBody();
    });
  });

  // Zurück-Button im Edit-View
  document.getElementById('vl-back-btn')?.addEventListener('click', () => {
    state.vorlagenEdit = null;
    state.vorlagenOriginal = null;
    renderModalBody();
  });

  // Mengen-Input: proportionale Neuberechnung aller Nährwerte
  document.querySelectorAll('.vl-menge-field').forEach(input => {
    input.addEventListener('input', () => {
      const idx = parseInt(input.dataset.idx);
      const newMenge = parseFloat(input.value) || 0;
      const orig = state.vorlagenOriginal[idx];
      const ratio = orig.menge > 0 ? newMenge / orig.menge : 0;

      state.vorlagenEdit[idx].menge = newMenge;
      NUTRIENT_FIELDS.forEach(f => {
        state.vorlagenEdit[idx][f.key] = orig[f.key] * ratio;
      });

      // Angezeigte Werte aktualisieren
      document.querySelectorAll(`.vl-calc[data-idx="${idx}"]`).forEach(span => {
        const field = span.dataset.field;
        const val = state.vorlagenEdit[idx][field];
        if (span.dataset.unit === 'kcal') {
          span.textContent = `${Math.round(val)} kcal`;
        } else {
          span.textContent = `${runden(val)}g ${span.dataset.label}`;
        }
      });
    });
  });

  // Bestätigen im Edit-View
  document.getElementById('vl-confirm-btn')?.addEventListener('click', () => {
    if (!state.vorlagenEdit?.length) return;
    const datum = document.getElementById('vl-datum')?.value || heuteStr();
    const zeit  = document.getElementById('vl-zeit')?.value || '00:00';
    const notiz = document.getElementById('vl-notiz')?.value.trim() || '';
    eintragHinzufuegen({
      id: genId(), datum,
      zeitstempel: new Date(`${datum}T${zeit}:00`).toISOString(),
      notiz, zutaten: state.vorlagenEdit,
    });
    state.vorlagenEdit = null;
    state.vorlagenOriginal = null;
    schliesseModal();
    renderView();
    zeigeToast('Mahlzeit hinzugefügt', 'success');
  });
}

function bindeModalVorlageSpeichernEvents() {
  document.getElementById('modal-cancel')?.addEventListener('click', schliesseModal);
  document.getElementById('vorlage-speichern-btn')?.addEventListener('click', () => {
    const name = document.getElementById('vorlage-name-input')?.value.trim();
    if (!name) { zeigeToast('Bitte einen Namen eingeben', 'error'); return; }
    vorlageHinzufuegen({
      id: genId(),
      name,
      erstellt: new Date().toISOString(),
      zutaten: JSON.parse(JSON.stringify(state.vorlagePending)),
    });
    schliesseModal();
    zeigeToast(`Vorlage „${name}" gespeichert`, 'success');
  });
}

// ---- Aktivität Modal ----

function bauAktivitaetManuellTab() {
  return `
    <div class="modal-json-tab">
      <div class="form-group">
        <label class="form-label">Aktivität</label>
        <input type="text" id="akt-name" class="form-input" placeholder="z.B. Joggen, Radfahren, Schwimmen …">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Dauer (Min, optional)</label>
          <input type="number" id="akt-dauer" class="form-input" min="0" placeholder="45">
        </div>
        <div class="form-group">
          <label class="form-label">Kalorien verbrannt</label>
          <input type="number" id="akt-kcal" class="form-input" min="0" placeholder="420" required>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="modal-cancel">Abbrechen</button>
        <button class="btn btn-primary" id="akt-confirm-manuell">Hinzufügen</button>
      </div>
    </div>`;
}

function bauAktivitaetJsonTab() {
  return `
    <div class="modal-json-tab">
      <div class="form-group">
        <label class="form-label">JSON von der KI einfügen</label>
        <textarea id="akt-json-input" class="form-textarea" rows="7"
          placeholder='[\n  { "name": "Joggen", "dauer_min": 45, "verbrauch_kcal": 420 }\n]'></textarea>
      </div>
      <button class="btn btn-secondary btn-full" id="akt-parse-btn">JSON analysieren</button>
      <div id="akt-json-preview"></div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="modal-cancel">Abbrechen</button>
        <button class="btn btn-primary" id="akt-confirm-json" disabled>Hinzufügen</button>
      </div>
    </div>`;
}

function bauAktivitaetPromptTab() {
  return `
    <div class="prompt-tab">
      <p class="prompt-instructions">
        Dieser Prompt ist mit deinen Körperdaten befüllt. Kopiere ihn in <strong>ChatGPT</strong> oder <strong>Claude</strong>
        und beschreibe dann deine Aktivitäten.
      </p>
      <div class="prompt-box">
        <button class="btn btn-ghost btn-copy" id="copy-akt-prompt">${ICONS.copy} Kopieren</button>
        <pre class="prompt-text">${escHtml(getAktivitaetsPrompt())}</pre>
      </div>
    </div>`;
}

function analysiereAktivitaetJSON() {
  const input = document.getElementById('akt-json-input')?.value.trim() || '';
  const preview = document.getElementById('akt-json-preview');
  const confirmBtn = document.getElementById('akt-confirm-json');
  if (!preview || !confirmBtn) return;

  if (!input) { preview.innerHTML = ''; confirmBtn.disabled = true; return; }

  let parsed;
  try { parsed = JSON.parse(input); }
  catch (e) {
    preview.innerHTML = `<div class="parse-error">Ungültiges JSON: ${escHtml(e.message)}</div>`;
    confirmBtn.disabled = true; return;
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    preview.innerHTML = `<div class="parse-error">Erwartet wird ein JSON-Array.</div>`;
    confirmBtn.disabled = true; return;
  }

  const validiert = parsed
    .filter(a => a.name && (Number(a.verbrauch_kcal) > 0))
    .map(a => ({
      id: genId(),
      name: String(a.name),
      dauer_min: Number(a.dauer_min) || 0,
      verbrauch_kcal: Number(a.verbrauch_kcal) || 0,
    }));

  if (validiert.length === 0) {
    preview.innerHTML = `<div class="parse-error">Keine gültigen Aktivitäten (name + verbrauch_kcal erforderlich).</div>`;
    confirmBtn.disabled = true; return;
  }

  state.parsedActivities = validiert;
  const gesamt = validiert.reduce((s, a) => s + a.verbrauch_kcal, 0);

  preview.innerHTML = `
    <div class="preview-section">
      <p class="preview-title">${validiert.length} Aktivität${validiert.length !== 1 ? 'en' : ''} erkannt</p>
      <table class="preview-table">
        <thead><tr><th>Aktivität</th><th>Dauer</th><th>kcal</th></tr></thead>
        <tbody>
          ${validiert.map(a => `
            <tr>
              <td>${escHtml(a.name)}</td>
              <td>${a.dauer_min ? `${a.dauer_min} Min` : '—'}</td>
              <td>${Math.round(a.verbrauch_kcal)}</td>
            </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr><td><strong>Gesamt</strong></td><td>—</td><td><strong>${Math.round(gesamt)}</strong></td></tr>
        </tfoot>
      </table>
    </div>`;
  confirmBtn.disabled = false;
}

function aktivitaetBestaetigenManuell() {
  const name  = document.getElementById('akt-name')?.value.trim();
  const dauer = parseInt(document.getElementById('akt-dauer')?.value) || 0;
  const kcal  = parseFloat(document.getElementById('akt-kcal')?.value);
  if (!name || !kcal || kcal <= 0) {
    zeigeToast('Bitte Name und Kalorien angeben', 'error'); return;
  }
  aktivitaetHinzufuegen({
    id: genId(),
    datum: state.modalDate,
    aktivitaeten: [{ id: genId(), name, dauer_min: dauer, verbrauch_kcal: kcal }],
  });
  schliesseModal();
  renderView();
  zeigeToast('Aktivität hinzugefügt', 'success');
}

function aktivitaetBestaetigenJson() {
  if (!state.parsedActivities?.length) return;
  aktivitaetHinzufuegen({
    id: genId(),
    datum: state.modalDate,
    aktivitaeten: state.parsedActivities,
  });
  schliesseModal();
  renderView();
  zeigeToast('Aktivität(en) hinzugefügt', 'success');
}

function bindeModalAktivitaetEvents() {
  document.getElementById('modal-cancel')?.addEventListener('click', schliesseModal);
  document.getElementById('akt-confirm-manuell')?.addEventListener('click', aktivitaetBestaetigenManuell);

  let debounce;
  document.getElementById('akt-json-input')?.addEventListener('input', () => {
    clearTimeout(debounce); debounce = setTimeout(analysiereAktivitaetJSON, 700);
  });
  document.getElementById('akt-parse-btn')?.addEventListener('click', analysiereAktivitaetJSON);
  document.getElementById('akt-confirm-json')?.addEventListener('click', aktivitaetBestaetigenJson);
  document.getElementById('copy-akt-prompt')?.addEventListener('click', () => {
    navigator.clipboard.writeText(getAktivitaetsPrompt()).then(() => zeigeToast('Prompt kopiert', 'success'));
  });
}

// ---- Gewicht JSON Modal ----

function bauGewichtJsonTab() {
  return `
    <div class="modal-json-tab">
      <p class="prompt-instructions">
        Importiere historische Gewichtsdaten. Format: Array mit <code>datum</code> (JJJJ-MM-TT) und <code>gewicht</code> (kg).
      </p>
      <div class="form-group">
        <label class="form-label">JSON einfügen</label>
        <textarea id="gw-json-input" class="form-textarea" rows="8"
          placeholder='[\n  { "datum": "2026-03-01", "gewicht": 83.5 },\n  { "datum": "2026-03-10", "gewicht": 83.0 }\n]'></textarea>
      </div>
      <button class="btn btn-secondary btn-full" id="gw-parse-btn">JSON analysieren</button>
      <div id="gw-json-preview"></div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="modal-cancel">Abbrechen</button>
        <button class="btn btn-primary" id="gw-confirm-json" disabled>Importieren</button>
      </div>
    </div>`;
}

function analysiereGewichtJSON() {
  const input = document.getElementById('gw-json-input')?.value.trim() || '';
  const preview = document.getElementById('gw-json-preview');
  const confirmBtn = document.getElementById('gw-confirm-json');
  if (!preview || !confirmBtn) return;

  if (!input) { preview.innerHTML = ''; confirmBtn.disabled = true; return; }

  let parsed;
  try { parsed = JSON.parse(input); }
  catch (e) {
    preview.innerHTML = `<div class="parse-error">Ungültiges JSON: ${escHtml(e.message)}</div>`;
    confirmBtn.disabled = true; return;
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    preview.innerHTML = `<div class="parse-error">Erwartet wird ein JSON-Array.</div>`;
    confirmBtn.disabled = true; return;
  }

  const validiert = parsed.filter(e => e.datum && Number(e.gewicht) > 0)
    .map(e => ({ id: genId(), datum: String(e.datum), gewicht: Number(e.gewicht) }));

  if (validiert.length === 0) {
    preview.innerHTML = `<div class="parse-error">Keine gültigen Einträge (datum + gewicht erforderlich).</div>`;
    confirmBtn.disabled = true; return;
  }

  state.parsedWeights = validiert;
  preview.innerHTML = `
    <div class="preview-section">
      <p class="preview-title">${validiert.length} Einträge erkannt</p>
      <table class="preview-table">
        <thead><tr><th>Datum</th><th>Gewicht</th></tr></thead>
        <tbody>${validiert.map(e => `<tr><td>${datumKurz(e.datum)}</td><td>${e.gewicht} kg</td></tr>`).join('')}</tbody>
      </table>
    </div>`;
  confirmBtn.disabled = false;
}

function gewichtImportBestaetigen() {
  if (!state.parsedWeights?.length) return;
  state.parsedWeights.forEach(e => gewichtHinzufuegen(e));
  schliesseModal();
  state.showGewichtForm = false;
  renderView();
  zeigeToast(`${state.parsedWeights.length} Gewichtseinträge importiert`, 'success');
}

function bindeModalGewichtEvents() {
  document.getElementById('modal-cancel')?.addEventListener('click', schliesseModal);
  let debounce;
  document.getElementById('gw-json-input')?.addEventListener('input', () => {
    clearTimeout(debounce); debounce = setTimeout(analysiereGewichtJSON, 700);
  });
  document.getElementById('gw-parse-btn')?.addEventListener('click', analysiereGewichtJSON);
  document.getElementById('gw-confirm-json')?.addEventListener('click', gewichtImportBestaetigen);
}

// ===== IMPORT / EXPORT =====

function exportiereDaten() {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kalorientracker-export-${heuteStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  zeigeToast('Daten exportiert', 'success');
}

function importiereDatei(datei) {
  if (!datei) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed?.eintraege || !Array.isArray(parsed.eintraege)) {
        zeigeToast('Ungültiges Dateiformat', 'error'); return;
      }
      zeigeBestaetigung(
        `Backup importieren? ${db.eintraege.length} bestehende Einträge werden überschrieben.`,
        () => {
          db = {
            version: 3,
            profil: parsed.profil || null,
            gewicht_eintraege: parsed.gewicht_eintraege || [],
            aktivitaet_eintraege: parsed.aktivitaet_eintraege || [],
            tages_aktivitaetslevel: parsed.tages_aktivitaetslevel || {},
            eintraege: parsed.eintraege,
            mahlzeit_vorlagen: parsed.mahlzeit_vorlagen || [],
          };
          speichereDaten();
          renderView();
          zeigeToast(`${parsed.eintraege.length} Einträge importiert`, 'success');
        }
      );
    } catch { zeigeToast('Fehler beim Lesen der Datei', 'error'); }
  };
  reader.readAsText(datei);
}

// ===== CONFIRM DIALOG =====

function zeigeBestaetigung(nachricht, onOk) {
  document.getElementById('confirm-message').textContent = nachricht;
  document.getElementById('confirm-overlay').classList.remove('hidden');

  const okBtn     = document.getElementById('confirm-ok');
  const cancelBtn = document.getElementById('confirm-cancel');
  const aufräumen = () => document.getElementById('confirm-overlay').classList.add('hidden');
  const neuerOk     = okBtn.cloneNode(true);
  const neuerCancel = cancelBtn.cloneNode(true);
  okBtn.replaceWith(neuerOk);
  cancelBtn.replaceWith(neuerCancel);
  neuerOk.addEventListener('click', () => { aufräumen(); onOk(); });
  neuerCancel.addEventListener('click', aufräumen);
}

// ===== TOAST =====

function zeigeToast(nachricht, typ = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast--${typ}`;
  toast.textContent = nachricht;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast--visible'));
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== EVENT BINDING =====

function bindeViewEvents() {
  const c = document.getElementById('view-container');

  // Mahlzeit hinzufügen
  c.querySelector('#add-meal-btn')?.addEventListener('click', e => {
    oeffneModal('mahlzeit', e.currentTarget.dataset.date);
  });

  // Detail-Toggle
  c.querySelectorAll('.btn-details-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const hidden = target.classList.toggle('hidden');
      btn.textContent = hidden ? 'Details anzeigen ▾' : 'Details ausblenden ▴';
    });
  });

  // Als Vorlage speichern
  c.querySelectorAll('.save-vorlage-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const eintrag = db.eintraege.find(e => e.id === btn.dataset.id);
      if (!eintrag) return;
      state.vorlagePending = JSON.parse(JSON.stringify(eintrag.zutaten));
      oeffneModal('vorlage-speichern', null);
    });
  });

  // Mahlzeit löschen
  c.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      zeigeBestaetigung('Diesen Eintrag wirklich löschen?', () => {
        eintragLoeschen(btn.dataset.id);
        renderView();
        zeigeToast('Eintrag gelöscht', 'success');
      });
    });
  });

  // Verlauf Navigation
  c.querySelectorAll('.date-list-item').forEach(item => {
    item.addEventListener('click', () => { state.verlaufDate = item.dataset.date; renderView(); });
  });
  c.querySelector('#back-btn')?.addEventListener('click', () => { state.verlaufDate = null; renderView(); });

  // Chart Range
  c.querySelectorAll('.range-btn').forEach(btn => {
    btn.addEventListener('click', () => { state.chartRange = parseInt(btn.dataset.range); renderView(); });
  });

  // Aktivität hinzufügen
  c.querySelector('#add-activity-btn')?.addEventListener('click', e => {
    oeffneModal('aktivitaet', e.currentTarget.dataset.date);
  });

  // Aktivität löschen
  c.querySelectorAll('.delete-aktivitaet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      zeigeBestaetigung('Diese Aktivität löschen?', () => {
        aktivitaetLoeschen(btn.dataset.eintragId, btn.dataset.aktId);
        renderView();
        zeigeToast('Aktivität gelöscht', 'success');
      });
    });
  });

  // Aktivitätslevel pro Tag ändern
  c.querySelector('#level-select')?.addEventListener('change', e => {
    setTagesLevel(e.target.dataset.datum, e.target.value);
    renderView();
  });

  // Link zu Profil aus Bilanz-Leer-State
  c.querySelector('#go-profil-link')?.addEventListener('click', e => {
    e.preventDefault(); navigiere('profil');
  });

  // Profil speichern
  c.querySelector('#save-profil-btn')?.addEventListener('click', () => {
    const geb        = document.getElementById('p-geb').value;
    const geschlecht = document.getElementById('p-geschlecht').value;
    const groesse    = parseFloat(document.getElementById('p-groesse').value);
    const level      = document.getElementById('p-level').value;
    if (!geb || !geschlecht || !groesse) { zeigeToast('Bitte alle Felder ausfüllen', 'error'); return; }
    db.profil = { geburtsdatum: geb, geschlecht, groesse, basis_aktivitaet: level };
    speichereDaten();
    renderView();
    zeigeToast('Profil gespeichert', 'success');
  });

  // Gewicht-Form Toggle
  c.querySelector('#toggle-gewicht-form')?.addEventListener('click', () => {
    state.showGewichtForm = !state.showGewichtForm;
    const form = document.getElementById('gewicht-form');
    if (form) form.classList.toggle('hidden', !state.showGewichtForm);
  });

  c.querySelector('#cancel-gewicht-btn')?.addEventListener('click', () => {
    state.showGewichtForm = false;
    document.getElementById('gewicht-form')?.classList.add('hidden');
  });

  // Gewicht speichern
  c.querySelector('#save-gewicht-btn')?.addEventListener('click', () => {
    const datum   = document.getElementById('gw-datum')?.value || heuteStr();
    const gewicht = parseFloat(document.getElementById('gw-wert')?.value);
    if (!gewicht || gewicht <= 0) { zeigeToast('Bitte ein gültiges Gewicht eingeben', 'error'); return; }
    gewichtHinzufuegen({ id: genId(), datum, gewicht });
    state.showGewichtForm = false;
    renderView();
    zeigeToast('Gewicht gespeichert', 'success');
  });

  // Gewicht löschen
  c.querySelectorAll('.delete-gewicht-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      zeigeBestaetigung('Diesen Gewichtseintrag löschen?', () => {
        gewichtLoeschen(btn.dataset.id);
        if (db.gewicht_eintraege.length === 0) {
          zeigeToast('Kein Gewichtseintrag mehr – bitte neues Gewicht eintragen', 'error');
        }
        renderView();
      });
    });
  });

  // Gewicht JSON importieren
  c.querySelector('#import-gewicht-btn')?.addEventListener('click', () => {
    oeffneModal('gewicht-json', null);
  });

  // Export
  c.querySelector('#export-btn')?.addEventListener('click', exportiereDaten);

  // Import Backup
  const importBtn   = c.querySelector('#import-btn');
  const importInput = c.querySelector('#import-file-input');
  if (importBtn && importInput) {
    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', e => importiereDatei(e.target.files[0]));
  }

  // Prompts kopieren
  c.querySelector('#copy-prompt-mahlzeit')?.addEventListener('click', () => {
    navigator.clipboard.writeText(AI_PROMPT_MAHLZEIT).then(() => zeigeToast('Prompt kopiert', 'success'));
  });
  c.querySelector('#copy-prompt-aktivitaet')?.addEventListener('click', () => {
    navigator.clipboard.writeText(getAktivitaetsPrompt()).then(() => zeigeToast('Prompt kopiert', 'success'));
  });

  // Alle Daten löschen
  c.querySelector('#clear-btn')?.addEventListener('click', () => {
    zeigeBestaetigung('Wirklich ALLE Daten löschen? Dies kann nicht rückgängig gemacht werden.', () => {
      db = { version: 3, profil: null, gewicht_eintraege: [], aktivitaet_eintraege: [], tages_aktivitaetslevel: {}, eintraege: [], mahlzeit_vorlagen: [] };
      speichereDaten();
      renderView();
      zeigeToast('Alle Daten gelöscht', 'success');
    });
  });
}

// ===== INIT =====

function bauNav() {
  const items = NAV_ITEMS.map(item => `
    <button class="nav-btn ${item.view === state.currentView ? 'active' : ''}" data-view="${item.view}">
      ${ICONS[item.icon]}<span>${item.label}</span>
    </button>`).join('');
  document.getElementById('sidebar-nav').innerHTML = items;
  document.getElementById('bottom-nav').innerHTML = items;

  document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
    btn.addEventListener('click', () => navigiere(btn.dataset.view));
  });
}

function init() {
  ladeDaten();
  bauNav();

  document.getElementById('modal-close').addEventListener('click', schliesseModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) schliesseModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('modal-overlay').classList.contains('hidden')) schliesseModal();
    document.getElementById('confirm-overlay').classList.add('hidden');
  });

  renderView();
}

document.addEventListener('DOMContentLoaded', init);
