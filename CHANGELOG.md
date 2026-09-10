# Changelog

## v7.3.0

### Inventory clarity
- Removed the Source column from the Technique & Charm Inventory list.
- Split Fantomon progression into separate **Rarity** and **Rank** columns. Rarity uses Mythic / Legendary / Epic; Rank uses Epic / Legendary / Mythic / Divine / Immortal.
- Kept Fantomon levels out of the roster. Equipped Fantomon level remains slot-derived, and unequipped Fantomons use the lowest equipped Fantomon level.
- Migrates older Fantomon roster entries by removing legacy per-entry level/use fields and normalizing rarity/rank values.

### Fantomon optimization
- Added build-fit scoring that compares each Fantomon's support behavior with the player's active Techniques, cooldown profile, damage/support focus, SPD breakpoints, and PvP/survival needs.
- Modeled combat/support outcome remains the primary signal. For close outcomes, build fit is considered next and rarity is preferred Mythic → Legendary → Epic.
- Full-build optimization now applies the same Fantomon build-fit/rarity tie-breaking against each candidate build.
- Optimizer results show Fantomon rarity, rank, slot-derived level, Adult/Baby state, and the main build-fit reasons.

## v7.2.0

### Slot-derived levels
- Removed Level from Technique and Charm Inventory. Owned entries now store ownership and rank; level comes from the equipped Technique/Charm slot.
- Unequipped Techniques and Charms are inactive and contribute no active effect. Inventory now shows whether an owned skill is equipped without duplicating its level.
- Removed per-Fantomon Level from the Fantomon roster. The Current Build Fantomon slot level is authoritative for the equipped Fantomon.
- Unequipped Fantomons are modeled at the lowest equipped Fantomon level. With the current single equipped Fantomon slot, this resolves to the Current Build Fantomon slot level.
- Screenshot matching and Inventory synchronization preserve the existing slot level rather than overwriting it from Inventory metadata.
- Technique, Charm, Fantomon, and full-build optimizers now derive candidate levels from the slots being evaluated.

## v7.1.0

### Screenshot analysis
- Added click-to-identify visual icon matching inside Current Build and PvP screenshot review.
- Technique and Charm icons map to the public datamine skill image IDs; Fantomon icons map to the public pet image IDs.
- Relic and Gear visual candidates are used only when their source data exposes an explicit image/icon mapping. No guessed ID mapping is introduced.
- Matching is lazy: reference images are loaded only after the user clicks an icon in a screenshot, then cached as small comparison vectors.
- Visual matches show the best candidates and require confirmation before changing a build. PvP matches preserve opponent rank/level fields rather than borrowing the user's owned inventory details.

### User experience
- Removed Drop Rates, farming odds, and Acquisition Planner from the user interface until a reliable drop/acquisition-rate source is available.
- Removed Data Health from ordinary navigation and simplified user-facing descriptions across Build, Compare, Progression, Team 4v4, Chaos Realm, and Roster Optimizer.
- Moved low-level search/targeting controls behind advanced sections or kept their tuned defaults hidden from everyday users.
- PvP Techniques now follow the same equipped-means-used rule as the rest of the calculator; the redundant Use checkbox is no longer shown.

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
