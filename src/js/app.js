(function(){
let tileBase=null;
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(n,cls)=>`<svg class="ic ${cls||''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const norm=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const hash=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
const DAY=864e5, NOW=Date.now();
const isDesk=()=>window.matchMedia('(min-width:960px)').matches;

const CATS={
  alag:    {n:'Alagamento',    o:'Emlurb',                      color:'#2563EB'},
  barreira:{n:'Barreira',      o:'Defesa Civil',                color:'#DC2626'},
  buraco:  {n:'Buraco',        o:'Emlurb',                      color:'#D97706'},
  esgoto:  {n:'Esgoto e cano', o:'Compesa',                     color:'#7C3AED'},
  lixo:    {n:'Lixo e entulho',o:'Emlurb',                      color:'#059669'},
  obra:    {n:'Obra parada',   o:'Secretaria de Infraestrutura',color:'#EA580C'}
};
const STATUS={
  sem:{n:'Sem resposta'},
  paliativo:{n:'Paliativo, voltou'},
  associacao:{n:'Com a associação'},
  vereador:{n:'Com o vereador'},
  resolvido:{n:'Resolvido'}
};
const RPA={1:'Centro',2:'Norte',3:'Noroeste',4:'Oeste',5:'Sudoeste',6:'Sul'};
const MORRO=new Set(['Alto José do Pinho','Alto José Bonifácio','Alto Santa Terezinha','Alto do Mandu','Morro da Conceição','Vasco da Gama','Nova Descoberta','Córrego do Jenipapo','Brejo da Guabiraba','Brejo de Beberibe','Dois Unidos','Linha do Tiro','Passarinho','Bomba do Hemetério','Mangabeira','Macaxeira','Guabiraba','Ibura','Cohab - Ibura de Cima','Jordão','Água Fria','Fundão','Beberibe','Dois Irmãos','Sítio dos Pintos - São Brás']);

function shape(s,size){
  size=size||16;
  const a=`width="${size}" height="${size}" viewBox="0 0 16 16" class="shape" aria-hidden="true"`;
  switch(s){
    case 'sem': return `<svg ${a}><circle cx="8" cy="8" r="6.5" style="fill:var(--err);stroke:var(--surface)" stroke-width="1.6"/></svg>`;
    case 'paliativo': return `<svg ${a}><path d="M8 1.5L15 14.5H1z" fill="#FFD400" stroke="#0B0B0F" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
    case 'associacao': return `<svg ${a}><rect x="2" y="2" width="12" height="12" rx="1.5" style="fill:var(--primary);stroke:var(--surface)" stroke-width="1.6"/></svg>`;
    case 'vereador': return `<svg ${a}><path d="M8 1l7 7-7 7-7-7z" style="fill:var(--primary);stroke:var(--surface)" stroke-width="1.6"/></svg>`;
    default: return `<svg ${a}><circle cx="8" cy="8" r="7" style="fill:var(--ok)"/><path d="M4.5 8.2l2.3 2.3 4.7-4.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
}
const stChip=s=>`<span class="chip s-${s}">${shape(s,15)}${STATUS[s].n}</span>`;
const catChip=c=>`<span class="chip cat">${icon(c,'sm')}${CATS[c].n}</span>`;

/* ---------- estado ---------- */
const KEY='mutirao.v1';
let saved={};
try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){saved={}}
const S={
  user:saved.user||null, mine:saved.mine||[], supported:new Set(saved.supported||[]),
  notes:saved.notes||{}, photos:saved.photos||{}, votes:saved.votes||{}, morro:saved.morro!==false,
  filt:{cats:new Set(Object.keys(CATS)),st:new Set(Object.keys(STATUS))},
  view:'mapa', sel:null, area:'all', rankMode:'apoios', pending:null, draft:null, lastAdded:null, create:false
};
function save(){
  const base={user:S.user,mine:S.mine,supported:[...S.supported],notes:S.notes,votes:S.votes,morro:S.morro};
  try{localStorage.setItem(KEY,JSON.stringify({...base,photos:S.photos}))}
  catch(e){try{localStorage.setItem(KEY,JSON.stringify(base))}catch(e2){}}
}
const seedPts=SEED.map(p=>Object.assign({},p,{seed:true}));
const all=()=>seedPts.concat(S.mine);
const byId=id=>all().find(p=>p.id===id);
const daysOf=p=>p.seed?p.d:Math.max(0,Math.floor((NOW-p.created)/DAY));
const apoios=p=>p.seed?p.a+(S.supported.has(p.id)?1:0):p.a;
const shown=()=>all().filter(p=>S.filt.cats.has(p.c)&&S.filt.st.has(p.s));

function tempo(d){
  if(d<1)return 'hoje';
  if(d===1)return '1 dia';
  if(d<30)return d+' dias';
  if(d<365){const m=Math.round(d/30);return m<=1?'1 mês':m+' meses'}
  const y=d/365;return y<1.5?'1 ano':(Math.round(y*10)/10).toString().replace('.',',')+' anos';
}
const fmt=t=>new Date(t).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit'});

function timeline(p){
  const d=daysOf(p), reg=NOW-d*DAY, org=CATS[p.c].o, at=f=>reg+Math.round(d*f)*DAY;
  const ev=[{t:reg,x:'Marcado no mapa por um morador'}];
  if(apoios(p)>=10&&d>2)ev.push({t:at(.08),x:'10 vizinhos apoiaram'});
  if(p.s==='paliativo'){ev.push({t:at(.3),x:`Paliativo: ${org} esteve no local`,c:'pal'});ev.push({t:at(.55),x:'O problema voltou',c:'bad'});ev.push({t:NOW,x:`Esperando solução de verdade há ${tempo(Math.round(d*.45))}`,c:'now'})}
  else if(p.s==='associacao'){ev.push({t:at(.6),x:'A associação de moradores recebeu'});ev.push({t:NOW,x:'Está na votação do mês da associação',c:'now'})}
  else if(p.s==='vereador'){ev.push({t:at(.4),x:'A associação de moradores recebeu'});ev.push({t:at(.6),x:'A associação levou ao vereador da região'});ev.push({t:NOW,x:`Esperando resposta há ${tempo(Math.round(d*.4))}`,c:'now'})}
  else if(p.s==='resolvido'){ev.push({t:at(.4),x:'A associação levou ao vereador da região'});ev.push({t:at(.85),x:`${org} fez a obra`});ev.push({t:at(.95),x:'Moradores confirmaram que resolveu'})}
  else ev.push({t:NOW,x:`Sem resposta do poder público há ${tempo(d)}`,c:'bad'});
  return ev;
}
const NOTES={
  barreira:['Quando chove forte a gente dorme com medo.','A lona que colocaram já rasgou.','Já desceu terra no quintal da vizinha.','A Defesa Civil veio, olhou e foi embora.'],
  alag:['A água entra na sala quando a maré enche.','Perdi geladeira e sofá na última chuva.','Limparam uma vez e entupiu de novo.','As crianças não vão pra escola quando alaga.'],
  buraco:['Moto já caiu aí duas vezes.','Taparam com barro e abriu de novo.','O ônibus não sobe mais por causa do buraco.','De noite não dá pra ver, é perigoso.'],
  esgoto:['O cheiro não deixa abrir a janela.','Vieram, mexeram e voltou a vazar.','Tem criança brincando perto dessa água.','Já liguei pro 0800 três vezes.'],
  lixo:['O carro do lixo não passa aqui.','Quando chove o lixo desce e entope tudo.','Tem rato saindo de noite.','A gente limpou no mutirão, mas voltou.'],
  obra:['Começaram a obra e sumiram.','Disseram que voltava em 30 dias. Já faz meses.','O material ficou largado na rua.','Ninguém sabe quem é o responsável.']
};
const WHO=['Morador(a) da rua','Vizinha da frente','Morador há 20 anos','Associação de moradores'];
function notesOf(p){
  const out=[];
  if(p.seed){const h=hash(p.id),pool=NOTES[p.c];for(let k=0;k<2;k++)out.push({who:WHO[(h+k)%WHO.length],x:pool[(h+k*3)%pool.length],t:NOW-Math.max(1,Math.round(p.d*(k?.2:.6)))*DAY})}
  else if(p.desc)out.push({who:'Você',x:p.desc,t:p.created});
  return out.concat((S.notes[p.id]||[]).map(n=>({who:'Você',x:n.x,t:n.t})));
}
function photosOf(p){
  const out=[];
  if(p.seed){const h=hash(p.id),n=1+h%3;for(let k=0;k<n;k++)out.push({svg:illus(p.c,(h>>3)+k),cap:'Foto de morador · exemplo'})}
  (p.photos||[]).forEach(u=>out.push({img:u,cap:'Sua foto'}));
  (S.photos[p.id]||[]).forEach(u=>out.push({img:u,cap:'Sua foto'}));
  return out;
}

/* ---------- ilustrações (fotos de exemplo) ---------- */
function illus(c,v){
  const skies=['#BFD8EC','#CBD2DB','#F3C9A5','#AFCFE8'], sky=skies[v%4];
  const hs=[['#F2C14E','#E07A5F','#81B29A','#F4F1DE','#9DB4C0'],['#E9D8A6','#94D2BD','#EE9B00','#CA6702','#F7F3E3'],['#F4A261','#2A9D8F','#E9C46A','#F1FAEE','#A8DADC']][v%3];
  const house=(x,y,w,h,col,r)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/><path d="M${x-3} ${y}L${x+w/2} ${y-r}L${x+w+3} ${y}z" fill="#8C4A36"/><rect x="${x+w*.18}" y="${y+h*.25}" width="${w*.22}" height="${h*.22}" fill="#3D5A80"/><rect x="${x+w*.58}" y="${y+h*.45}" width="${w*.22}" height="${h*.55}" fill="#5B4636"/>`;
  let g=`<rect width="320" height="200" fill="${sky}"/>`;
  if(c==='barreira'){
    g+=`<path d="M0 200V70c40-10 70-30 110-26 40 4 70 30 110 50s60 30 100 40v66z" fill="#A0673B"/>`;
    g+=house(20,40,34,26,hs[0],14)+house(64,30,30,24,hs[1],12)+house(104,36,32,24,hs[3],12);
    g+=`<path d="M130 70l60 30 20 60-70 10-30-40z" fill="#2B6CB0" opacity=".9"/><path d="M160 90l-8 22 10 14-6 20" stroke="#3A2414" stroke-width="3" fill="none"/>`;
    g+=`<circle cx="230" cy="178" r="10" fill="#7A5230"/><circle cx="252" cy="184" r="7" fill="#6B4528"/><rect y="186" width="320" height="14" fill="#8E8E8E"/>`;
  }else if(c==='alag'){
    g+=house(10,70,60,60,hs[0],18)+house(80,62,54,68,hs[1],18)+house(146,72,60,58,hs[2],18)+house(218,66,56,64,hs[4],18)+house(284,74,40,56,hs[3],14);
    g+=`<rect y="118" width="320" height="82" fill="#5B7FA6" opacity=".93"/>`;
    for(let k=0;k<5;k++)g+=`<path d="M${-10+k*15} ${132+k*13}q20-6 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0" stroke="#9FC0E0" stroke-width="2.5" fill="none" opacity=".8"/>`;
    g+=`<rect x="150" y="150" width="26" height="16" rx="3" fill="#E63946" opacity=".85"/>`;
  }else if(c==='buraco'){
    g+=house(0,40,70,70,hs[1],20)+house(250,44,70,66,hs[2],20);
    g+=`<path d="M70 110h180l70 90H0z" fill="#6E6E6E"/><path d="M158 112v10M160 132v14M162 158v20" stroke="#E9E9E9" stroke-width="4"/>`;
    g+=`<ellipse cx="190" cy="160" rx="62" ry="22" fill="#2E2A26"/><ellipse cx="192" cy="164" rx="44" ry="13" fill="#5E7E95" opacity=".8"/>`;
    g+=`<path d="M96 186l10-36h8l10 36z" fill="#F77F00"/><rect x="100" y="164" width="20" height="5" fill="#fff"/>`;
  }else if(c==='esgoto'){
    g+=`<rect y="30" width="320" height="110" fill="${hs[3]}"/><rect y="30" width="320" height="110" fill="#000" opacity=".06"/><rect x="40" y="60" width="50" height="40" fill="#3D5A80"/><rect x="200" y="50" width="60" height="90" fill="#5B4636"/>`;
    g+=`<rect y="140" width="320" height="60" fill="#7A7A7A"/><rect x="0" y="122" width="150" height="16" rx="5" fill="#9AA5AE"/><rect x="146" y="118" width="14" height="24" rx="3" fill="#7D8790"/>`;
    g+=`<path d="M160 126c20-10 40-6 54 8M160 130c24 0 40 10 50 28M160 132c14 10 20 24 22 40" stroke="#A7C5D9" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    g+=`<ellipse cx="200" cy="180" rx="90" ry="14" fill="#5D5A3C" opacity=".85"/>`;
  }else if(c==='lixo'){
    g+=`<rect y="40" width="320" height="110" fill="${hs[4]}"/><path d="M20 70h80M30 90h50" stroke="#fff" stroke-width="5" opacity=".5"/>`;
    g+=`<rect y="150" width="320" height="50" fill="#8A8A8A"/>`;
    const bags=[[90,150,26,'#222'],[124,146,30,'#333'],[160,152,24,'#2B2B2B'],[110,124,22,'#3A3A3A'],[146,122,20,'#1F1F1F'],[196,156,20,'#4A4A4A']];
    bags.forEach(b=>g+=`<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="${b[3]}"/>`);
    g+=`<circle cx="236" cy="168" r="18" fill="none" stroke="#111" stroke-width="9"/><rect x="60" y="160" width="30" height="20" fill="#C9A66B"/>`;
  }else{
    g+=house(220,60,80,70,hs[0],20);
    g+=`<rect y="130" width="320" height="70" fill="#B9A58B"/>`;
    for(let r=0;r<5;r++)for(let k=0;k<(5-r);k++)g+=`<rect x="${20+k*30+(r%2)*15}" y="${112-r*14}" width="28" height="12" fill="#B5543A" stroke="#7E3524" stroke-width="1"/>`;
    g+=`<path d="M0 150l320-20" stroke="#FFD400" stroke-width="10"/><path d="M0 150l320-20" stroke="#0B0B0F" stroke-width="10" stroke-dasharray="14 14"/>`;
    g+=`<path d="M190 200l40-50 40 50z" fill="#D8C08A"/>`;
  }
  return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Foto de exemplo: ${esc(CATS[c].n)}">${g}</svg>`;
}

/* ---------- mapa ---------- */
const map=L.map('map',{zoomControl:false,minZoom:11,maxZoom:18,zoomSnap:1,attributionControl:true});
L.control.zoom({position:'bottomright',zoomInTitle:'Aproximar',zoomOutTitle:'Afastar'}).addTo(map);
map.attributionControl.setPrefix(false);
map.attributionControl.addAttribution('Limites: ESIG/PCR · Riscos: Sedec/PCR');;
setBaseTile(isDark());
L.geoJSON(VIZINHOS,{interactive:false,style:()=>({className:'v-poly'})}).addTo(map);
const bByName={};
const bLayer=L.geoJSON(BAIRROS,{
  style:f=>({className:'b-poly rpa-'+(f.properties.r||0)+(MORRO.has(f.properties.n)?' morro':'')}),
  onEachFeature:(f,l)=>{bByName[f.properties.n]=l;l.bindTooltip(f.properties.n+(MORRO.has(f.properties.n)?' · morros e encostas':''),{sticky:true,direction:'top',className:'btip'})}
}).addTo(map);
BAIRROS.features.forEach(f=>{const c=f.properties.c;L.marker([c[0],c[1]],{interactive:false,keyboard:false,icon:L.divIcon({className:'blabel',html:esc(f.properties.n),iconSize:[120,14],iconAnchor:[60,7]})}).addTo(map)});

/* ── camada de riscos oficiais (Defesa Civil / Prefeitura do Recife) ── */
let riskLayer=null,riskVisible=false;
function riskIcon(f){
  const t=f.properties.tipo,cl=f.properties.classificacao;
  const tc=t==='deslizamento'?'rk-desliz':t==='inundacao'?'rk-inund':'rk-risco';
  const cc=cl==='mAlto'?'rk-malto':cl==='medio'?'rk-medio':'rk-alto';
  return L.divIcon({className:'rk-mk '+tc+' '+cc,html:'<div class="rk-dot"></div>',iconSize:[16,16],iconAnchor:[8,8]});
}
function buildRiskLayer(){
  if(riskLayer)return;
  riskLayer=L.geoJSON(RISCOS,{
    pointToLayer:(f,ll)=>L.marker(ll,{icon:riskIcon(f),alt:f.properties.titulo,title:f.properties.titulo}),
    onEachFeature:(f,l)=>{
      const p=f.properties;
      const tL={deslizamento:'Deslizamento',inundacao:'Alagamento',risco:'Área de risco'}[p.tipo]||'Risco';
      const cL={mAlto:'Muito alto',alto:'Alto',medio:'Médio',nd:'N/D'}[p.classificacao]||p.classificacao;
      const aprox=p.posicao_aproximada?'<p class="rk-aprox">Posição aproximada</p>':'';
      l.bindPopup('<div class="rk-popup"><b>'+esc(p.titulo)+'</b><span class="rk-tag rk-t-'+p.tipo+'">'+tL+' · '+cL+'</span>'+aprox+'<p class="rk-desc">'+esc(p.descricao)+'</p><small>'+esc(p.local||'')+'</small></div>',
        {maxWidth:280,className:'rk-pop-wrap'});
    }
  });
}
function toggleRiskLayer(){
  buildRiskLayer();
  riskVisible=!riskVisible;
  if(riskVisible){riskLayer.addTo(map);toast('Riscos oficiais: '+RISCOS.features.length+' pontos','alert');}
  else{map.removeLayer(riskLayer);toast('Camada de riscos desativada','layers');}
  const btn=$('#riskToggle');
  if(btn){btn.setAttribute('aria-pressed',String(riskVisible));btn.classList.toggle('rk-on',riskVisible);}
}

const recB=bLayer.getBounds();
map.setMaxBounds(recB.pad(.35));
const fitRecife=()=>{const d=isDesk(),lg=document.getElementById('legend');map.fitBounds(recB,{paddingTopLeft:[d&&lg&&lg.open?320:20,20],paddingBottomRight:[d?190:20,d?20:150]})};
fitRecife();
const mapEl=$('#map');
const zcls=()=>mapEl.classList.toggle('z-hi',map.getZoom()>=13);
map.on('zoomend',zcls);zcls();
document.body.classList.toggle('nomorro',!S.morro);

const cg=L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:52,disableClusteringAtZoom:15,
  iconCreateFunction:c=>{
    const n=c.getChildCount(),xl=n>=50,lg=n>=10,sz=xl?64:lg?54:44;
    return L.divIcon({html:`<div class="cl-ring"><span>${n}</span></div>`,
      className:'cl'+(xl?' cl-xl':lg?' cl-lg':''),iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]});
  }});
