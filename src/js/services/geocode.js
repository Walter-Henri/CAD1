/** Geocodificação Nominatim — Mutirão */
(function(M){
'use strict';
async function reverseGeocode(lat,lng){
  try{
    const r=await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt-BR&zoom=17`,
      {headers:{'User-Agent':'Mutirao-Recife/1.0'}}
    );
    if(!r.ok)return null;
    const d=await r.json();
    if(!d.address)return null;
    const a=d.address;
    const road=[a.road||a.pedestrian||a.path,a.house_number].filter(Boolean).join(', ');
    return road||a.suburb||a.neighbourhood||a.city_district||'';
  }catch(e){return null;}
}
async function geocodeSearch(q){
  try{
    const r=await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q+', Recife')}&format=json&limit=5&accept-language=pt-BR&countrycodes=br`,
      {headers:{'User-Agent':'Mutirao-Recife/1.0'}}
    );
    if(!r.ok)return[];
    return await r.json();
  }catch(e){return[];}
}
M.reverseGeocode=reverseGeocode;
M.geocodeSearch=geocodeSearch;
})(window.Mutirao=window.Mutirao||{});
