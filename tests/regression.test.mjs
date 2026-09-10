import test from 'node:test';
import assert from 'node:assert/strict';
import {classLineage,legalSkill,seasonForLevel,seasonEligible,actionCount,nextSpeedBreakpoint,critChance,relicSlotsValid,base64urlEncode,base64urlDecode} from '../js/lib/formulas.mjs';

test('Dominator inherits Mage, Sage and Arcanist only on its branch',()=>{
  assert.deepEqual(classLineage('Dominator'),['Dominator','Arcanist','Sage','Mage']);
  assert.equal(legalSkill('Mage','Dominator'),true);
  assert.equal(legalSkill('Sage','Dominator'),true);
  assert.equal(legalSkill('Arcanist','Dominator'),true);
  assert.equal(legalSkill('Sorcerer','Dominator'),false);
});

test('season-cap mapping and current-season eligibility',()=>{
  assert.equal(seasonForLevel(220),5);
  assert.equal(seasonForLevel(250),6);
  assert.equal(seasonEligible(5,6),false);
  assert.equal(seasonEligible(6,6),true);
});

test('15-turn speed breakpoint matches square-root clock',()=>{
  assert.equal(actionCount(100000,100000,15),15);
  const next=nextSpeedBreakpoint(100000,100000,15);
  assert.ok(Math.abs(next-113777.77777777778)<1e-6);
  assert.equal(actionCount(Math.ceil(next),100000,15),16);
});

test('crit chance is clamped',()=>{
  assert.equal(critChance(0.05,200,0),1);
  assert.equal(critChance(0.05,0,80),0);
});

test('relic loadout permits no more than four per affinity',()=>{
  const ok=Object.fromEntries(['Fire','Water','Wind','Light','Dark'].map(x=>[x,['a','b','c','d']]));
  assert.equal(relicSlotsValid(ok),true);
  ok.Fire.push('e');
  assert.equal(relicSlotsValid(ok),false);
});

test('share payload base64url round-trips',()=>{
  const x={v:7,season:6,relics:{Fire:['A']},skills:['X']};
  assert.deepEqual(base64urlDecode(base64urlEncode(x)),x);
});
