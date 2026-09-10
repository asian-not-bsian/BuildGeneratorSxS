export function init(app,tab){
  // OCR itself remains on-demand in the compatibility core so Tesseract is never loaded at startup.
  if(tab==='pvp'){
    const cancel=document.getElementById('cancelPvpV7');
    if(cancel&&!cancel.dataset.moduleWired){cancel.dataset.moduleWired='1';cancel.addEventListener('click',()=>app.cancel('pvp'));}
  }
}
