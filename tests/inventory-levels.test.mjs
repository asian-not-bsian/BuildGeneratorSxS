import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');

function tableHeadForBody(bodyId){
  const bodyAt=html.indexOf(`id="${bodyId}"`);
  assert.ok(bodyAt>=0,`table for ${bodyId} not found`);
  const headOpen=html.lastIndexOf('<thead',bodyAt);
  const headStart=html.indexOf('>',headOpen)+1;
  const headEnd=html.indexOf('</thead>',headStart);
  assert.ok(headOpen>=0&&headEnd>headStart,`thead for ${bodyId} not found`);
  return html.slice(headStart,headEnd);
}

test('Technique and Charm inventory shows rank but no Level or Source column',()=>{
  const head=tableHeadForBody('skillInventoryBodyV54');
  assert.doesNotMatch(head,/<th>\s*Level\s*<\/th>/i);
  assert.doesNotMatch(head,/<th>\s*Source\s*<\/th>/i);
  assert.match(head,/<th>\s*Rank\s*<\/th>/i);
});

test('Fantomon roster separates rarity from rank and stores no Level column',()=>{
  const head=tableHeadForBody('fantInventoryBody');
  assert.match(head,/<th>\s*Rarity\s*<\/th>/i);
  assert.match(head,/<th>\s*Rank\s*<\/th>/i);
  assert.doesNotMatch(head,/<th>\s*Level\s*<\/th>/i);
  assert.doesNotMatch(head,/Support\s*(?:skill\s*)?rank/i);
  assert.match(html,/Fantomon levels are not stored in the roster/);
  assert.match(html,/Epic → Legendary → Mythic → Divine → Immortal/);
});

test('Fantomon rarity and rank use separate allowed progressions',()=>{
  assert.match(app,/const FANTOMON_RARITIES_V73=\['Mythic','Legendary','Epic'\]/);
  assert.match(app,/const FANTOMON_RANKS_V73=\['Epic','Legendary','Mythic','Divine','Immortal'\]/);
  assert.match(app,/class="fi-rarity"/);
  assert.match(app,/class="fi-rank"/);
});

test('inventory migration removes legacy stored levels and normalizes Fantomon fields',()=>{
  assert.match(app,/delete r\.skillLevel/);
  assert.match(app,/delete it\.level/);
  assert.match(app,/it\.rarity=normalizeFantomonRarityV73/);
  assert.match(app,/it\.skillRank=normalizeFantomonRankV73/);
});

test('skill levels are derived from equipped slots and unequipped skills are inactive',()=>{
  assert.match(app,/function skillSlotLevelsV72/);
  assert.match(app,/Inventory stores ownership and rank only; levels come from Technique slots 1–4/);
  assert.match(app,/Inventory stores ownership and rank only; levels come from Charm slots 1–4/);
  assert.match(app,/Unequipped · no active effect/);
});

test('Fantomon modeling derives roster levels from Current Build slot',()=>{
  assert.match(app,/function fantomonSlotLevelV72/);
  assert.match(app,/level:fantomonSlotLevelV72\(s\)/);
  assert.match(html,/lowest equipped Fantomon level/);
});

test('Fantomon optimizer is build-fit first with rarity as a close-result preference',()=>{
  assert.match(app,/function fantomonBuildFitV73/);
  assert.match(app,/function compareFantomonRowsV73/);
  assert.match(app,/function trimFantomonBeamV73/);
  assert.match(app,/support effects are matched against your equipped Techniques and current stats/);
  assert.match(app,/Mythic → Legendary → Epic/);
  assert.match(app,/Fantomon support fit is evaluated against the candidate build/);
});
