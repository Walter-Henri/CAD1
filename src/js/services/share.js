/** Compartilhamento — Mutirão
 * share() e shareWhatsApp() permanecem em app.js (dependem de apoios/daysOf/S).
 * Este arquivo reserva o namespace para evoluir o serviço.
 */
(function(M){
'use strict';
M.services=M.services||{};
M.services.share={
  /** Mensagem texto padrão para clipboard / WhatsApp */
  pointText(p, apoiosFn){
    const n=apoiosFn(p);
    return `${p.t} (${p.b}). ${n} ${n===1?'vizinho já apoia':'vizinhos já apoiam'} no Mutirão. Você também vê isso? Entre no Mutirão e apoie para a associação levar ao vereador.`;
  }
};
})(window.Mutirao=window.Mutirao||{});
