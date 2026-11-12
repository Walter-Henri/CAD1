# AI_CONTEXT_GUIDE — Mutirão · Recife

> Leia este arquivo antes de modificar o projeto.  
> Infra: [`../DOCUMENTACAO_INFRAESTRUTURA.md`](../DOCUMENTACAO_INFRAESTRUTURA.md) · Fase 1: [`FASE1.md`](FASE1.md) · JS: [`../src/js/STRUCTURE.md`](../src/js/STRUCTURE.md)  
> Métricas conferidas em **2026-11-12** contra o código atual.

---

## 1. O que é

Webapp comunitário de problemas urbanos em **Recife, PE**. Protótipo E7, vanilla JS, sem backend.

Fase 1: **pânico**, **obras públicas**, **mensagens ao líder**.

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| JS | Vanilla, scripts clássicos + `window.Mutirao` |
| HTML | 1 arquivo, ~181 linhas |
| CSS | `app.css` ~895 linhas |
| Mapa | Leaflet 1.9.4 + MarkerCluster 1.5.3 (CDN) |
| Tiles | OpenStreetMap (dark via CSS filter) |
| Geocode | Nominatim (sem API key) |
| Estado | localStorage (5 chaves) |
| Deploy | Vercel static + `inject-env.mjs` |

`'use strict'` em `app.js` vem **depois** de `let tileBase` — a diretiva **não** é efetiva no IIFE.

---

## 2.1 CSS modular

Entrada: `src/css/app.css` (`@import`). Tokens: `tokens/design-tokens.css`.  
Ver `DOCUMENTATION/DESIGN_SYSTEM.md`. **Não** editar `vendor.css` sem necessidade.

## 3. Estrutura JS

```
src/js/
├── core/util.js, constants.js, toast.js
├── services/geocode.js, gps.js, share.js
├── views/*.js          # registro de telas (implementação das v* ainda no IIFE)
├── data/*              # globais BAIRROS, VIZINHOS, SEED, RISCOS, ENV
└── app.js              # IIFE: mapa, S, rotas, views HTML, bind, boot (~1405 linhas, 85 funções)
```

**Ordem de carga:** Leaflet → data → core → services → views → `app.js`.

`app.js` usa `const toast = (msg,ic) => Mutirao.toast(msg,ic)`.

---

## 4. Estado `S`

```js
// mutirao.v1
{ user, mine, supported, notes, photos, votes, morro, filt, view, sel, draft, ... }

// chaves separadas
S.panics    // mutirao.panics
S.obras     // mutirao.obras
S.messages  // mutirao.msgs
S.selP, S.selO
```

`doLogin` → `{ name, login }` apenas.  
Boot: usuário salvo sem `role` recebe `role='morador'` na memória.  
`#goLider` grava `role='lider'`.  
**`S.user.bairro` nunca é atribuído.**

---

## 5. Funções críticas

| Função | Papel |
|---|---|
| `go(view)` | Única porta de navegação + `NAVOF` + hash parcial |
| `renderPanel()` | Despacha todas as views (base + F1) |
| `transPanel` → `bindPanel` | HTML do painel + listeners |
| `bindNewFeatures(S.view, on)` | Chamada **no fim de `bindPanel`** — pânico/obra/mensagens |
| `Mutirao.toast` | Auto-dismiss 3,1s; token de geração; fallback 220ms |
| `save` / `saveP` / `saveO` / `saveM` | Quatro persistências |
| `computeObraStatus` | Status derivado (não gravado) |
| `renderPanicoMarkers` / `renderObraMarkers` | Também no **boot** |

---

## 6. Toast (não regredir)

Arquivo: `src/js/core/toast.js`.

1. Incrementa `toastGen` a cada chamada  
2. Cancela timers anteriores  
3. Após 3100ms: classe `toast-out` + **timeout 220ms de fallback** (obrigatório se `animationend` não vier)  
4. Só esconde se `gen === toastGen`  

Não voltar a depender só de `animationend`.

---

## 7. Mapa — panes

| z | Pane | Conteúdo |
|---|---|---|
| 600 | markerPane | clusters, pontos, pgLayer, ogLayer |
| 450 | maskPane | world mask |
| 400 | overlayPane | bairros, vizinhos, risco, choropleth |
| 200 | tilePane | OSM |

---

## 8. Áreas de atenção

| Área | Risco | Nota |
|---|---|---|
| `.mapwrap` | Crítico | `position:absolute;inset:0` — nunca sobrescrever |
| Ordem dos scripts | Crítico | data antes de app; core/toast antes de app |
| Toast | Alto | Lógica só em `core/toast.js` |
| `bindNewFeatures` | Alto | Deve permanecer no fim de `bindPanel` |
| Painel mobile CSS | Alto | Lista de `data-view` F1 no seletor de tela cheia |
| `S.user.bairro` | Médio | Ainda ausente no login |
| Nominatim | Médio | 1 req/s; debounces já existem |
| CSS duplicado | Médio | Buscar seletor antes de adicionar |

---

## 9. Checklist antes de alterar

- [ ] Ler este guia e `FASE1.md` se o tema for pânico/obra/líder  
- [ ] Não quebrar `.mapwrap` nem a ordem dos `<script>`  
- [ ] Se nova view: incluir no CSS mobile **e** em `bindNewFeatures` / `renderPanel` / `NAVOF`  
- [ ] `node --check` em todo `.js` tocado  
- [ ] Tema claro e escuro; viewport &lt; e ≥ 960px  
- [ ] Atualizar `CHANGELOG.md`  

---

## 10. Índice

| Doc | Conteúdo |
|---|---|
| `AI_CONTEXT_GUIDE.md` | Este arquivo |
| `FASE1.md` | Modelos, rotas, limitações F1 |
| `ARCHITECTURE/SYSTEM_OVERVIEW.md` | Diagramas |
| `BUGFIXES/BUGFIX_REPORT.md` | Bugs corrigidos |
| `TESTING/TEST_EXECUTION_REPORT.md` | Testes |
| `DEVELOPMENT/CHANGELOG.md` | Histórico |
| `../src/js/STRUCTURE.md` | Árvore JS |
| `../README.md` | Setup e deploy |