map.addLayer(cg);
const markers={};
function mkIcon(p,sel){
  const col=(CATS[p.c]||{}).color||'var(--primary)';
  const cls='mk'+(sel?' sel':'')+(p.s==='resolvido'?' res':'');
  return L.divIcon({className:cls,
    html:`<div class="pin" style="--pc:${col}">${icon(p.c)}<span class="st">${shape(p.s,18)}</span></div>`,
    iconSize:[44,54],iconAnchor:[22,54]});
}
function renderMarkers(){
  cg.clearLayers();for(const k in markers)delete markers[k];
  shown().forEach(p=>{
    const m=L.marker([p.lat,p.lng],{icon:mkIcon(p,p.id===S.sel),title:`${p.t} · ${p.b}`,alt:p.t,riseOnHover:true});
    m.on('click',()=>openDetail(p.id));
    if(p.id===S.lastAdded)m.on('add',()=>{const e=m.getElement();if(e){e.classList.add('new-pin');e.addEventListener('animationend',()=>e.classList.remove('new-pin'),{once:true});}});
    markers[p.id]=m;cg.addLayer(m);
  });
  const n=shown().length;$('#countSmall').textContent=n+' pontos';
}
function select(id){
  const prev=S.sel;S.sel=id;
  [prev,id].forEach(k=>{if(k&&markers[k]){const p=byId(k);markers[k].setIcon(mkIcon(p,k===id));if(k===id)markers[k].setZIndexOffset(1000);else markers[k].setZIndexOffset(0)}});
}
function focusPoint(p){
  const z=Math.max(map.getZoom(),15), ll=L.latLng(p.lat,p.lng);
  const mo=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const opts={animate:!mo,duration:0.5,easeLinearity:0.5};
  if(!isDesk()){const px=map.project(ll,z).add([0,map.getSize().y*.27]);map.flyTo(map.unproject(px,z),z,opts);}
  else map.flyTo(ll,z,opts);
}
function bairroAt(lat,lng){
  const inRing=(x,y,r)=>{let ins=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const xi=r[i][0],yi=r[i][1],xj=r[j][0],yj=r[j][1];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))ins=!ins}return ins};
  for(const f of BAIRROS.features){const g=f.geometry,polys=g.type==='Polygon'?[g.coordinates]:g.coordinates;
    for(const c of polys){if(inRing(lng,lat,c[0])&&!c.slice(1).some(h=>inRing(lng,lat,h)))return f.properties}}
  return null;
}

