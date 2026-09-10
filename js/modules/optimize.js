export function init(app){
  const pairs=[
    ['cancelGearV7','gear'],['cancelTechV7','tech'],['cancelCharmV7','charm'],['cancelFullV7','full'],
    ['cancelRelicV7','relic'],['cancelFantV7','fant'],['cancelRosterV7','roster']
  ];
  for(const [id,key] of pairs){
    const b=document.getElementById(id);
    if(b&&!b.dataset.moduleWired){b.dataset.moduleWired='1';b.addEventListener('click',()=>app.cancel(key));}
  }
  const apply=document.getElementById('applyFantOptimizerV7');
  if(apply&&!apply.dataset.moduleWired){apply.dataset.moduleWired='1';apply.addEventListener('click',()=>app.applyFantomon?.());}
}
