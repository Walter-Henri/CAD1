/** Constantes de domínio — Mutirão */
(function(M){
'use strict';
M.CATS={
  alag:    {n:'Alagamento',    o:'Emlurb',                      color:'#2563EB'},
  barreira:{n:'Barreira',      o:'Defesa Civil',                color:'#DC2626'},
  buraco:  {n:'Buraco',        o:'Emlurb',                      color:'#D97706'},
  esgoto:  {n:'Esgoto e cano', o:'Compesa',                     color:'#7C3AED'},
  lixo:    {n:'Lixo e entulho',o:'Emlurb',                      color:'#059669'},
  obra:    {n:'Obra parada',   o:'Secretaria de Infraestrutura',color:'#EA580C'}
};
M.STATUS={
  sem:{n:'Sem resposta'},
  paliativo:{n:'Paliativo, voltou'},
  associacao:{n:'Com a associação'},
  vereador:{n:'Com o vereador'},
  resolvido:{n:'Resolvido'}
};
M.RPA={1:'Centro',2:'Norte',3:'Noroeste',4:'Oeste',5:'Sudoeste',6:'Sul'};
M.PANICO_TIPO={
  deslizamento:{n:'Deslizamento de terra',color:'#92400E'},
  alagamento:  {n:'Alagamento / transbordamento',color:'#1D4ED8'},
  desabamento: {n:'Desabamento estrutural',color:'#7C2D12'},
  arvore:      {n:'Árvore ou poste caído',color:'#065F46'},
  via:         {n:'Via interditada',color:'#1E3A8A'},
  ponte:       {n:'Dano em ponte',color:'#9D174D'},
  outro:       {n:'Outra emergência',color:'#4B5563'}
};
M.PANICO_SEV={
  critico:{n:'Crítico — risco de vida imediato',color:'#DC2626'},
  alto:   {n:'Alto — risco imediato',color:'#EA580C'},
  medio:  {n:'Médio — atenção necessária',color:'#D97706'}
};
M.OBRA_ST={
  em_andamento:   {n:'Em andamento',   color:'#2563EB',ic:'clock'},
  atrasada:       {n:'Atrasada',       color:'#DC2626',ic:'alert'},
  em_conclusao:   {n:'Em conclusão',   color:'#D97706',ic:'check'},
  em_inauguracao: {n:'Em inauguração', color:'#059669',ic:'check'},
  nunca_concluida:{n:'Nunca concluída',color:'#9D174D',ic:'lock'}
};
M.NAVOF={mapa:'mapa',detalhe:'mapa',pick:'mapa',adicionar:'mapa',sucesso:'mapa',ranking:'ranking',votacao:'votacao',conta:'conta',alertas:'alertas',panico:'alertas',panicoAdd:'alertas',panicoDetalhe:'alertas',mensagens:'alertas',lider:'alertas',obras:'obras',obraAdd:'obras',obraDetalhe:'obras'};
})(window.Mutirao=window.Mutirao||{});
