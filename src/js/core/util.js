/** Utilitários DOM e texto — Mutirão */
(function(M){
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(n,cls)=>`<svg class="ic ${cls||''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const hash=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
const DAY=864e5;
const NOW=Date.now();
const isDesk=()=>window.matchMedia('(min-width:960px)').matches;
function tempo(d){
  if(d<1)return 'hoje';
  if(d===1)return '1 dia';
  if(d<30)return d+' dias';
  if(d<365){const m=Math.round(d/30);return m<=1?'1 mês':m+' meses'}
  const y=d/365;return y<1.5?'1 ano':(Math.round(y*10)/10).toString().replace('.',',')+' anos';
}
const fmt=t=>new Date(t).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit'});
Object.assign(M,{$:$,esc,icon,norm,hash,DAY,NOW,isDesk,tempo,fmt});
})(window.Mutirao=window.Mutirao||{});
