import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const worker=fs.readFileSync(path.join(root,'js/workers/optimizer-worker.js'),'utf8');

function count(src,needle){return src.split(needle).length-1;}

test('v7.4 navigation and header cleanup are present',()=>{
  assert.match(html,/data-tab="chaosrealm"[^>]*>Chaos Rift</);
  assert.doesNotMatch(html,/>Chaos Realm</);
  assert.doesNotMatch(html,/id="shareBtn"|id="exportBtn"|id="importInput"/);
  assert.equal(count(html,'<summary>Advanced targeting details</summary>'),1);
});

test('screenshot tools support clearing, enemy import, and K\/M scaling',()=>{
  assert.match(html,/id="clearBuildScreenshotsV74"/);
  assert.match(html,/id="clearPvpScreenshotsV74"/);
  assert.match(html,/id="enemyScreenshotInputV74"/);
  assert.match(html,/id="clearEnemyScreenshotsV74"/);
  assert.match(app,/\/\[kK\]\/\.test\(mm\[2\]\|\|''\)\)v\*=1000/);
  assert.match(app,/\/\[mM\]\/\.test\(mm\[2\]\|\|''\)\)v\*=1000000/);
});

test('Accuracy is displayed as percent while combat keeps normalized rating',()=>{
  assert.match(html,/id="myAcc"[^>]*step="0\.1"/);
  assert.match(html,/id="pvpEnemyAcc"[^>]*step="0\.1"/);
  assert.match(app,/BaseBlockAvoidPercentValue/);
  assert.match(app,/accPct/);
  assert.match(app,/ocrAccuracyPercentV74/);
});

test('Friend Profiles feed PvP, Team 4v4, and Chaos Rift selectors',()=>{
  assert.match(html,/data-tab="friendprofiles"/);
  assert.match(html,/id="friendProfileInputV74"/);
  assert.match(html,/id="pvpFriendProfileV74"/);
  assert.match(html,/id="chaosSupportSource0V74"/);
  assert.match(app,/extras\.friendProfiles/);
  assert.match(app,/profileSourcesV3/);
  assert.match(app,/friendChaosCandidateV74/);
});

test('Chaos Rift advanced search settings are unified and loadout breadth is operational',()=>{
  assert.equal(count(html,'<summary>Advanced optimizer settings</summary>'),1);
  assert.match(html,/Boss turns modeled[\s\S]*?chaosTurnsV7/);
  assert.match(html,/Loadouts checked per class[\s\S]*?chaosLoadoutCapV7/);
  assert.match(html,/Search breadth[\s\S]*?chaosBeamV7/);
  assert.match(app,/chaosCandidatesForClassV74/);
  assert.match(app,/chaosLoadoutCapV7/);
  assert.match(worker,/fixed/);
});

test('relic behavior follows series filter, one standalone group, and explicit percent units',()=>{
  assert.match(html,/id="relicSeriesFilterV74"/);
  assert.match(app,/standalone:all/);
  assert.match(app,/Standalone \/ no set/);
  assert.match(app,/function relicUnitV55\([\s\S]*?includes\('%'\)[\s\S]*?return'flat'/);
  assert.doesNotMatch(html,/Relics are grouped automatically by the set ID/);
});

test('four Fantomon slots and general class-build roster optimizer are enabled',()=>{
  assert.match(html,/id="currentFantomonFormationV74"/);
  assert.match(app,/100% base boost/);
  assert.match(app,/50% base boost/);
  assert.match(app,/generalClassStateV74/);
  assert.match(html,/Optimize four class builds/);
});

test('skill ranks use named labels and support\/survivability use active scoring paths',()=>{
  assert.match(app,/DM\.rankLabels/);
  assert.match(app,/supportMetricsV2/);
  assert.match(app,/survivabilityMetrics/);
  assert.match(app,/expectedSkillDamage/);
});
