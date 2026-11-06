# Relatório de Testes — 24/24 — Mutirão · Recife

**Executor:** Auditoria automatizada Python + Node.js  
**Data:** 2026-11-05 | **Resultado:** ✅ 24/24 APROVADOS (100%)

## Resumo

| Métrica | Valor |
|---|---|
| Total previsto | 24 |
| Executados | 24 |
| Aprovados | 24 |
| Reprovados | 0 |
| Bloqueados | 0 |
| Taxa de aprovação | 100% |

## Cobertura por área

| Área | Testes | Status |
|---|---|---|
| Tiles OSM (setBaseTile) | T-001 a T-005 | ✅ 5/5 |
| World mask (recorte geográfico) | T-006 a T-011 | ✅ 6/6 |
| Bounds combinados (RMR) | T-012 a T-013 | ✅ 2/2 |
| CSS crítico do mapa | T-014 a T-016 | ✅ 3/3 |
| Layout (cadeia .mapwrap) | T-017 a T-019 | ✅ 3/3 |
| Funcionalidades principais | T-020 a T-023 | ✅ 4/4 |
| Sintaxe JavaScript | T-024 | ✅ 1/1 |

## Registros Individuais

| ID | Nome | Componente | Resultado |
|---|---|---|---|
| T-001 | `let tileBase=null` declarado | app.js — tiles | ✅ PASS |
| T-002 | `function setBaseTile` definida | app.js — tiles | ✅ PASS |
| T-003 | Estilo `nolabels` presente | app.js — URL tiles | ✅ PASS |
| T-004 | `setBaseTile(isDark())` no init | app.js — boot | ✅ PASS |
| T-005 | `setBaseTile(isDark())` ≥ 2× (init + toggleTheme) | app.js — tema | ✅ PASS |
| T-006 | `map.createPane('maskPane')` | app.js — world mask | ✅ PASS |
| T-007 | `style.zIndex='450'` no maskPane | app.js — z-index | ✅ PASS |
| T-008 | `function buildWorldMask` definida | app.js — recorte | ✅ PASS |
| T-009 | `...BAIRROS.features,...VIZINHOS.features` nos holes | app.js — 100 buracos | ✅ PASS |
| T-010 | `className:'world-mask'` no L.polygon | app.js / app.css | ✅ PASS |
| T-011 | `buildWorldMask()` chamada no boot | app.js — init | ✅ PASS |
| T-012 | `const vizLayer=L.geoJSON(VIZINHOS` | app.js — bounds | ✅ PASS |
| T-013 | `extend(vizLayer.getBounds())` | app.js — fitBounds | ✅ PASS |
| T-014 | `.world-mask` + `fill:var(--sea)` no CSS | app.css — máscara | ✅ PASS |
| T-015 | `.b-poly` com `fill-opacity:.35` | app.css — polígonos | ✅ PASS |
| T-016 | `.v-poly` com `fill-opacity:.10` | app.css — vizinhos | ✅ PASS |
| T-017 | `.mapwrap{position:absolute;inset:0}` | app.css — layout | ✅ PASS |
| T-018 | Ausência de `.mapwrap { position:relative }` | app.css — regressão | ✅ PASS |
| T-019 | `#map` com `background:var(--sea)` | app.css — fundo | ✅ PASS |
| T-020 | `fitRecife()` chamada | app.js — vista inicial | ✅ PASS |
| T-021 | `function toggleTheme` definida | app.js — tema | ✅ PASS |
| T-022 | `L.geoJSON(BAIRROS` no init | app.js — camada bairros | ✅ PASS |
| T-023 | `function toggleRiskLayer` definida | app.js — riscos Sedec | ✅ PASS |
| T-024 | `node --check app.js` → exit 0 | app.js — sintaxe | ✅ PASS |
