import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const dataSrc=fs.readFileSync(path.join(root,'data/companions.js'),'utf8');
const ctx={window:{}};
vm.createContext(ctx);
vm.runInContext(dataSrc,ctx);
const data=ctx.window.SXS_COMPANIONS;

test('companion source contains friendable NPC friendship milestone data',()=>{
  assert.equal(data.rows.length,58);
  assert.equal(data.archetypes.length,11);
  assert.equal(data.source.repo,'HungMCLe/Swordxstafd-datamine');
  assert.equal(data.source.path,'web/dist/npcs.html');
  assert.match(data.source.commit,/^[0-9a-f]{40}$/);
  const ymirs=data.rows.filter(r=>r[1]==='Ymir');
  assert.equal(ymirs.length,2);
  assert.notEqual(ymirs[0][0],ymirs[1][0]);
  assert.notEqual(ymirs[0][3],ymirs[1][3]);
});

test('Inventory has a Companions subtab with tracked state and friendship levels',()=>{
  assert.match(html,/id="invSubCompanionsV743"[^>]*>Companions</);
  assert.match(html,/id="inventoryCompanionsPaneV743"/);
  assert.match(html,/id="companionInventoryBodyV743"/);
  assert.match(html,/Friendship Lv/);
  assert.match(app,/extras\.companionInventory/);
  assert.match(app,/function renderCompanionInventoryV743/);
  assert.match(app,/ci-track-v743/);
  assert.match(app,/ci-level-v743/);
});

test('Strategy ranks source-visible companion milestones without double-counting the current sheet',()=>{
  assert.match(html,/id="runCompanionStrategyV743"/);
  assert.match(html,/milestone value density/i);
  assert.match(html,/does <b>not<\/b> add them a second time/);
  assert.match(app,/function runCompanionStrategyV743/);
  assert.match(app,/function companionBandItemsV743/);
  assert.match(app,/x\.label==='SPD'\)relative\*=\.5/);
  assert.match(app,/costFactor=Math\.max\(\.1,c\.friendship\/COMPANION_STANDARD_FRIENDSHIP_V743\)/);
  assert.match(app,/Current friendship stats remain in your displayed sheet/);
});

test('offline shell includes companion reference data',()=>{
  const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  assert.match(sw,/data\/companions\.js/);
});
