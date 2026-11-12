/** Utilitários DOM e formatação */
export const $ = s => document.querySelector(s);
export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => (
  { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]
));
export const icon = (n, cls) =>
  `<svg class="ic ${cls || ''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
export const norm = s =>
  String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const hash = s => {
  let h = 7;
  for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
};
export const DAY = 864e5;
export const NOW = Date.now();
export const isDesk = () => window.matchMedia('(min-width:960px)').matches;
export function tempo(d) {
  if (d < 1) return 'hoje';
  if (d === 1) return '1 dia';
  if (d < 30) return d + ' dias';
  if (d < 365) {
    const m = Math.round(d / 30);
    return m <= 1 ? '1 mês' : m + ' meses';
  }
  const y = d / 365;
  return y < 1.5 ? '1 ano' : (Math.round(y * 10) / 10).toString().replace('.', ',') + ' anos';
}
export const fmt = t =>
  new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