/* ---------- roteamento ---------- */
const panel=$('#panel');
const NAVOF={mapa:'mapa',detalhe:'mapa',pick:'mapa',adicionar:'mapa',sucesso:'mapa',ranking:'ranking',votacao:'votacao',conta:'conta'};
function go(v){
  closeMenu();closeSugg();
  if(v!=='detalhe'&&S.sel){select(null)}
  S.view=v;document.body.dataset.view=v;
  document.querySelectorAll('[data-go]').forEach(b=>{if(b.dataset.go===NAVOF[v])b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  const pick=v==='pick';
  $('#pickpin').hidden=!pick;$('#pickbar').hidden=!pick;$('#maptools').hidden=pick;$('#legend').hidden=pick;
  renderPanel();panel.scrollTop=0;
  const tok=v==='detalhe'?S.sel:(['ranking','votacao','conta'].includes(v)?v:'mapa');
  try{history.replaceState(null,'','#'+tok)}catch(e){}
  if(pick)updatePick();
  setTimeout(()=>map.invalidateSize(),0);
}
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.go==='conta'&&S.view==='conta')return;go(b.dataset.go)}));
$('#brand').addEventListener('click',()=>{go('mapa');fitRecife()});
map.on('moveend',()=>{if(S.view==='mapa'&&isDesk())renderPanel();if(S.view==='pick')updatePick();});
/* tile loading indicator */
let _tiles=0;
const ml=$('#mapLoader');
map.on('tileloadstart',()=>{_tiles++;if(ml)ml.hidden=false;});
map.on('tileload tileerror',()=>{if(--_tiles<=0){_tiles=0;if(ml)ml.hidden=true;}});
map.on('move',()=>{if(S.view==='pick')updatePick()});


/* ---------- tema claro/escuro ---------- */
function isDark(){
  const t=document.documentElement.dataset.theme;
  return t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);
}
function toggleTheme(){
  const next=isDark()?'light':'dark';
  document.documentElement.dataset.theme=next;
  try{localStorage.setItem('mutirao.theme',next)}catch(e){}
  const btn=$('#themeBtn');
  if(btn){
    const dark=isDark();
    btn.setAttribute('aria-label',dark?'Mudar para tema claro':'Mudar para tema escuro');
    btn.setAttribute('title',dark?'Tema claro':'Tema escuro');
    btn.innerHTML=icon(dark?'sun':'moon');
  }
  setBaseTile(isDark());
}

function renderTop(){
  const dark=isDark();
  const themeBtn=`<button class="btn-theme" id="themeBtn" aria-label="${dark?'Mudar para tema claro':'Mudar para tema escuro'}" title="${dark?'Tema claro':'Tema escuro'}">${dark?icon('sun'):icon('moon')}</button>`;
  $('#topright').innerHTML=themeBtn+(S.user
    ?`<button class="avatar" id="avBtn" aria-label="Sua conta, ${esc(S.user.name)}">${esc(S.user.name[0].toUpperCase())}</button>`
    :`<button class="btn-login" id="loginBtn">${icon('user','sm')}Entrar</button>`);
  const b=$('#avBtn')||$('#loginBtn');b.addEventListener('click',()=>go('conta'));
  $('#themeBtn').addEventListener('click',toggleTheme);
}

/* ---------- tile base CARTO ---------- */
function setBaseTile(dark){
  const cc='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
  const style=dark?'dark_nolabels':'voyager_nolabels';
  const key=(typeof ENV!=='undefined'&&ENV.cartoKey)?'?key='+ENV.cartoKey:'';
  const url='https://basemaps.cartocdn.com/rastertiles/'+style+'/{z}/{x}/{y}{r}.png'+key;
  if(tileBase){tileBase.setUrl(url);}
  else{tileBase=L.tileLayer(url,{maxZoom:19,attribution:cc});tileBase.addTo(map);tileBase.bringToBack();}
}

