import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const loader=fs.readFileSync(path.join(root,'js/module-loader.js'),'utf8');
const screenshots=fs.readFileSync(path.join(root,'js/modules/screenshots.js'),'utf8');

function localRefs(re,src){return [...src.matchAll(re)].map(m=>m[1]).filter(x=>x&&!/^(?:https?:|data:|#)/.test(x));}

test('static HTML ids are unique',()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  const dup=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
  assert.deepEqual(dup,[]);
});

test('local script, stylesheet and manifest references exist',()=>{
  const refs=[
    ...localRefs(/<script[^>]+src="([^"]+)"/g,html),
    ...localRefs(/<link[^>]+href="([^"]+)"/g,html)
  ];
  for(const ref of refs){
    const clean=ref.split(/[?#]/)[0];
    assert.ok(fs.existsSync(path.join(root,clean)),`missing local asset: ${clean}`);
  }
});

test('main navigation keeps Chaos Rift under Combat and removes unverified farming pages',()=>{
  assert.match(html,/data-parent-group="combat"[\s\S]*?data-tab="chaosrealm"/);
  assert.doesNotMatch(html,/data-tab="acquisition"/);
  assert.doesNotMatch(html,/data-tab="droprates"/);
  assert.doesNotMatch(html,/data-tab="datahealth"/);
  assert.doesNotMatch(html,/id="tab-acquisition"|id="tab-droprates"|id="tab-datahealth"/);
  assert.doesNotMatch(html,/id="farmDropV4"|id="runFarmV4Btn"/);
  assert.doesNotMatch(loader,/acquisition|droprates|datahealth/);
});

test('screenshot analysis has lazy game-icon matching without normal-page icon preload',()=>{
  assert.match(screenshots,/raw\.githubusercontent\.com\/HungMCLe\/Swordxstafd-datamine/);
  assert.match(screenshots,/skills\/skill_\$\{/);
  assert.match(screenshots,/pets\/pet_\$\{/);
  assert.match(screenshots,/Identify an unlabeled icon/);
  assert.match(app,/screenshotCatalog:screenshotCatalogV71/);
  assert.match(app,/applyScreenshotImageMatch:applyScreenshotImageMatchV71/);
  assert.doesNotMatch(html,/raw\.githubusercontent\.com\/HungMCLe\/Swordxstafd-datamine/);
});

test('startup markup does not force details accordions open',()=>{
  assert.doesNotMatch(html,/<details\b[^>]*\bopen(?:\s|=|>)/i);
});

test('relic affinity implementation uses the valid helper',()=>{
  assert.doesNotMatch(app,/relicAffinityOfV60/);
  assert.match(app,/relicAffinityV60/);
});

test('owned/lineage eligibility is centralized for optimizers',()=>{
  assert.match(app,/const ELIGIBILITY_V7=/);
  assert.match(app,/ownedSkillPoolV62\('Technique'/);
  assert.match(app,/ownedSkillPoolV62\('Charm'/);
  assert.match(app,/ownedFantInventoryPoolV7/);
});

test('GitHub Pages and offline shell files exist',()=>{
  for(const f of ['.nojekyll','manifest.webmanifest','version.json','sw.js','.github/workflows/pages.yml'])
    assert.ok(fs.existsSync(path.join(root,f)),`missing ${f}`);
});
