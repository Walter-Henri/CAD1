# Relatório de Bugs Corrigidos — Mutirão · Recife

## BUG-018 · ALTO — Painel largo do desktop estoura o celular

**Status:** CORRIGIDO (1.10.2) | **Arquivos:** `src/css/layout/mobile-lock.css`, `src/css/app.css`

**Sintoma:** depois de ampliar a janela esquerda no desktop (~560px), no smartphone as mesmas janelas ultrapassavam a largura da tela: corte, desalinhamento e rolagem horizontal.

**Causa (não era o media query de 960px em si):**

1. `shell.css` e `responsive-fix.css` aplicam `width: min(560px, 48vw)` apenas em `min-width: 960px`. Isso está correto e foi preservado.
2. `app.css` importa `responsive-fix.css` **antes** de `components/ui.css` e `features/fase1.css`.
3. `ui.css` redefine `.stats` como `repeat(3, 1fr)`. Em CSS Grid, `1fr` implica `min-width: auto` = min-content. Rótulos longos ("pontos marcados", "esperando solução") e botões com `white-space: nowrap` (folha do user agent) impedem a coluna de encolher.
4. `.gallery` / `.ph-item { flex: 0 0 220px }` como filho de `.pin-inner` (`display: grid`) também contribui com min-content alto se o ancestral não tiver `min-width: 0`.
5. A tabbar da Fase 1 tem 5 colunas e a pílula ativa mede 72px; com `minmax(auto, 1fr)` o item mínimo segue o conteúdo e pode alargar o documento em viewports ~320px.

**Correção:** folha final `mobile-lock.css`, exclusiva de `max-width: 959.98px`, com `width/min-width/max-width` explícitos no `.panel` e no `.mapwrap`, `minmax(0, 1fr)` em stats e tabbar, `min-width: 0` nos filhos de `.pin-inner`, e `white-space: normal` nos botões. Desktop intocado.

**Critério de aceitação:** em 360×640 e 390×844 o painel de Conta, Detalhe, Ranking, Votação, Adicionar e todas as views F1 cabem na largura; em ≥960px a coluna continua ~560px.

---

## BUG-017 · BAIXO — Legenda com chevron pouco claro

**Status:** CORRIGIDO (1.10.1) | **Arquivos:** `index.html`, `css/map/chrome.css`

O `<summary>` usava `#i-chev` rotacionado. Passou a `#i-close` (classe `.legend-close`). Abrir/fechar continua sendo o `<details id="legend">`.

---

## BUG-015 · ALTO — Conteúdo cortado / overflow na Conta e painéis

**Status:** ✅ CORRIGIDO (1.10.0) | **Arquivos:** `runtime.js` (vConta), `layout/responsive-fix.css`

**Causa:** no cabeçalho da Conta, avatar, botões Mensagens/Líder, nome e Sair competiam na mesma linha flex (`.dhead`), forçando largura maior que o painel. Em mobile, painéis fullscreen usavam `display:block` sem contenção de overflow horizontal; `.row > .btn` com `flex-basis: 140px` gerava rolagem lateral.

**Correção:**
- Cabeçalho da Conta em blocos empilhados (`.conta-head` / `.conta-actions`)
- Módulo CSS de overflow, quebra de linha e breakpoints mobile/tablet/desktop
- Painéis mobile em coluna com `overflow-x: hidden`

---

## BUG-016 · MÉDIO — Ficha do ponto (detalhe) limitada demais no mobile

**Status:** ✅ CORRIGIDO (pré-1.10 / shell) | **Arquivo:** `layout/shell.css`

**Causa:** `max-height: 74%` cortava conteúdo longo.

**Correção:** `max-height: calc(100% - 8px)` com rolagem interna.

---

UG-006 · ALTO — Toasts não desapareciam automaticamente

**Status:** ✅ CORRIGIDO (1.7.1) | **Arquivo:** `src/js/core/toast.js`

**Causa:** o hide dependia só de `animationend`. Com `prefers-reduced-motion` (regra global e específica no CSS), a animação não roda e o evento nunca dispara; o toast permanece visível.

**Correção:**
- Timer de exibição 3100ms + fallback 220ms após `toast-out`
- Token `toastGen` para timers antigos não afetarem toast novo
- Reinício forçado da animação de entrada ao substituir conteúdo

---

## BUG-007 · ALTO — Listeners da Fase 1 não ligados após render

**Status:** ✅ CORRIGIDO (1.7.1) | **Arquivo:** `src/js/app.js`

**Causa:** `bindNewFeatures` era chamado uma vez no boot com `v` indefinido e usava `on` fora do escopo de `bindPanel`.

**Correção:** `bindNewFeatures(S.view, on)` no final de `bindPanel`.

---

## BUG-008 · MÉDIO — Marcadores de pânico/obra ausentes após reload

**Status:** ✅ CORRIGIDO (1.7.1) | **Arquivo:** `src/js/app.js`

**Causa:** `renderPanicoMarkers` / `renderObraMarkers` só rodavam após mutações (e em `submitAdd`).

**Correção:** ambas chamadas no boot, junto com `renderMarkers`.

---

## BUG-009 · MÉDIO — Painel mobile oculto nas views da Fase 1

**Status:** ✅ CORRIGIDO (1.7.1) | **Arquivo:** `src/css/app.css`

**Causa:** em `max-width: 959.98px`, `.panel{display:none}` só reabria para ranking/votacao/conta/adicionar/sucesso.

**Correção:** incluir `alertas`, `panico*`, `obras*`, `mensagens`, `lider` no seletor de tela cheia.

---

## BUG-001 · CRÍTICO — Texto invisível na busca (tema claro)

**Status:** ✅ CORRIGIDO | **Arquivo:** `src/css/app.css`  
Inputs herdam `color` do topbar branco. Correção: `color: var(--ink)` em `.search input` e campos de formulário.

---

## BUG-002 · ALTO — `.b-poly` duplicata com `fill-opacity:.95`

**Status:** ✅ CORRIGIDO | **Arquivo:** `src/css/app.css`  
Regra posterior tornava polígonos opacos. Mantido `.35`.

---

## BUG-003 · ALTO — `.mapwrap { position:relative }` colapsava o mapa (2×)

**Status:** ✅ CORRIGIDO | **Arquivo:** `src/css/app.css`  
Manter `position:absolute; inset:0`.

---

## BUG-004 · MÉDIO — `.pickbar` duplicada (z-index)

**Status:** ✅ CORRIGIDO | **Arquivo:** `src/css/app.css`

---

## BUG-005 · MÉDIO — `.mk.sel .pin` borda preta residual

**Status:** ✅ CORRIGIDO | **Arquivo:** `src/css/app.css`

---

## Ainda abertos (não são “corrigidos”)

Ver [`../FASE1.md`](../FASE1.md): `S.user.bairro`, hash das views F1, `pickCancel`/`_returnTo`, `respLida`.