/* ---------- login obrigatório para agir ---------- */
function need(fn,why){
  if(S.user)return fn();
  S.pending=fn;
  modal(`<div class="mi">${icon('lock','lg')}</div>
    <h2 id="mt">Você precisa entrar para continuar</h2>
    <p class="sub2">Ver o mapa é livre. Para ${esc(why||'adicionar ponto, apoiar, enviar foto ou votar')}, entre com sua conta. Seu nome não aparece no mapa.</p>
    <div class="row"><button class="btn sec" data-close>Cancelar</button><button class="btn pri" id="gEnter">Entrar</button></div>`,
    m=>{m.querySelector('#gEnter').focus();m.querySelector('#gEnter').addEventListener('click',()=>{closeModal();go('conta')})},
    ()=>{S.pending=null});
}
let modalClose=null;
function modal(html,init,onCancel){
  const L2=$('#layer');L2.innerHTML=`<div class="scrim" id="scrim"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt">${html}</div></div>`;
  const sc=$('#scrim');modalClose=onCancel||null;
  sc.addEventListener('click',e=>{if(e.target===sc||e.target.closest('[data-close]')){closeModal(true)}});
  init&&init(sc);
}
function closeModal(cancel){const sc=$('#scrim');if(sc)sc.remove();if(cancel&&modalClose)modalClose();modalClose=null}
let toastT=null;
function toast(msg,ic){
  let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}
  t.classList.remove('toast-out');
  t.innerHTML=(ic?icon(ic,'sm'):'')+esc(msg);t.hidden=false;
  clearTimeout(toastT);
  toastT=setTimeout(()=>{
    t.classList.add('toast-out');
    t.addEventListener('animationend',()=>{t.hidden=true;t.classList.remove('toast-out');},{once:true});
  },3100);
}
function share(p){
  const txt=`${p.t} (${p.b}). ${apoios(p)} ${apoios(p)===1?'vizinho já apoia':'vizinhos já apoiam'} no Mutirão. Você também vê isso? Entre no Mutirão e apoie para a associação levar ao vereador.`;
  const fallback=()=>modal(`<h2 id="mt">Copie e mande no grupo</h2><textarea class="textarea" id="shTxt" readonly>${esc(txt)}</textarea><button class="btn pri" data-close>Pronto</button>`,m=>{const ta=m.querySelector('#shTxt');ta.focus();ta.select()});
  try{navigator.clipboard.writeText(txt).then(()=>toast('Texto copiado. Cole no grupo do WhatsApp.','check'),fallback)}catch(e){fallback()}
}

/* ---------- painel ---------- */
function listItem(p,extra){
  return `<button class="listbtn" data-open="${p.id}"><span class="cicon">${icon(p.c)}</span><span class="grow"><b>${esc(p.t)}</b>
    <span class="meta"><span>${icon('pin','sm')}${esc(p.b)}</span><span>${icon('users','sm')}${apoios(p)}</span><span>${icon('clock','sm')}${tempo(daysOf(p))}</span></span></span>${extra||shape(p.s,18)}</button>`;
}
function bindOpen(root){root.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openDetail(b.dataset.open)))}
function rankPos(p){const l=all().filter(x=>x.s!=='resolvido').sort((a,b)=>apoios(b)-apoios(a));return l.findIndex(x=>x.id===p.id)+1}


/* ---------- street view overlay ---------- */
function openSVLayer(lat,lng,title){
  const existing=$('#svLayer');if(existing){existing.remove();}
  const url='https://maps.google.com/maps?q=&layer=c&cbll='+lat+','+lng+'&output=embed&hl=pt';
  const el=document.createElement('div');
  el.id='svLayer';el.className='sv-layer';
  el.setAttribute('role','dialog');el.setAttribute('aria-label','Street View — '+title);
  el.innerHTML=`<div class="sv-bar"><span class="sv-title">${icon('ext','sm')}<b>Street View</b> · ${esc(title)}</span><button class="iconbtn sv-close" id="svClose" aria-label="Fechar Street View">${icon('close')}</button></div><div class="sv-wrap"><iframe class="sv-frame" src="${url}" allowfullscreen loading="lazy" title="Street View de ${esc(title)}"></iframe></div>`;
  document.getElementById('layer').appendChild(el);
  el.querySelector('#svClose').addEventListener('click',()=>el.remove());
  el.addEventListener('keydown',e=>{if(e.key==='Escape')el.remove();});
  el.querySelector('#svClose').focus();
}

/* ── transição de painel ── */
let _pTimer=null;
function transPanel(html){
  clearTimeout(_pTimer);
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){panel.innerHTML=html;bindPanel();return;}
  panel.classList.add('p-exit');
  _pTimer=setTimeout(()=>{
    panel.innerHTML=html;
    panel.classList.remove('p-exit');
    panel.classList.add('p-enter');
    panel.addEventListener('animationend',()=>panel.classList.remove('p-enter'),{once:true});
    bindPanel();
  },90);
}
function renderPanel(){
  const v=S.view;
  const html=v==='mapa'?vMapa():v==='detalhe'?vDetalhe():v==='ranking'?vRanking():v==='votacao'?vVotacao():v==='conta'?(S.user?vConta():vLogin()):v==='adicionar'?vAdicionar():v==='sucesso'?vSucesso():vMapa();
  transPanel(html);
}

function vMapa(){
  const pts=shown(), b=map.getBounds(), here=pts.filter(p=>b.contains([p.lat,p.lng])).sort((a,c)=>apoios(c)-apoios(a));
  const tot=all().reduce((s,p)=>s+apoios(p),0), sem=all().filter(p=>p.s==='sem'||p.s==='paliativo').length;
  const filtered=S.filt.cats.size<6||S.filt.st.size<5;
  return `<div class="pin-inner">
    <div class="ph"><span class="eyebrow">Recife · mapa dos moradores</span><h2>O que o bairro está vendo</h2>
      <p>Veja o que os vizinhos marcaram: obra que não veio, obra que não resolveu e paliativo. Ver é livre; para marcar, apoiar ou votar, entre na sua conta.</p></div>
    <div class="stats"><div><b>${all().length}</b><span>pontos</span></div><div><b>${tot}</b><span>apoios</span></div><div><b>${sem}</b><span>esperando solução</span></div></div>
    <button class="btn acc full" id="pAdd">${icon('plus')}Adicionar ponto</button>
    <div class="kv" style="justify-content:space-between"><h3 class="sec">Neste trecho do mapa (${here.length})</h3>
      <button class="btn ghost" id="pFilt">${icon('filter','sm')}${filtered?'Filtros ativos':'Filtrar'}</button></div>
    <div class="list">${here.slice(0,12).map(p=>listItem(p)).join('')||'<p class="note">Nenhum ponto neste trecho. Afaste o mapa ou limpe os filtros.</p>'}</div>
    ${here.length>12?`<p class="sub2">Mais ${here.length-12} pontos neste trecho. Aproxime o mapa para ver.</p>`:''}
    <p class="example">Pontos de exemplo para o protótipo</p>
    <p class="foot-note">Feito pela comunidade. Não é um site da prefeitura.</p></div>`;
}

