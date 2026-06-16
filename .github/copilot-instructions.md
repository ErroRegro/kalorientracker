# Copilot Instructions

## Commands

- **Local preview:** `python -m http.server 3000`
  - This matches `.claude/launch.json` and serves the app as a static site from the repository root.
- **JavaScript syntax check:** `node --check app.js`
- **Lint:** `npm run lint` — ESLint check on `app.js` (exit 0 = pass)
- **Lint + autofix:** `npm run lint:fix`
- **Build / automated tests:** no package-managed build or test commands are present in this repository.

## High-level architecture

- This repository is a **static single-page app** with no bundler or framework. `index.html` is the shell, `styles.css` contains all styling, and `app.js` contains the entire application logic.
- `index.html` provides a fixed app shell: desktop sidebar, mobile bottom navigation, one `#view-container` mount point, a reusable modal, a confirm dialog, a toast container, and a Chart.js CDN script. There is no module system; `app.js` runs directly in the browser.
- `app.js` is organized by section comments and splits state into:
  - `db`: persisted application data in `localStorage` under `STORAGE_KEY`
  - `state`: transient UI state such as current view, modal tab, parsed JSON preview data, chart range, and editing state
- The persisted `db` schema is centered around:
  - `profil`
  - `gewicht_eintraege`
  - `eintraege` for meal entries, each with nested `zutaten`
  - `aktivitaet_eintraege` for daily activity logs, each with nested `aktivitaeten`
  - `tages_aktivitaetslevel` overrides
  - `mahlzeit_vorlagen`
  - `fasting_timer`
  - `groq_api_key` — user's Groq API key, stored in localStorage, used for AI features
- Rendering follows a **string-template + rebind** pattern:
  - `bau*View()` / `bau*Tab()` functions return HTML strings
  - `renderView()` and `renderModalBody()` replace `innerHTML`
  - `binde*Events()` must reattach DOM listeners after every render
- Charts are only created inside the `grafiken` view. `renderView()` destroys old `state.activeCharts` instances before rerendering, then `initCharts()` recreates them when needed.
- Daily calorie balance is computed from:
  - profile + latest weight on or before the target date
  - BMR via `berechneBMR()`
  - activity factor from `AKTIVITAETS_LEVELS`
  - extra logged activities from `aktivitaet_eintraege`

## Groq AI Integration (added 2025-06)

The app has **two AI workflows** — the old manual one and the new voice one:

### Old workflow (still available)
- User opens „Mahlzeit hinzufügen" modal → tab „KI-Prompt" → copies prompt → pastes into ChatGPT → copies JSON back → pastes into „JSON einfügen" tab.

### New workflow — Voice Input (modalTipo: `'sprache'`)
- Requires a free **Groq API key** entered once in Profil → „KI-Integration (Groq)". Stored in `db.groq_api_key`.
- A 🎤 button appears next to „Mahlzeit hinzufügen" in the Heute and Verlauf-Detail views **only when** `db.groq_api_key` is set.
- The modal (`bauSpracheModal`) runs a **3-phase flow**:
  1. **Aufnahme**: `MediaRecorder` records audio (WebM/Opus)
  2. **Verarbeitung**: audio → Groq Whisper (`whisper-large-v3`) for STT → text optionally matched against saved templates → Groq LLaMA (`llama-3.3-70b-versatile`) for nutrient JSON
  3. **Vorschau**: shows ingredient table (reuses same validation as JSON import) → „Hinzufügen"
- All AI logic is inside `bindeSpracheModalEvents()` as closures. Key inner functions:
  - `transkribiere(blob)` — Whisper API call
  - `pruefeVorlagenMatch(text)` — LLaMA call to find exact template match (brand-tolerant)
  - `analysiereText(text)` — LLaMA call for nutrient JSON using `GROQ_SYSTEM_PROMPT`
  - `zeigeVorlageErkannt(vorlage, text)` — renders template match UI
  - `zeigeVorschau(text)` — renders nutrient preview after LLaMA analysis
