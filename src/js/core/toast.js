/** Toasts — auto-dismiss com token de geração e fallback sem animationend */
(function(M){
'use strict';
const {$,esc,icon}=M;
let toastT=null, toastHideT=null, toastGen=0;
const TOAST_MS=3100;
const TOAST_OUT_MS=220;

function toast(msg,ic){
  let t=$('#toast');
  if(!t){
    t=document.createElement('div');
    t.id='toast';
    t.className='toast';
    t.setAttribute('role','status');
    document.body.appendChild(t);
  }
  const gen=++toastGen;
  clearTimeout(toastT);
  clearTimeout(toastHideT);
  t.classList.remove('toast-out');
  t.hidden=true;
  void t.offsetWidth;
  t.innerHTML=(ic?icon(ic,'sm'):'')+esc(msg);
  t.hidden=false;
  toastT=setTimeout(()=>{
    if(gen!==toastGen)return;
    t.classList.add('toast-out');
    const finish=()=>{
      if(gen!==toastGen)return;
      t.hidden=true;
      t.classList.remove('toast-out');
    };
    // Fallback obrigatório: sob prefers-reduced-motion o animationend nunca dispara
    toastHideT=setTimeout(finish,TOAST_OUT_MS);
    const onEnd=e=>{
      if(e.target!==t)return;
      clearTimeout(toastHideT);
      t.removeEventListener('animationend',onEnd);
      finish();
    };
    t.addEventListener('animationend',onEnd);
  },TOAST_MS);
}
M.toast=toast;
})(window.Mutirao=window.Mutirao||{});
