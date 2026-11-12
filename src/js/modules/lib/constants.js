/** Categorias, status, RPAs e chips */
import { icon } from './dom.js';

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


export { CATS, STATUS, RPA, MORRO, shape, stChip, catChip };