- `schlageMahlzeitNamenVor(transkript, zutaten)` generates a specific meal title like „Frühstück – Hähnchenbrust & Reis" based on time-of-day and recognized ingredients.
- Template matching rules (in `pruefeVorlagenMatch` prompt):
  - Brand in template, no brand in transcript → **match**
  - Brand in template, different brand in transcript → **no match**
  - Extra or missing ingredients → **no match**
- The voice flow reuses `eintragBestaetigen()` and `state.parsedIngredients` — same as JSON import.
- `GROQ_SYSTEM_PROMPT` (const in app.js) instructs LLaMA to use USDA/BLS reference data and return only a JSON array.

## Quick-Edit Slider (added 2025-06)

- **Long-press (500ms)** on any `.ingredient-row` in the Heute/Verlauf-Detail view opens a floating slider popup (`zeigeQuickEditSlider()`).
- The slider uses a **dynamic window**: range = current value ±40% (min ±20g), re-centering after each `change` event for precision.
- `−` / `+` nudge buttons for ±1g exact adjustment.
- Tapping outside saves and closes. Nutrients are scaled proportionally using the ratio `newMenge / originalMenge`.
- Long-press is bound in `bindeIngredientLongPress(container)`, called from `bindeViewEvents()`.
- `data-eintrag-id` and `data-zutat-idx` attributes on each `.ingredient-row` identify the entry and ingredient.

## Key conventions

