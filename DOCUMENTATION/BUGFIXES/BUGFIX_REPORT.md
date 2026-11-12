# Relatório de Bugs Corrigidos — Mutirão · Recife

## BUG-006 · ALTO — Toasts não desapareciam automaticamente

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
