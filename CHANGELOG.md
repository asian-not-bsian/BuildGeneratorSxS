# Changelog

## v7.0.0

### Architecture and performance
- Split the former single-file calculator into `index.html`, CSS, datamine data, feature modules, Web Worker code, shared formula tests, and deployment metadata.
- Added lazy feature module loading and preserved the optimized lazy tab/inventory rendering path.
- Added worker-assisted combinatorial searches for gear, Techniques, Charms, Relics, full builds, Chaos Realm teams, and acquisition ranking.
- Added cancel/progress controls to long optimizers; exact PvP and Team simulations use cooperative batches with cancellation to keep the UI responsive.
- Added a service worker for repeat-load/offline app-shell caching.

### Optimization accuracy
- Centralized class-lineage, ownership, current-season gear, Fantomon, and relic-affinity eligibility.
- Technique and Charm optimization now uses only owned Inventory entries at their saved rank and level.
- Fantomon optimization uses owned Inventory level, Adult/Baby state, support rank, and configured effect overrides.
- Roster optimization now respects owned skill/Fantomon pools and current-season gear.
- Added breakpoint-aware recommendation explanations for SPD actions, Crit saturation, and major stat changes.

### Chaos Realm
- Added a timeline-based primary-damage optimizer for 1–3 supports.
- Optimizes support class, lineage-legal Techniques, Charms, and Fantomon selections.
- Models cooldown/duration uptime, offensive ally buffs, boss DEF reduction/vulnerability, SPD, Mastery/Affinity, Crit effects, and cooldown support where source data allows.
- Source-incomplete cross-player magnitudes stay labeled DERIVED.

### Auditability and planning
- Added Reference → Data Health with exact/derived/override/missing status and source-refresh diffs.
- Moved Static Set Logic and Datamine Catalog under Reference → Set Logic.
- Added AI/targeting trace for Team 4v4 client priority decisions and fallback identification.
- Added Acquisition Planner for missing Gear, Techniques, Charms, Fantomons, and Relics, with expected runs/time only when an acquisition probability is actually known.

### Importing and sharing
- Added confidence review to Current Build and PvP opponent screenshot OCR before applying detected fields.
- Extended share links to include current Season, equipped gear, and relic-by-affinity loadout.

### Deployment and tests
- Added GitHub Pages workflow, `.nojekyll`, web manifest, version manifest, and service worker.
- Added automated regression tests for class lineage, season eligibility, speed breakpoints, Crit clamping, relic slot limits, share encoding, duplicate IDs, local assets, and deployment files.