function vDetalhe(){
  const p=byId(S.sel);if(!p)return vMapa();
  const n=apoios(p), sup=p.seed&&S.supported.has(p.id), mine=!p.seed, pos=rankPos(p), d=daysOf(p);
  const ph=photosOf(p), nt=notesOf(p), tl=timeline(p);
  return `<div class="pin-inner">
    <div class="dhead"><div style="flex:1;min-width:0;display:grid;gap:8px">
      <div class="kv">${catChip(p.c)}${stChip(p.s)}</div>
      <h2>${esc(p.t)}</h2>
      <p class="sub2">${esc(p.b)} · RPA ${p.r} ${RPA[p.r]} · marcado há ${tempo(d)}</p></div>
      <button class="iconbtn" id="dClose" aria-label="Fechar">${icon('close')}</button></div>
    <div>
      <div class="gallery-hd"><h3 class="sec" style="margin:0">${icon('camera','sm')}Fotos${ph.filter(x=>x.img).length?` <span class="badge-cnt">${ph.filter(x=>x.img).length}</span>`:''}</h3></div>
      <div class="gallery" aria-label="Fotos dos moradores">${ph.map(x=>`<figure class="ph-item" style="margin:0">${x.svg?`<div class="ph-ex">${x.svg}</div>`:`<img src="${x.img}" alt="Foto de morador" loading="lazy">`}<figcaption>${esc(x.cap)}</figcaption></figure>`).join('')}<button class="ph-add" id="dPhoto2">${icon('camera','lg')}Enviar foto</button></div></div>
    <div class="support"><span class="num">${n}</span><b>${n===1?'vizinho apoia':'vizinhos apoiam'}</b>
      <span class="sub2">${p.s==='resolvido'?'Resolvido':pos?`${pos}º no ranking do Recife`:''}${mine?' · você marcou este ponto':''}</span></div>
    ${p.s==='resolvido'?'':(mine?`<button class="btn done full" disabled>${icon('check')}Você marcou este ponto</button>`:
      sup?`<button class="btn done full" id="dSup">${icon('check')}Você apoia · tocar para retirar</button>`:
      `<button class="btn acc full" id="dSup">${icon('users')}Eu também vejo isso · Apoiar</button>`)}
    <div class="row">
      <button class="btn sec" id="dPhoto">${icon('camera')}Enviar foto</button>
      <button class="btn sec" id="dNote">${icon('note')}Adicionar nota</button>
      <button class="btn sec" id="dShare">${icon('share')}Compartilhar</button>
      <button class="btn sec" id="dStreetView">${icon('ext')}Street View</button></div>
    <form id="noteForm" class="field" hidden novalidate>
      <label for="noteTxt">Sua nota</label>
      <textarea class="textarea" id="noteTxt" maxlength="280" placeholder="Ex.: Hoje choveu e a água entrou de novo."></textarea>
      <span class="ferr">${icon('alert','sm')}Escreva alguma coisa antes de publicar.</span>
      <div class="row"><button type="button" class="btn ghost" id="noteCancel">Cancelar</button><button class="btn pri">Publicar nota</button></div></form>
    ${p.ref?`<p class="sub2">${icon('pin','sm')} Referência: ${esc(p.ref)} (visível só para a associação)</p>`:''}
    <section style="display:grid;gap:12px"><h3 class="sec">O que já aconteceu</h3>
      <ol class="tl">${tl.map(e=>`<li class="${e.c||''}"><time>${e.c==='now'||e.c==='bad'&&e.t===NOW?'agora':fmt(e.t)}</time>${esc(e.x)}</li>`).join('')}</ol></section>
    <div class="card" style="display:grid;gap:6px"><span class="eyebrow">Para onde vai</span>
      <p><b>Órgão responsável:</b> ${CATS[p.c].o}</p>
      <p class="sub2">Os 3 problemas mais apoiados de cada região entram na votação do mês. A associação de moradores leva os mais votados ao vereador.</p></div>
    <section style="display:grid;gap:10px"><h3 class="sec">Notas dos moradores (${nt.length})</h3>
      <div class="notes">${nt.map(x=>`<div class="nt"><small>${esc(x.who)} · ${x.t>=NOW-DAY?'hoje':'há '+tempo(Math.round((NOW-x.t)/DAY))}</small>${esc(x.x)}</div>`).join('')||'<p class="sub2">Ninguém escreveu ainda.</p>'}</div></section>
    ${p.seed?'<p class="example">Ponto de exemplo</p>':''}
  </div>`;
}

function areaSel(id){
  return `<div class="field"><label for="${id}">Região</label><select class="select" id="${id}">
    <option value="all"${S.area==='all'?' selected':''}>Todo o Recife</option>
    ${Object.keys(RPA).map(k=>`<option value="${k}"${S.area===k?' selected':''}>RPA ${k} · ${RPA[k]}</option>`).join('')}</select></div>`;
}
const inArea=p=>S.area==='all'||String(p.r)===S.area;
function vRanking(){
  const l=all().filter(p=>p.s!=='resolvido'&&inArea(p)).sort((a,b)=>S.rankMode==='apoios'?apoios(b)-apoios(a):daysOf(b)-daysOf(a)).slice(0,10);
  return `<div class="pin-inner">
    <div class="ph"><span class="eyebrow">Ranking</span><h2>O que mais pesa no bairro</h2>
      <p>Os 3 primeiros de cada região entram na votação do mês da associação.</p></div>
    ${areaSel('areaR')}
    <div class="seg" role="group" aria-label="Ordenar"><button aria-pressed="${S.rankMode==='apoios'}" data-rm="apoios">Mais apoiados</button><button aria-pressed="${S.rankMode==='tempo'}" data-rm="tempo">Mais tempo esperando</button></div>
    <ol class="list" style="list-style:none;margin:0;padding:0">${l.map((p,i)=>`<li class="rank${i<3&&S.rankMode==='apoios'?' top':''}"><span class="pos">${i+1}º</span>${listItem(p)}</li>`).join('')||'<li class="note">Nenhum problema aberto nesta região.</li>'}</ol>
    <div class="sticky-cta"><button class="btn acc full" id="toVote">${icon('vote')}Votar aqui</button></div>
  </div>`;
}
function voteOpts(){return all().filter(p=>inArea(p)&&(p.s==='sem'||p.s==='paliativo'||p.s==='associacao')).sort((a,b)=>apoios(b)-apoios(a)).slice(0,3)}
function vVotacao(){
  const opts=voteOpts(), mes=new Date().toLocaleDateString('pt-BR',{month:'long'}), voted=S.votes[S.area];
  let body;
  if(!opts.length)body='<p class="note">Ainda não há problemas suficientes nesta região para votar.</p>';
  else if(voted&&opts.some(o=>o.id===voted)){
    const vs=opts.map(o=>Math.round(apoios(o)*.55)+hash(o.id)%17+(o.id===voted?1:0)), tot=vs.reduce((a,b)=>a+b,0);
    body=`<div class="alert" style="border-color:var(--ok);background:var(--ok-bg)">${icon('check')}<div><b style="color:var(--ok)">Seu voto foi registrado.</b> Resultado parcial da região. A associação recebe o resultado no dia 1º.</div></div>
      <div class="card" style="display:grid;gap:14px">${opts.map((o,i)=>{const pc=Math.round(vs[i]*100/tot);return `<div class="res"><div class="top"><span>${esc(o.t)}${o.id===voted?' · seu voto':''}</span><span>${pc}%</span></div><span class="sub2">${esc(o.b)} · ${vs[i]} votos</span><div class="bar${o.id===voted?' me':''}"><i style="width:${pc}%"></i></div></div>`}).join('')}</div>
      <button class="btn ghost" id="reVote">Mudar meu voto</button>`;
  }else body=`<form id="voteForm" novalidate style="display:grid;gap:12px"><fieldset style="border:0;padding:0;margin:0;display:grid;gap:10px" class="field" id="voteField"><legend class="flabel" style="margin-bottom:8px">Escolher</legend>
      ${opts.map((o,i)=>`<label class="opt"><input type="radio" name="vote" value="${o.id}"><span class="box"><span class="radio"></span><span><b>Opção ${i+1}: ${esc(o.t)}</b><br><small>${esc(o.b)} · ${apoios(o)} apoios · esperando há ${tempo(daysOf(o))}</small></span></span></label>`).join('')}
      <span class="ferr">${icon('alert','sm')}Escolha uma opção para votar.</span></fieldset>
      <button class="btn acc full">${icon('check')}Escolher</button></form>`;
  return `<div class="pin-inner">
    <div class="ph"><span class="eyebrow">Votação de ${mes}</span><h2>Qual problema a associação leva ao vereador primeiro?</h2>
      <p>Um voto por pessoa em cada região. Entram os 3 mais apoiados do ranking.</p></div>
    ${areaSel('areaV')}${body}
    <p class="foot-note">Feito pela comunidade. Não é um site da prefeitura.</p></div>`;
}

