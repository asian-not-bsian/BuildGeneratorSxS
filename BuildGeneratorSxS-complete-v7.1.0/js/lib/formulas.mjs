export const CLASS_PARENT={Warrior:null,Knight:'Warrior',Paladin:'Knight',Guardian:'Paladin',Templar:'Guardian',Justicar:'Templar',Vindicator:'Justicar',Duelist:'Warrior',Berserker:'Duelist',Conqueror:'Berserker',Ravager:'Conqueror',Marauder:'Ravager',Doomreaver:'Marauder',Mage:null,Sorcerer:'Mage',Archmage:'Sorcerer',Destroyer:'Archmage',Magister:'Destroyer',Arcanarch:'Magister',Thaumaturge:'Arcanarch',Sage:'Mage',Arcanist:'Sage',Dominator:'Arcanist',Prophet:'Dominator',Hierarch:'Prophet',Demiurge:'Hierarch'};
export function classLineage(cls){const out=[];let c=cls,guard=0;while(c&&guard++<20){out.push(c);c=CLASS_PARENT[c]||null}return out}
export function legalSkill(owner,current){return classLineage(current).includes(owner)}
export function seasonForLevel(level){const map={100:1,130:2,160:3,190:4,220:5,250:6};return map[+level]||0}
export function seasonEligible(itemSeason,currentSeason){return +itemSeason>0&&+itemSeason===+currentSeason}
export function actionCount(spd,enemySpd,turns=15,scale=1,enemyScale=1){return Math.floor(turns*Math.sqrt(Math.max(1,spd)*scale/(Math.max(1,enemySpd)*enemyScale))+1e-10)}
export function nextSpeedBreakpoint(spd,enemySpd,turns=15,scale=1,enemyScale=1){const actions=actionCount(spd,enemySpd,turns,scale,enemyScale),k=enemySpd*enemyScale/scale;return k*Math.pow((actions+1)/turns,2)}
export function critChance(base=0.05,critPct=0,enemyCritResPct=0){return Math.max(0,Math.min(1,base+critPct/100-enemyCritResPct/100))}
export function relicSlotsValid(byAffinity,affinities=['Fire','Water','Wind','Light','Dark']){return affinities.every(a=>Array.isArray(byAffinity?.[a])&&byAffinity[a].length<=4)}
export function base64urlEncode(obj){return Buffer.from(JSON.stringify(obj),'utf8').toString('base64url')}
export function base64urlDecode(s){return JSON.parse(Buffer.from(s,'base64url').toString('utf8'))}
