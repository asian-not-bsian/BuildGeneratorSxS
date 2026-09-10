export function init(app){
  app.renderTargetTrace();
  const e=document.getElementById('targetTraceEnabledV7');
  if(e&&!e.dataset.moduleWired){e.dataset.moduleWired='1';e.addEventListener('change',()=>app.renderTargetTrace());}
  const cancel=document.getElementById('cancelTeamV7');
  if(cancel&&!cancel.dataset.moduleWired){cancel.dataset.moduleWired='1';cancel.addEventListener('click',()=>app.cancel('team'));}
}