- Keep **German naming and UI copy** consistent. Functions, data keys, comments, and visible labels are all German (`bau*`, `binde*`, `zeige*`, `eintraege`, `gewicht_eintraege`, `mahlzeit_vorlagen`).
- Treat `NUTRIENT_FIELDS` as the **single source of truth** for nutrient keys, labels, grouping, and aggregation. Reuse it instead of hardcoding nutrient field lists in new features.
- Dates are stored as `YYYY-MM-DD` strings from `toLocaleDateString('sv')`, while event timestamps use full ISO strings. Preserve that split when adding new date-dependent logic.
- Any mutation of persisted data is expected to call `speichereDaten()` immediately. Most add/delete/update helpers already encapsulate this; reuse those helpers instead of mutating `db` inline.
- Weight entries are **unique per day**. `gewichtHinzufuegen()` replaces an existing entry for the same `datum` instead of appending a duplicate.
- When injecting dynamic text into HTML strings, use `escHtml()` first. Existing JSON preview UIs rely on this to render pasted content and parse errors safely.
- If you change any view or modal markup generated with `innerHTML`, update the corresponding `binde*Events()` logic in the same change. DOM references do not survive rerenders.
- Modal workflows are coordinated through `state.modalTipo`, `state.modalTab`, and parsed preview state (`parsedIngredients`, `parsedActivities`, `parsedWeights`). Reset or preserve those fields deliberately when extending modal flows.
- Navigation is view-name driven through `NAV_ITEMS`, `state.currentView`, `bauNav()`, and `navigiere()`. Add new top-level screens through that flow instead of manually wiring isolated buttons.
- The CSS uses a small design-token layer in `:root` plus modifier-style class names such as `--danger`, `--full`, and `--small`. Prefer extending existing tokens and component classes over adding one-off inline styles.
- `state.vorlagePendingName` holds a pre-filled template name (from the entry's `notiz`) when opening the „Als Vorlage speichern" modal.
- `APP_VERSION` constant at the top of `app.js` is displayed in the Profil view. Bump it with every meaningful release.
- The app is deployed as a **GitHub Pages static site** at `https://erroregro.github.io/kalorientracker`.
- For local HTTPS testing on mobile (needed for `MediaRecorder`), use **ngrok**: `ngrok http 3000`. The user has ngrok installed and configured.
- `MediaRecorder` and `FormData` are listed as globals in `eslint.config.js`.

## Commands

- **Local preview:** `python -m http.server 3000`
  - This matches `.claude/launch.json` and serves the app as a static site from the repository root.
- **JavaScript syntax check:** `node --check app.js`
- **Lint:** `npm run lint` — ESLint check on `app.js` (exit 0 = pass)
- **Lint + autofix:** `npm run lint:fix`
- **Build / automated tests:** no package-managed build or test commands are present in this repository.

## High-level architecture

- This repository is a **static single-page app** with no bundler or framework. `index.html` is the shell, `styles.css` contains all styling, and `app.js` contains the entire application logic.
- `index.html` provides a fixed app shell: desktop sidebar, mobile bottom navigation, one `#view-container` mount point, a reusable modal, a confirm dialog, a toast container, and a Chart.js CDN script. There is no module system; `app.js` runs directly in the browser.
- `app.js` is organized by section comments and splits state into:
  - `db`: persisted application data in `localStorage` under `STORAGE_KEY`
  - `state`: transient UI state such as current view, modal tab, parsed JSON preview data, chart range, and editing state
- The persisted `db` schema is centered around:
  - `profil`
  - `gewicht_eintraege`
  - `eintraege` for meal entries, each with nested `zutaten`
  - `aktivitaet_eintraege` for daily activity logs, each with nested `aktivitaeten`
  - `tages_aktivitaetslevel` overrides
  - `mahlzeit_vorlagen`
  - `fasting_timer`
- Rendering follows a **string-template + rebind** pattern:
  - `bau*View()` / `bau*Tab()` functions return HTML strings
  - `renderView()` and `renderModalBody()` replace `innerHTML`
  - `binde*Events()` must reattach DOM listeners after every render
- Charts are only created inside the `grafiken` view. `renderView()` destroys old `state.activeCharts` instances before rerendering, then `initCharts()` recreates them when needed.
- The app does **not** call an AI API directly. Instead it exposes copyable prompts for meal/activity analysis and expects the user to paste JSON results back into modal import flows. Meal, activity, and weight imports all validate pasted JSON before enabling confirmation.
- Daily calorie balance is computed from:
  - profile + latest weight on or before the target date
  - BMR via `berechneBMR()`
  - activity factor from `AKTIVITAETS_LEVELS`
  - extra logged activities from `aktivitaet_eintraege`

## Key conventions

- Keep **German naming and UI copy** consistent. Functions, data keys, comments, and visible labels are all German (`bau*`, `binde*`, `zeige*`, `eintraege`, `gewicht_eintraege`, `mahlzeit_vorlagen`).
- Treat `NUTRIENT_FIELDS` as the **single source of truth** for nutrient keys, labels, grouping, and aggregation. Reuse it instead of hardcoding nutrient field lists in new features.
- Dates are stored as `YYYY-MM-DD` strings from `toLocaleDateString('sv')`, while event timestamps use full ISO strings. Preserve that split when adding new date-dependent logic.
- Any mutation of persisted data is expected to call `speichereDaten()` immediately. Most add/delete/update helpers already encapsulate this; reuse those helpers instead of mutating `db` inline.
- Weight entries are **unique per day**. `gewichtHinzufuegen()` replaces an existing entry for the same `datum` instead of appending a duplicate.
- When injecting dynamic text into HTML strings, use `escHtml()` first. Existing JSON preview UIs rely on this to render pasted content and parse errors safely.
- If you change any view or modal markup generated with `innerHTML`, update the corresponding `binde*Events()` logic in the same change. DOM references do not survive rerenders.
- Modal workflows are coordinated through `state.modalTipo`, `state.modalTab`, and parsed preview state (`parsedIngredients`, `parsedActivities`, `parsedWeights`). Reset or preserve those fields deliberately when extending modal flows.
- Navigation is view-name driven through `NAV_ITEMS`, `state.currentView`, `bauNav()`, and `navigiere()`. Add new top-level screens through that flow instead of manually wiring isolated buttons.
- The CSS uses a small design-token layer in `:root` plus modifier-style class names such as `--danger`, `--full`, and `--small`. Prefer extending existing tokens and component classes over adding one-off inline styles.
