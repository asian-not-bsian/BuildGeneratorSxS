const REMOVED_TABS=new Set(['acquisition','droprates','datahealth']);
const FANTOMONS_V71=[
 {id:1600,name:'Falko',adult:true},{id:1601,name:'Boaro',adult:true},{id:1602,name:'Mandragora',adult:true},{id:1603,name:'Zeioletus',adult:true},
 {id:1604,name:'Terragon',adult:true},{id:1605,name:'Sylvaerie',adult:true},{id:1606,name:'Kels',adult:true},{id:1607,name:'Armopi',adult:true},
 {id:1608,name:'Herbote',adult:true},{id:1609,name:'Nyxarchon',adult:true},{id:1610,name:'Aegiswing',adult:true},{id:1611,name:'Pandarial',adult:true},
 {id:1612,name:'Chomusuke',adult:false},{id:1613,name:'Cabbage Dog',adult:true},{id:1614,name:'Prismora',adult:true},{id:1615,name:'Luminarch Steed',adult:true}
];

function byId(id){return document.getElementById(id)}
function fire(el,type='change'){if(el)el.dispatchEvent(new Event(type,{bubbles:true}))}
function rankNumber(dm,value){const s=String(value||'').trim();if(/^\d+$/.test(s))return Math.max(1,Math.min(34,+s));for(const [n,label] of Object.entries(dm?.rankLabels||{}))if(String(label).toLowerCase()===s.toLowerCase())return +n;return 22}
function techniqueCoef(item,row){const vals=['SkillAttack1','SkillAttack2','SkillAttack3','SkillAttack4'].map(k=>row?.[k]).filter(v=>Number.isFinite(+v)).map(Number);if(!vals.length)return null;if(vals.length===1)return vals[0]*Math.max(1,+item?.hits||1);return vals.reduce((a,b)=>a+b,0)}
function screenshotCatalog(app,scope){
 const className=scope==='pvpEnemy'?String(byId('pvpEnemyClass')?.value||''):String(byId('myClass')?.value||'');
 return {className,skills:app?.DM?.skills||[],fantomons:FANTOMONS_V71,relics:Array.isArray(app?.extras?.relicCatalog)?app.extras.relicCatalog:[],gear:[...(app?.DM?.gear||[]),...(Array.isArray(app?.extras?.inventory)?app.extras.inventory:[])]};
}
function applyTechnique(app,scope,item,slot){
 const p=scope==='my'?'sk':'pesk',i=Math.max(0,Math.min(3,+slot||0)),name=byId(`${p}Name${i}`);if(!name)return false;
 const rank=byId(`${p}Rank${i}`),level=byId(`${p}Level${i}`),r=rankNumber(app?.DM,rank?.value),row=item?.vals?.[String(r)]||{},coef=techniqueCoef(item,row);
 name.value=item.name||'';if(rank&&!rank.value)rank.value=app?.DM?.rankLabels?.[String(r)]||String(r);if(level&&!level.value)level.value=scope==='my'?(byId('myLevel')?.value||100):(byId('pvpEnemyLevel')?.value||100);
 const element=byId(`${p}Element${i}`),coefEl=byId(`${p}Coef${i}`),hits=byId(`${p}Hits${i}`),cd=byId(`${p}Cd${i}`),ready=byId(`${p}Ready${i}`),badge=byId(`${p}Badge${i}`),meta=byId(`${p}Meta${i}`),on=byId(`${p}On${i}`);
 if(element)element.value=item.element||'Physical';if(coefEl&&coef!=null)coefEl.value=coef;if(hits)hits.value=Math.max(1,+item.hits||1);if(cd&&Number.isFinite(+row.CD))cd.value=+row.CD;if(ready)ready.checked=!(+row.CD>0);if(on)on.checked=!!item.name;
 if(badge){badge.textContent='Datamine';badge.className='source-badge exact'}if(meta)meta.textContent=`${item.cls||''}${item.id?` · #${item.id}`:''}`.replace(/^ · /,'');fire(name);return true;
}
function applyCharm(app,scope,item,slot){
 const p=scope==='my'?'ch':'pech',i=Math.max(0,Math.min(3,+slot||0)),name=byId(`${p}Name${i}`);if(!name)return false;
 name.value=item.name||'';const rank=byId(`${p}Rank${i}`),level=byId(`${p}Level${i}`),meta=byId(`${p}Meta${i}`);if(rank&&!rank.value)rank.value=app?.DM?.rankLabels?.['22']||'Divine +6';if(level&&!level.value)level.value=scope==='my'?(byId('myLevel')?.value||100):(byId('pvpEnemyLevel')?.value||100);if(meta)meta.textContent=`${item.cls||''}${item.id?` · #${item.id}`:''}`.replace(/^ · /,'');fire(name);return true;
}
function applyFantomon(scope,item){
 const p=scope==='my'?'myFantomon':'pvpEnemyFantomon',name=byId(`${p}Name`);if(!name)return false;name.value=item.name||'';const enabled=byId(`${p}Enabled`),level=byId(`${p}Level`),phase=byId(`${p}Phase`),rank=byId(`${p}Rank`),meta=byId(`${p}Meta`);if(enabled)enabled.checked=!!item.name;if(level&&!level.value)level.value=scope==='my'?(byId('myLevel')?.value||100):(byId('pvpEnemyLevel')?.value||100);if(phase&&!phase.value)phase.value=item.adult===false?'Baby':'Adult';if(rank&&!rank.value)rank.value='Mythic';if(meta)meta.textContent=item.id?`#${item.id}`:'';fire(name);return true;
}
function installScreenshotApi(app){
 if(!app)return;app.version='7.1';app.screenshotCatalog=scope=>screenshotCatalog(app,scope);app.applyScreenshotImageMatch=(scope,kind,item,slot=0)=>kind==='Technique'?applyTechnique(app,scope,item,slot):kind==='Charm'?applyCharm(app,scope,item,slot):kind==='Fantomon'?applyFantomon(scope,item):false;
}
function removeClosestFeature(el,keywords){
 if(!el)return;let n=el;while(n&&n!==document.body){const head=n.querySelector?.('.section-head,h2,h3,.eyebrow');const txt=(head?.textContent||n.firstElementChild?.textContent||'').trim();if(n.id==='tab-progression')break;if(keywords.some(k=>txt.toLowerCase().includes(k))&&(n.matches('article,.card,.section-block,.progression-section,.v4-section,section')||n.parentElement?.id==='tab-progression')){n.remove();return}n=n.parentElement}
 const card=el.closest('article,.card');if(card)card.remove();
}
function detailsWrap(root,nodes,summary){const live=nodes.filter(Boolean).filter(n=>n.isConnected);if(!root||!live.length)return;const d=document.createElement('details');d.className='technical-details-v71';const s=document.createElement('summary');s.textContent=summary;d.appendChild(s);live[0].before(d);live.forEach(n=>d.appendChild(n));}
function hideLabel(id){const el=byId(id);el?.closest('label')?.classList.add('v71-hidden-advanced')}
function simplifyUserPages(){
 document.title=document.title.replace(/v7\.0/g,'v7.1');document.querySelectorAll('h1').forEach(h=>{h.innerHTML=h.innerHTML.replace(/v7\.0/g,'v7.1')});
 for(const tab of REMOVED_TABS){document.querySelectorAll(`[data-tab="${tab}"]`).forEach(x=>x.remove());byId(`tab-${tab}`)?.remove()}
 const sourceBtn=document.querySelector('[data-tab="source"]');if(sourceBtn&&/Data\s*&\s*Sync/i.test(sourceBtn.textContent))sourceBtn.textContent='Backup & Data';
 document.querySelectorAll('#tab-source h2,#tab-source h1').forEach(h=>{if(/Data\s*&\s*Sync/i.test(h.textContent))h.textContent='Backup & Data'});
 removeClosestFeature(byId('farmGearV4'),['farming','gear farming','reroll']);
 document.querySelectorAll('#tab-reference article.card').forEach(card=>{if(/drop\s*\/\s*reroll probability/i.test(card.textContent))card.remove()});
 const coverage=byId('referenceCoverageV5');const cleanCoverage=()=>coverage?.querySelectorAll('.coverage-row').forEach(r=>{if(/drop rate/i.test(r.textContent))r.remove()});cleanCoverage();if(coverage)new MutationObserver(cleanCoverage).observe(coverage,{childList:true,subtree:true});
 ['fullBeamWidth','fullFinalSims','fullGearCapV7','relicLabBeamV59','relicLabCandidatesV59','accountBeam','accountCandidateCap','accountPvpRuns'].forEach(hideLabel);
 const chaosIds=['chaosTurnsV7','chaosLoadoutCapV7','chaosBeamV7','chaosUseTimelineV7'];const chaosNodes=[...new Set(chaosIds.map(id=>byId(id)?.closest('label')).filter(Boolean))];const chaosRoot=byId('tab-chaosrealm');if(chaosRoot&&chaosNodes.length)detailsWrap(chaosRoot,chaosNodes,'Advanced optimizer settings');
 const team=byId('tab-team');if(team){const cards=[...team.querySelectorAll('article.card')].filter(c=>/EC MECHANICS|TARGETING SOURCE|target trace|BattleAISetting|AI priority/i.test(c.textContent));detailsWrap(team,cards,'Advanced targeting details')}
 const pvp=byId('tab-pvp');if(pvp){const cards=[...pvp.querySelectorAll('article.card')].filter(c=>/Unified engine:|server target-selection AI/i.test(c.textContent));detailsWrap(pvp,cards,'Advanced simulation notes')}
 document.querySelectorAll('#tab-build .relic-table th').forEach(th=>{if(/Exact contribution/i.test(th.textContent))th.textContent='Stat override'});
 document.querySelectorAll('#tab-build p.hint').forEach(p=>{if(/Exact contribution/i.test(p.textContent))p.textContent='Optional: enter a verified stat override for a Relic when the source does not provide an exact value.';else if(/Catalog metadata comes from/i.test(p.textContent))p.textContent='Relic details update from the public catalog when you use Refresh source data.'});
 document.querySelectorAll('#tab-fantlab .section-note').forEach(p=>{if(/System\*Percent|material-equivalent/i.test(p.textContent))p.textContent='Plan Fantomon tree upgrades within your material budget while respecting prerequisites.'});
 if(!document.querySelector('.tab-panel.active'))document.querySelector('[data-tab="build"]')?.click();
}
function preserveOpponentValues(){
 document.addEventListener('click',e=>{const btn=e.target.closest('#pvpScreenshotReviewV62 .ocr-apply-v7');if(!btn)return;const keep={charms:[0,1,2,3].map(i=>({rank:byId(`pechRank${i}`)?.value,level:byId(`pechLevel${i}`)?.value})),fant:{level:byId('pvpEnemyFantomonLevel')?.value,phase:byId('pvpEnemyFantomonPhase')?.value,rank:byId('pvpEnemyFantomonRank')?.value}};setTimeout(()=>{keep.charms.forEach((x,i)=>{if(byId(`pechRank${i}`)&&x.rank)byId(`pechRank${i}`).value=x.rank;if(byId(`pechLevel${i}`)&&x.level)byId(`pechLevel${i}`).value=x.level});if(keep.fant.level)byId('pvpEnemyFantomonLevel').value=keep.fant.level;if(keep.fant.phase)byId('pvpEnemyFantomonPhase').value=keep.fant.phase;if(keep.fant.rank)byId('pvpEnemyFantomonRank').value=keep.fant.rank},0)},true);
}
function injectStyles(){const s=document.createElement('style');s.textContent=`.v71-hidden-advanced{display:none!important}.technical-details-v71{margin-top:12px}.technical-details-v71>summary{cursor:pointer;font-weight:700}.technical-details-v71[open]>summary{margin-bottom:10px}`;document.head.appendChild(s)}
function install(){if(document.documentElement.dataset.v71Overrides)return;document.documentElement.dataset.v71Overrides='1';injectStyles();simplifyUserPages();preserveOpponentValues();installScreenshotApi(window.SXS_APP)}
function waitForApp(n=0){if(window.SXS_APP&&document.body)return install();if(n<60)setTimeout(()=>waitForApp(n+1),50)}
waitForApp();
