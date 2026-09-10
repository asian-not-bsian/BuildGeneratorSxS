# BuildGeneratorSxS

A fan-made **Sword x Staff** build, combat, inventory, and team optimizer designed to run as a static GitHub Pages site.

## What v7.3 adds

- Removed the Source column from Technique & Charm Inventory. The user-facing list now focuses on ownership, type, skill, class, and rank.
- Fantomon Inventory now separates **Rarity** (Mythic, Legendary, Epic) from leveling **Rank** (Epic, Legendary, Mythic, Divine, Immortal).
- Fantomon roster entries still store no level. Equipped Fantomons use their Current Build slot level; unequipped Fantomons use the lowest equipped Fantomon level.
- Fantomon optimization evaluates each owned Fantomon's modeled support effects against the player's active Techniques/stats and the candidate full build. Clear modeled performance wins; when options are close, build fit is considered and rarity is preferred Mythic → Legendary → Epic.
- Full-build Fantomon selection uses the same build-fit and rarity tie-breaking instead of ranking Fantomons only by a generic score.

## What v7.2 added

- Technique and Charm Inventory stores ownership and rank only. Levels are properties of the four equipped Technique/Charm slots in Current Build.
- Unequipped Techniques and Charms have no active effect. Optimizers assign candidate skills to equipped slots before scoring them.
- Fantomon Inventory no longer stores or displays a per-Fantomon level. The Current Build Fantomon slot level is authoritative.
- Unequipped Fantomons are modeled at the lowest equipped Fantomon level; with the current single equipped Fantomon slot, that is the Current Build Fantomon slot level.
- Screenshot identification and Inventory synchronization preserve slot levels instead of replacing them with Inventory values.

## What v7.1 added

- Modular deployment structure: HTML, CSS, source data, feature modules, workers, and tests are separate files.
- Inventory/eligibility engine shared across optimizers: owned Skills/Fantomons, class lineage, gear season, relic affinity, and slot legality use one rules layer.
- Current-season gear enforcement in Current Build and gear/full-build/roster optimization.
- Inventory-bound Technique and Charm optimization using the saved rank for each owned skill and the level of the equipped slot being evaluated.
- Worker-assisted Gear, Technique, Charm, Relic, Full Build, and Chaos Rift searches, with progress and cancellation where applicable.
- Cooperative batching for the exact PvP and Team 4v4 combat engines so long simulations yield to the browser instead of locking the UI.
- Chaos Rift support-team timeline optimizer for 1–3 supports, including inherited class-lineage skills, Techniques, Charms, Fantomons, cooldowns, durations, support effects, and boss debuffs. Values that are not exposed by source data remain marked DERIVED rather than being presented as exact.
- Breakpoint-aware recommendation explanations, including SPD action breakpoints and Crit saturation.
- Share links include the active build plus equipped current-season gear and relic loadout.
- Screenshot analysis for Current Build and PvP opponents combines text recognition with optional icon matching. Technique, Charm, and Fantomon reference images are loaded only after you click an icon in a screenshot; normal calculator pages do not preload or display the game art.
- Team 4v4 AI trace showing the client targeting priority chain and when a fallback was required.
- Regression tests and GitHub Actions checks.
- Service worker for repeat-load/offline app-shell caching. Live source refreshes are not cached by the service worker.


### v7.1 screenshot matching

The screenshot review can identify an unlabeled icon after OCR finishes: choose Technique, Charm, Fantomon, Relic, or Gear, then click the icon in the screenshot preview. Technique/Charm and Fantomon candidates use the public source image paths. Relic/Gear candidates are included only when the active source data exposes an explicit image or icon ID; the app does not guess an image mapping. Matches are never applied automatically.

To keep startup fast, reference images are fetched and downsampled only when this feature is used, then cached in memory for the rest of the page session.

## Run locally

The calculator is static; no build step is required. Because Web Workers, ES modules, and the service worker require an HTTP origin, serve the folder rather than opening `index.html` with `file://`.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Tests

Node 20+ is sufficient.

```bash
npm test
npm run check
```

The regression suite covers class lineage, season eligibility, SPD breakpoints, Crit clamping, relic slot limits, share payload round-tripping, project structure, local asset references, and duplicate static HTML IDs.

## Deploy with GitHub Pages

The included `.github/workflows/pages.yml` publishes the repository root to GitHub Pages whenever `main` is updated.

In the GitHub repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Push/merge to `main`.
4. The **Deploy GitHub Pages** workflow publishes the site.

No Jekyll build is required; `.nojekyll` is included.

## Data and accuracy labels

The calculator intentionally distinguishes source-backed values from inference:

- **EXACT** — directly represented by loaded source data or a verified formula.
- **DERIVED** — inferred from source text/relationships or reduced into a calculator model.
- **OVERRIDE** — a local user correction replaces a source value.
- **MISSING** — the source does not expose enough information; the calculator does not invent an exact value.

Static set rules and the Source Catalog are editable under **Reference → Set Logic**. Drop-rate and acquisition-planning pages are temporarily disabled until a reliable rate source is available.

## Important limitations

Some Sword x Staff behavior remains server-side. Where the client does not expose default AI weights, idle-movement rules, or exact cross-player support magnitudes, the UI labels the result as fallback/derived rather than claiming exact game behavior.

The exact PvP and Team 4v4 simulators currently use cooperative main-thread batches because their legacy combat implementation shares a large compatibility core. Combinatorial searches are offloaded to Web Workers. This keeps the UI responsive while preserving the established combat implementation; migrating the full combat engine into a dedicated worker can be done later without changing saved-data formats.

## Project layout

```text
index.html
assets/styles.css
data/datamine.js
js/app.js                  # legacy-compatible calculator core
js/module-loader.js        # lazy feature-module loader
js/modules/                # feature entry points
js/workers/optimizer-worker.js
js/lib/formulas.mjs
tests/
.github/workflows/
```

The structure is intentionally compatible with a gradual refactor: new functionality lives in modules/workers while older calculator logic remains in the compatibility core until it can be extracted safely.
