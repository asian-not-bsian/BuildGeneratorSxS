export function init(app){const b=document.getElementById('cancelChaosV7');if(b&&!b.dataset.moduleWired){b.dataset.moduleWired='1';b.addEventListener('click',()=>app.cancel('chaos'))}}
