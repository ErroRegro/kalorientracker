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