function vLogin(){
  const c=S.create;
  return `<div class="pin-inner"><form class="loginbox" id="loginForm" novalidate>
    <div class="logo-big"><span class="mark">${icon('users','lg')}</span><b>Mutirão</b></div>
    <p class="sub2" style="text-align:center">${c?'Crie sua conta para marcar pontos, apoiar e votar.':'Entre para marcar pontos, apoiar e votar. Para ver o mapa não precisa de conta.'}</p>
    ${S.pending?`<div class="note">${icon('arrow')}Depois de entrar, você volta para o que estava fazendo.</div>`:''}
    ${c?`<div class="field" id="fName"><label for="lgName">Como quer ser chamado(a)</label><input class="input" id="lgName" autocomplete="nickname" placeholder="Ex.: Marluce"><span class="hint">Aparece só para você. No mapa ninguém vê seu nome.</span><span class="ferr">${icon('alert','sm')}Digite um nome.</span></div>`:''}
    <div class="field" id="fUser"><label for="lgUser">Login</label><input class="input" id="lgUser" autocomplete="username" placeholder="E-mail ou celular"><span class="ferr">${icon('alert','sm')}Digite seu e-mail ou celular.</span></div>
    <div class="field" id="fPass"><label for="lgPass">Senha</label><input class="input" id="lgPass" type="password" autocomplete="${c?'new-password':'current-password'}"><span class="ferr">${icon('alert','sm')}A senha precisa ter pelo menos 4 caracteres.</span></div>
    <button class="btn pri full">${c?'Criar conta':'Entrar'}</button>
    <button type="button" class="btn ghost" id="lgToggle">${c?'Já tenho conta. Entrar':'Ainda não tem conta? Criar conta'}</button>
    <div class="note">${icon('lock')}<span>Protótipo: qualquer e-mail ou celular com senha de 4 ou mais caracteres funciona. Nada sai do seu navegador.</span></div>
    <p class="foot-note">Feito pela comunidade. Não é um site da prefeitura.</p></form></div>`;
}
function vConta(){
  const mine=S.mine, sup=S.supported.size, votes=Object.keys(S.votes).length;
  const ms=[{x:'Apoiar 3 problemas do seu bairro',v:Math.min(sup,3),of:3},{x:'Marcar 1 ponto com foto',v:mine.some(p=>(p.photos||[]).length)?1:0,of:1},{x:'Votar na votação do mês',v:votes?1:0,of:1}];
  const done=ms.every(m=>m.v>=m.of);
  return `<div class="pin-inner">
    <div class="dhead"><span class="avatar" style="width:56px;height:56px;font-size:24px;border-color:#0B0B0F">${esc(S.user.name[0].toUpperCase())}</span>
      <div style="flex:1;min-width:0"><h2>Olá, ${esc(S.user.name)}</h2><p class="sub2">${esc(S.user.login)}</p></div>
      <button class="btn ghost" id="logout">Sair</button></div>
    <div class="stats"><div><b>${mine.length}</b><span>pontos marcados</span></div><div><b>${sup}</b><span>apoios dados</span></div><div><b>${votes}</b><span>votos</span></div></div>
    <section style="display:grid;gap:10px"><h3 class="sec">Seus pontos</h3>
      ${mine.length?`<div class="list">${mine.slice().reverse().map(p=>listItem(p)).join('')}</div>`:`<p class="note">${icon('pin')}Você ainda não marcou nenhum ponto.</p>`}
      <button class="btn acc" id="cAdd">${icon('plus')}Adicionar ponto</button></section>
    <section class="card" style="display:grid;gap:8px"><span class="eyebrow">Apoiadores do bairro · ideia em teste</span>
      <h3 class="sec">Ajude o bairro e ganhe desconto no comércio local</h3>
      <div>${ms.map(m=>`<div class="mission">${m.v>=m.of?`<span class="ok">${icon('check')}</span>`:icon('clock')}<span>${m.x}</span><em>${m.v}/${m.of}</em></div>`).join('')}</div>
      <div class="coupon${done?'':' locked'}">${done?`<b>5% na Padaria do Alto</b><span style="font-size:20px;font-weight:900;letter-spacing:.08em">MUT-${(hash(S.user.login)%9000+1000)}</span><small>Vale 1 vez por semana. Mostre no caixa.</small>`:`<b>${icon('gift','sm')} Desconto bloqueado</b><small>Complete as 3 missões para liberar 5% numa loja apoiadora do bairro.</small>`}</div>
      <p class="sub2">A loja não vê seu nome nem o que você marcou. Lojas de exemplo.</p></section>
    <p class="foot-note">Feito pela comunidade. Não é um site da prefeitura.</p></div>`;
}
function vAdicionar(){
  const d=S.draft||{};
  return `<form class="pin-inner" id="addForm" novalidate>
    <div class="dhead"><div style="flex:1"><span class="eyebrow">Novo ponto</span><h2>Adicionar ponto</h2></div>
      <button type="button" class="iconbtn" id="aClose" aria-label="Cancelar">${icon('close')}</button></div>
    <div class="card kv"><span class="cicon" style="width:44px;height:44px;border-radius:50%;background:var(--accent);color:#0B0B0F;display:grid;place-items:center;border:2px solid #0B0B0F">${icon('pin')}</span>
      <div style="flex:1;min-width:0"><b>${esc(d.b)}</b><div class="sub2">Local aproximado · RPA ${d.r} ${RPA[d.r]||''}</div></div>
      <button type="button" class="btn ghost" id="chgLoc">Trocar local</button></div>
    <fieldset class="field" id="fCat" style="border:0;padding:0;margin:0"><legend class="flabel" style="margin-bottom:8px">Que tipo de problema?</legend>
      <div class="cats">${Object.keys(CATS).map(k=>`<label class="choice"><input type="radio" name="cat" value="${k}"${d.c===k?' checked':''}><span>${icon(k,'lg')}${CATS[k].n}</span></label>`).join('')}</div>
      <span class="ferr">${icon('alert','sm')}Escolha o tipo de problema.</span></fieldset>
    <div class="field" id="fTitle"><label for="aTitle">O que está acontecendo?</label>
      <input class="input" id="aTitle" maxlength="80" value="${esc(d.t||'')}" placeholder="Ex.: Barreira cedendo atrás da escadaria">
      <span class="ferr">${icon('alert','sm')}Escreva em poucas palavras o que está acontecendo.</span></div>
    <div class="field"><label for="aRef">Rua ou ponto de referência</label>
      <input class="input" id="aRef" maxlength="100" value="${esc(d.ref||'')}" placeholder="Ex.: perto da escola municipal">
      <span class="hint">Opcional. Só a associação vê.</span></div>
    <div class="field"><label for="aDesc">Conte com suas palavras</label>
      <textarea class="textarea" id="aDesc" maxlength="400" placeholder="Desde quando acontece, quem é afetado, o que já tentaram.">${esc(d.desc||'')}</textarea>
      <span class="hint">Opcional.</span></div>
    <fieldset class="field" style="border:0;padding:0;margin:0"><legend class="flabel" style="margin-bottom:8px">A prefeitura já mexeu aqui?</legend>
      <div class="choices">${[['nunca','Nunca mexeu'],['paliativo','Fez, mas voltou'],['naosei','Não sei']].map(o=>`<label class="choice"><input type="radio" name="pal" value="${o[0]}"${(d.pal||'naosei')===o[0]?' checked':''}><span>${o[1]}</span></label>`).join('')}</div></fieldset>
    <div class="field"><span class="flabel">Fotos</span>
      <div class="gallery">${(d.photos||[]).map((u,i)=>`<figure class="ph-item" style="margin:0;flex-basis:150px"><img src="${u}" alt="Foto anexada ${i+1}"><figcaption>Foto ${i+1}</figcaption></figure>`).join('')}
        <button type="button" class="ph-add" id="aPhoto">${icon('camera','lg')}Anexar foto</button></div>
      <span class="hint">Opcional, mas ajuda muito. Evite mostrar rosto ou número da casa.</span></div>
    <div class="note">${icon('eye')}<span>No mapa aparece só o tipo, a foto e um ponto aproximado. Seu nome não aparece.</span></div>
    <button class="btn acc full">${icon('plus')}Adicionar ao mapa</button>
  </form>`;
}
function vSucesso(){
  const p=byId(S.lastAdded);if(!p)return vMapa();
  return `<div class="pin-inner" style="text-align:center;justify-items:center">
    <div style="width:84px;height:84px;border-radius:50%;background:var(--accent);border:3px solid #0B0B0F;display:grid;place-items:center;color:#0B0B0F;margin-top:12px">${icon('check','lg')}</div>
    <h2 style="font-size:26px;font-weight:900">Seu ponto está no mapa</h2>
    <p class="sub2" style="max-width:34ch">Agora os vizinhos podem ver e apoiar. Quanto mais apoio, mais chance de entrar na votação do mês.</p>
    <div class="card" style="width:100%;text-align:left">${listItem(p)}</div>
    <button class="btn acc full" id="sShare">${icon('share')}Chamar vizinhos no WhatsApp</button>
    <button class="btn sec full" id="sSee">${icon('map')}Ver no mapa</button>
    <p class="note" style="text-align:left">${icon('users')}Próximo passo: os 3 problemas mais apoiados de cada região entram na votação da associação.</p></div>`;
}

