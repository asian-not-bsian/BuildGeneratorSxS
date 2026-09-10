BuildGeneratorSxS v7.1 repository patch

Replace/create these files at the same paths in the repository:
- js/module-loader.js
- js/v7.1-overrides.js (new)
- js/modules/screenshots.js
- sw.js

This patch:
- adds click-to-identify screenshot icon matching for Techniques, Charms, and Fantomons using verified datamine image paths;
- only offers Gear/Relic image matching when a source record contains an explicit image/icon mapping;
- removes Acquisition Planner, Drop Rates, Data Health, and farming/reroll UI from user navigation/pages at runtime;
- stops loading the disabled drop/acquisition modules;
- collapses/hides technical optimizer and targeting controls from the normal user experience;
- preserves PvP opponent rank/level values when OCR applies identified names;
- keeps reference/source details available in Reference rather than cluttering normal pages;
- bumps the service-worker cache and includes the new override module.
