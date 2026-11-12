# CHANGELOG — Mutirão · Recife

## [1.9.0] — Modularização ES modules do JavaScript — 2026-11-12

### Changed
- `app.js` monolítico substituído por ES modules em `src/js/modules/`.
- Entrada: `modules/main.js` (`type="module"`).
- `createApp()` + `install/dom`, `install/constants`, `install/runtime`.
- Utilitários em `lib/dom.js` e `lib/constants.js`; toast bridge em `ui/toast.js`.
- `src/js/app.js` permanece só como stub legado (não carregado).

### Notes
- `install/runtime.js` concentra mapa/rotas/views/F1 no mesmo closure (mesmo comportamento).
- Próximo passo: fatiar runtime em install/map, views, fase1 sobre o bag `app`.


## [1.8.0] — CSS modular + Design System + doc de infraestrutura — 2026-11-12

### Changed
- `app.css` dividido em módulos (`tokens/`, `base/`, `layout/`, `components/`, `map/`, `features/`) com entrada por `@import`.
- Documentação: `DOCUMENTACAO_INFRAESTRUTURA.md`, `DESIGN_SYSTEM.md`, `AI_GUIDELINES.md`, `CHANGELOG_REESTRUTURACAO.md`.

### Notes
- Identidade visual e seletores preservados (split mecânico).
- Validação E2E de browser não automatizada neste ambiente.


O `package.json` permanece em `1.0.0`. As versões abaixo são o histórico funcional.

## [1.7.1] — Toasts + bind F1 + painel mobile + marcadores no boot — 2026-11-11

### Fixed
- **Toasts:** não sumiam quando `animationend` não disparava (`prefers-reduced-motion`). Implementação canônica em `core/toast.js` com token `toastGen`, cancelamento de timers e fallback de 220ms.
- **`bindNewFeatures`:** chamado no fim de `bindPanel(S.view, on)` — formulários e cards da Fase 1 passam a receber listeners após cada render.
- **Marcadores F1:** `renderPanicoMarkers()` e `renderObraMarkers()` no boot.
- **Painel mobile:** views F1 incluídas no seletor CSS de tela cheia.

### Changed
- Extraídos `src/js/core/{util,constants,toast}.js` e `src/js/services/{geocode,gps,share}.js`.
- `app.js` delega `toast` a `Mutirao.toast`.
- Registro de telas em `src/js/views/*.js` (implementação HTML das `v*` permanece no IIFE).
- Documentação alinhada ao código (2026-11-12).

## [1.7.0] — Fase 1 — Pânico, obras, líder — código ~2026-11-08

### Added
- Pânico: tipos, gravidade, FAB, `pgLayer`, views panico*
- Obras: `OBRA_ST`, `computeObraStatus`, `ogLayer`, views obra*
- Mensagens e líder: `vMensagens`, `vLider`, `vAlertas`; `#goMsgs` / `#goLider`
- Persistência: `mutirao.panics`, `mutirao.obras`, `mutirao.msgs`
- Pick com `_returnTo`; tabbar 5 colunas; atalhos no menu

### Notas (parcialmente resolvidas em 1.7.1)
- Bind F1 e marcadores no boot corrigidos em 1.7.1.
- Ainda abertos: `S.user.bairro`, hash F1, `pickCancel`/`_returnTo`, `respLida`.

## [Unreleased / base] — 2026-11-05

### Fixed
- BUG-001 a BUG-005 (texto de busca, `.b-poly`, `.mapwrap`, `.pickbar`, `.mk.sel .pin`)

## [1.6.0] — GPS + Nominatim + Choropleth + WhatsApp
## [1.5.0] — OSM + World Mask
## [1.4.0] — Design + Riscos Defesa Civil
## [1.3.0] — UX + Street View
## [1.2.0] — Multi-arquivo + tema
## [1.0.0] — Protótipo E7 v1