/* ---------- eventos do painel ---------- */
function bindPanel(){
  bindOpen(panel);
  const on=(id,ev,fn)=>{const el=panel.querySelector('#'+id);if(el)el.addEventListener(ev,fn)};
  on('pAdd','click',startAdd);on('cAdd','click',startAdd);
  on('pFilt','click',openFilters);
  on('dClose','click',()=>go('mapa'));
  const p=S.sel&&byId(S.sel);
  on('dSup','click',()=>need(()=>{openDetail(p.id);toggleSupport(p)},'apoiar'));
  const photo=()=>need(()=>{if(S.view!=='detalhe'||S.sel!==p.id){openDetail(p.id);toast('Pronto. Toque em Enviar foto de novo.','camera')}else pickFile(p.id)},'enviar foto');
  on('dPhoto','click',photo);on('dPhoto2','click',photo);
  on('dNote','click',()=>need(()=>{openDetail(p.id);const f=$('#noteForm');f.hidden=false;$('#noteTxt').focus()},'adicionar nota'));
  on('dShare','click',()=>share(p));
  on('dStreetView','click',()=>{if(p)openSVLayer(p.lat,p.lng,p.t);});
  on('noteCancel','click',()=>{$('#noteForm').hidden=true});
  on('noteForm','submit',e=>{e.preventDefault();const t=$('#noteTxt').value.trim(),f=$('#noteForm');if(!t){f.classList.add('err');$('#noteTxt').focus();return}
    (S.notes[p.id]=S.notes[p.id]||[]).push({x:t,t:Date.now()});save();renderPanel();toast('Nota publicada.','check')});
  ['areaR','areaV'].forEach(id=>on(id,'change',e=>{S.area=e.target.value;renderPanel()}));
  panel.querySelectorAll('[data-rm]').forEach(b=>b.addEventListener('click',()=>{S.rankMode=b.dataset.rm;renderPanel()}));
  on('toVote','click',()=>go('votacao'));
  on('reVote','click',()=>{delete S.votes[S.area];save();renderPanel()});
  on('voteForm','submit',e=>{e.preventDefault();const c=panel.querySelector('input[name=vote]:checked'),fs=$('#voteField');
    if(!c){fs.classList.add('err');return}fs.classList.remove('err');
    const area=S.area,id=c.value;need(()=>{S.area=area;S.votes[area]=id;save();go('votacao');toast('Voto registrado.','check')},'votar')});
  on('loginForm','submit',doLogin);
  on('lgToggle','click',()=>{S.create=!S.create;renderPanel()});
  on('logout','click',()=>{S.user=null;save();renderTop();go('mapa');toast('Você saiu da conta.')});
  on('aClose','click',()=>{S.draft=null;go('mapa')});
  on('chgLoc','click',()=>{keepDraft();go('pick')});
  on('aPhoto','click',()=>{keepDraft();pickFile('draft')});
  on('addForm','input',keepDraft);on('addForm','change',keepDraft);
  on('addForm','submit',submitAdd);
  on('sShare','click',()=>share(byId(S.lastAdded)));
  on('sSee','click',()=>openDetail(S.lastAdded));
}
function openDetail(id){const p=byId(id);if(!p)return;
  if(!shown().includes(p)){S.filt.cats.add(p.c);S.filt.st.add(p.s);renderMarkers()}
  select(id);go('detalhe');focusPoint(p)}
function toggleSupport(p){
  if(S.supported.has(p.id)){S.supported.delete(p.id);toast('Apoio retirado.')}
  else{S.supported.add(p.id);toast(`Apoio registrado. Agora são ${apoios(p)} vizinhos.`,'check')}
  save();renderPanel();
}
function doLogin(e){
  e.preventDefault();
  const u=$('#lgUser').value.trim(),pw=$('#lgPass').value,nm=$('#lgName')?$('#lgName').value.trim():'';
  let ok=true;
  const flag=(id,bad)=>{$('#'+id).classList.toggle('err',bad);if(bad)ok=false};
  if(S.create)flag('fName',!nm);flag('fUser',!u);flag('fPass',pw.length<4);
  if(!ok){const f=panel.querySelector('.field.err input');f&&f.focus();return}
  const name=nm||(u.includes('@')?u.split('@')[0]:'Vizinho(a)');
  S.user={name:name.charAt(0).toUpperCase()+name.slice(1),login:u};S.create=false;save();renderTop();
  toast(`Você entrou como ${S.user.name}.`,'check');
  const fn=S.pending;S.pending=null;if(fn)fn();else go('conta');
}
function startAdd(){need(()=>{S.draft={photos:[]};if(map.getZoom()<15)map.setZoom(15);go('pick')},'adicionar um ponto')}
function updatePick(){
  const c=map.getCenter(),b=bairroAt(c.lat,c.lng);
  $('#pickWhere').innerHTML=b?`${icon('pin','sm')} ${esc(b.n)} · RPA ${b.r} ${RPA[b.r]}`:`<span style="color:var(--err);font-weight:800">${icon('alert','sm')} Fora do Recife. Arraste o mapa para dentro da cidade.</span>`;
  $('#pickOk').disabled=!b;
}
$('#pickCancel').addEventListener('click',()=>{if(S.draft&&S.draft.b)go('adicionar');else{S.draft=null;go('mapa')}});
$('#pickOk').addEventListener('click',()=>{const c=map.getCenter(),b=bairroAt(c.lat,c.lng);if(!b)return;
  S.draft=Object.assign(S.draft||{photos:[]},{lat:+c.lat.toFixed(5),lng:+c.lng.toFixed(5),b:b.n,r:b.r});go('adicionar')});
function keepDraft(){
  const f=$('#addForm');if(!f||!S.draft)return;
  const c=f.querySelector('input[name=cat]:checked'),pl=f.querySelector('input[name=pal]:checked');
  Object.assign(S.draft,{c:c?c.value:S.draft.c,pal:pl?pl.value:S.draft.pal,t:$('#aTitle').value,ref:$('#aRef').value,desc:$('#aDesc').value});
}
function submitAdd(e){
  e.preventDefault();keepDraft();const d=S.draft;let ok=true;
  $('#fCat').classList.toggle('err',!d.c);if(!d.c)ok=false;
  $('#fTitle').classList.toggle('err',!(d.t||'').trim());if(!(d.t||'').trim())ok=false;
  if(!ok){(panel.querySelector('.field.err input')||panel.querySelector('.field.err')).focus?.();panel.querySelector('.field.err').scrollIntoView({block:'center',behavior:'smooth'});return}
  const p={id:'u'+Date.now(),t:d.t.trim(),c:d.c,s:d.pal==='paliativo'?'paliativo':'sem',b:d.b,r:d.r,a:1,lat:d.lat,lng:d.lng,created:Date.now(),ref:(d.ref||'').trim(),desc:(d.desc||'').trim(),photos:d.photos||[]};
  S.mine.push(p);save();S.draft=null;S.lastAdded=p.id;renderMarkers();go('sucesso');
  map.setView([p.lat,p.lng],Math.max(map.getZoom(),15));
}
let fileFor=null;
function pickFile(target){fileFor=target;const fi=$('#fileIn');fi.value='';fi.click()}
$('#fileIn').addEventListener('change',e=>{
  const f=e.target.files&&e.target.files[0];if(!f)return;
  if(!/^image\//.test(f.type)){toast('Esse arquivo não é uma foto. Escolha uma imagem.','alert');return}
  const rd=new FileReader();
  rd.onerror=()=>toast('Não deu para abrir a foto. Tente outra.','alert');
  rd.onload=()=>{const img=new Image();img.onload=()=>{
      const k=Math.min(1,900/Math.max(img.width,img.height)),cv=document.createElement('canvas');cv.width=Math.round(img.width*k);cv.height=Math.round(img.height*k);
      cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);const url=cv.toDataURL('image/jpeg',.72);
      if(fileFor==='draft'){S.draft.photos=(S.draft.photos||[]).concat(url);renderPanel()}
      else{(S.photos[fileFor]=S.photos[fileFor]||[]).push(url);save();renderPanel();toast('Foto enviada.','check')}};
    img.onerror=()=>toast('Não deu para abrir a foto. Tente outra.','alert');img.src=rd.result};
  rd.readAsDataURL(f);
});

