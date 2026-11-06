# Relatório de Bugs Corrigidos — Mutirão · Recife

---

## BUG-001 · CRÍTICO — Texto invisível no campo de busca (tema claro)

**Status:** ✅ CORRIGIDO | **Arquivo:** `src/css/app.css`

**Causa raiz:** `.topbar { color: #fff }` → inputs herdam `color: inherit` → texto branco em fundo branco.

**Correção:**
```css
/* ANTES: sem color explícito */
.search input { background: var(--surface); padding: 0 48px 0 44px; }

/* DEPOIS */
.search input { background: var(--surface); color: var(--ink); padding: 0 48px 0 44px; }
.search input::placeholder { color: var(--ink-2); }
/* + mesma correção em: input, .textarea, .select { color: var(--ink); } */
```

---

## BUG-002 · ALTO — `.b-poly` duplicata com `fill-opacity:.95`

**Status:** ✅ CORRIGIDO | **Arquivo:** `src/css/app.css`

**Causa raiz:** Duas regras `.b-poly` coexistiam. A posterior (`fill-opacity:.95`) vencia por
CSS cascade, tornando os polígonos opacos e encobrindo os tiles OSM.

**Correção:** Remoção da regra duplicata. Valor correto: `fill-opacity:.35` (semitransparente).

---

## BUG-003 · ALTO — `.mapwrap { position:relative }` colapsava o mapa (ocorreu 2×)

**Status:** ✅ CORRIGIDO | **Arquivo:** `src/css/app.css`

**Causa raiz:** Regra `.mapwrap { position:relative }` adicionada ao tentar criar um "vignette"
sobrescrevia `.mapwrap { position:absolute; inset:0 }`. Com `position:relative` e sem
`height`/`width`, o container colapsava para 0px (todos os filhos são `position:absolute`).

**Medida preventiva:** Comentário explícito no CSS indicando que esta propriedade não pode ser sobrescrita.

---

## BUG-004 · MÉDIO — `.pickbar` duplicada (z-index conflitante)

**Status:** ✅ CORRIGIDO | **Arquivo:** `src/css/app.css`

**Causa raiz:** Regra original (`z-index:850`, `bottom:20px`, "floating card") coexistia com
nova (`z-index:800`, `bottom:0`, full-width bar). **Correção:** Remoção da regra antiga.

---

## BUG-005 · MÉDIO — `.mk.sel .pin` conflito entre regra antiga e nova

**Status:** ✅ CORRIGIDO | **Arquivo:** `src/css/app.css`

**Causa raiz:** Regra antiga declarava `border-color:#0B0B0F`. Nova regra (`--pc/branco`) não
declarava `border-color`, então o preto persistia. **Correção:** Remoção da regra antiga +
adição de `border-color:var(--pc,var(--primary))` na nova regra.
