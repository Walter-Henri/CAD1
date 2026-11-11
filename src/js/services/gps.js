/** GPS nativo — Mutirão */
(function(M){
'use strict';
function getGPS(cb){
  if(!navigator.geolocation)return cb(null,'GPS não suportado neste dispositivo.');
  const btn=document.querySelector('#pickGpsBtn');
  if(btn){btn.classList.add('gps-spin');btn.disabled=true;}
  navigator.geolocation.getCurrentPosition(
    p=>{
      if(btn){btn.classList.remove('gps-spin');btn.disabled=false;}
      cb({lat:p.coords.latitude,lng:p.coords.longitude,acc:Math.round(p.coords.accuracy)});
    },
    e=>{
      if(btn){btn.classList.remove('gps-spin');btn.disabled=false;}
      const m={1:'Permissão negada. Habilite o GPS.',2:'Localização indisponível.',3:'Tempo esgotado.'};
      cb(null,m[e.code]||'Erro de GPS.');
    },
    {enableHighAccuracy:true,timeout:12000,maximumAge:60000}
  );
}
M.getGPS=getGPS;
})(window.Mutirao=window.Mutirao||{});