/* ---------- busca ---------- */
let suggBox=null,suggIdx=-1,suggItems=[];
function closeSugg(){if(suggBox){suggBox.remove();suggBox=null}suggIdx=-1}
function runSearch(inp){
  const q=norm(inp.value);closeSugg();if(q.length<2)return;
  const bs=BAIRROS.features.map(f=>f.properties).filter(p=>norm(p.n).includes(q)).sort((a,b)=>norm(a.n).indexOf(q)-norm(b.n).indexOf(q)).slice(0,6).map(p=>({k:'b',p}));
  const ps=all().filter(p=>norm(p.t).includes(q)||norm(CATS[p.c].n).includes(q)).slice(0,5).map(p=>({k:'p',p}));
  suggItems=bs.concat(ps);
  suggBox=document.createElement('ul');suggBox.className='sugg';suggBox.setAttribute('role','listbox');
  suggBox.innerHTML=suggItems.length?suggItems.map((s,i)=>`<li><button type="button" data-i="${i}">${s.k==='b'?icon('pin','sm')+esc(s.p.n)+`<small>bairro · RPA ${s.p.r}</small>`:icon(s.p.c,'sm')+esc(s.p.t)+`<small>${esc(s.p.b)}</small>`}</button></li>`).join('')
    :`<li class="note" style="margin:4px">Nada encontrado para “${esc(inp.value)}”. Tente o nome do bairro.</li>`;
  inp.closest('.search').appendChild(suggBox);
  suggBox.querySelectorAll('button').forEach(b=>b.addEventListener('mousedown',e=>{e.preventDefault();choose(+b.dataset.i,inp)}));
}
function choose(i,inp){
  const s=suggItems[i];if(!s)return;closeSugg();inp.value='';inp.blur();
  if(s.k==='p'){openDetail(s.p.id);return}
  if(!['mapa','detalhe'].includes(S.view)||!isDesk())go('mapa');
  const l=bByName[s.p.n];map.fitBounds(l.getBounds(),{maxZoom:16,padding:[30,30]});
  const el=l.getElement&&l.getElement();if(el){el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),2200)}
  toast(`${s.p.n}: ${all().filter(p=>p.b===s.p.n).length} pontos marcados`,'pin');
}
['#q1','#q2'].forEach(sel=>{const inp=$(sel);
  let _sRaf=null;inp.addEventListener('input',()=>{cancelAnimationFrame(_sRaf);_sRaf=requestAnimationFrame(()=>runSearch(inp));});
  inp.addEventListener('blur',()=>setTimeout(closeSugg,120));
  inp.addEventListener('keydown',e=>{
    if(!suggBox){if(e.key==='Enter')runSearch(inp);return}
    const bs=suggBox.querySelectorAll('button');
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();suggIdx=(suggIdx+(e.key==='ArrowDown'?1:-1)+bs.length)%bs.length;bs.forEach((b,i)=>b.classList.toggle('on',i===suggIdx))}
    else if(e.key==='Enter'){e.preventDefault();choose(suggIdx<0?0:suggIdx,inp)}
    else if(e.key==='Escape')closeSugg();
  });
});

/* ---------- menu, filtros, legenda ---------- */
const menu=$('#menu'),btnMore=$('#btnMore');
function closeMenu(){menu.hidden=true;btnMore.setAttribute('aria-expanded','false')}
btnMore.addEventListener('click',e=>{
  e.stopPropagation();if(!menu.hidden){closeMenu();return}
  menu.innerHTML=`<button data-m="fit">${icon('expand')}Ver Recife inteiro</button>
    <button data-m="risk" id="riskToggle" class="${riskVisible?'rk-on':''}" aria-pressed="${riskVisible}">${icon('alert')}${riskVisible?'Ocultar':'Ver'} riscos oficiais</button>
    <button data-m="filt">${icon('filter')}Filtrar pontos</button>
    <button data-m="morro" aria-pressed="${S.morro}">${icon('layers')}Destacar bairros de morro<span class="switch"></span></button>
    <button data-m="leg">${icon('eye')}Mostrar legenda</button>
    <div class="sep"></div>
    <a href="https://solucinona.vercel.app/" target="_blank" rel="noopener">${icon('ext')}Mapa de Riscos do Recife (soluCINona)</a>
    <p class="note" style="background:none">Feito pela comunidade. Não é um site da prefeitura.</p>`;
  const r=btnMore.getBoundingClientRect(),w=$('.mapwrap').getBoundingClientRect();
  menu.style.top=(r.bottom-w.top+8)+'px';
  menu.style.right=(isDesk()?(w.right-r.right):12)+'px';menu.style.left='auto';
  menu.hidden=false;btnMore.setAttribute('aria-expanded','true');menu.querySelector('button').focus();
  menu.querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',()=>{
    const m=b.dataset.m;
    if(m==='morro'){S.morro=!S.morro;document.body.classList.toggle('nomorro',!S.morro);b.setAttribute('aria-pressed',S.morro);save();return}
    closeMenu();
    if(m==='fit')fitRecife();else if(m==='risk'){closeMenu();toggleRiskLayer();}else if(m==='filt')openFilters();else if(m==='leg'){$('#legend').open=true}
  }));
});
document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&e.target!==btnMore)closeMenu()});
$('#btnAdd').addEventListener('click',startAdd);

function openFilters(){
  modal(`<h2 id="mt">Filtrar pontos</h2>
    <fieldset class="field" style="border:0;padding:0;margin:0"><legend class="flabel" style="margin-bottom:8px">Tipo</legend><div class="choices">
      ${Object.keys(CATS).map(k=>`<label class="choice"><input type="checkbox" name="fc" value="${k}"${S.filt.cats.has(k)?' checked':''}><span>${icon(k,'sm')}${CATS[k].n}</span></label>`).join('')}</div></fieldset>
    <fieldset class="field" style="border:0;padding:0;margin:0"><legend class="flabel" style="margin-bottom:8px">Situação</legend><div class="choices">
      ${Object.keys(STATUS).map(k=>`<label class="choice"><input type="checkbox" name="fs" value="${k}"${S.filt.st.has(k)?' checked':''}><span>${shape(k,16)}${STATUS[k].n}</span></label>`).join('')}</div></fieldset>
    <div class="row"><button class="btn sec" id="fClear">Mostrar tudo</button><button class="btn pri" id="fApply">Aplicar</button></div>`,
  m=>{
    m.querySelector('#fClear').addEventListener('click',()=>{m.querySelectorAll('input').forEach(i=>i.checked=true)});
    m.querySelector('#fApply').addEventListener('click',()=>{
      S.filt.cats=new Set([...m.querySelectorAll('input[name=fc]:checked')].map(i=>i.value));
      S.filt.st=new Set([...m.querySelectorAll('input[name=fs]:checked')].map(i=>i.value));
      closeModal();renderMarkers();if(S.view==='mapa')renderPanel();toast(`${shown().length} pontos no mapa`,'filter')});
    m.querySelector('input').focus();
  });
}
$('#legendBody').innerHTML=`<h4>Tipo</h4><div class="lg-grid">${Object.keys(CATS).map(k=>`<span class="lg-item"><span class="lg-cat">${icon(k)}</span>${CATS[k].n}</span>`).join('')}</div>
  <h4>Situação</h4><div style="display:grid;gap:6px">${Object.keys(STATUS).map(k=>`<span class="lg-item">${shape(k,18)}${STATUS[k].n}</span>`).join('')}</div>
  <h4>Fundo</h4><div style="display:grid;gap:6px"><span class="lg-item"><i class="lg-sw" style="background:var(--morro)"></i>Bairros com morros e encostas</span>
  <span class="lg-item"><i class="lg-sw" style="background:var(--land)"></i>Outros bairros do Recife</span>
  <span class="lg-item"><i class="lg-sw" style="background:var(--land-other)"></i>Cidades vizinhas</span></div>
  <span class="lg-item"><span class="cl" style="display:inline-block"><div style="width:30px;height:30px;font-size:13px;border-width:2px">5</div></span>Vários pontos juntos: toque para aproximar</span>`;


document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if($('#scrim')){closeModal(true);return}
  if(!menu.hidden){closeMenu();btnMore.focus();return}
  if(S.view==='detalhe')go('mapa');
});
window.addEventListener('resize',()=>map.invalidateSize());

/* ---------- início ---------- */
$('#legend').open=isDesk();fitRecife();
renderTop();renderMarkers();
const h=(location.hash||'').slice(1);
if(h&&byId(h))openDetail(h);
else if(['ranking','votacao','conta'].includes(h))go(h);
else go('mapa');
})();
