# Changelog — Mutirão · Recife

Histórico funcional do produto. O `package.json` permanece em `1.0.0`; as versões abaixo descrevem entregas de código e documentação.

---

## [1.11.2] — Onboarding em duas etapas — 2026-11-14

### Changed
- Modal de boas-vindas **sem botão X** (apenas `?` de ajuda).
- Ao tocar em **“Entendi, vamos lá”**, segunda etapa: *“Deseja que esta mensagem de boas-vindas não apareça novamente?”*
  - **Sim, não mostrar novamente** → `localStorage.mutirao.onboarded = "1"`; não reexibe.
  - **Não, continuar mostrando** → fecha sem gravar; reaparece na próxima visita.
- `modal(..., opts)` com `hideClose`, `lockScrim`, `hint`; corpo em `#modalBody` para transição suave entre etapas.
- Ajuda (`?`) permanece disponível em qualquer momento.

### Notes
- Clique no scrim bloqueado durante o onboarding; botões desabilitados após escolha (anti double-click).

---

## [1.11.1] — Temas: claro padrão + escuro refinado — 2026-11-14

### Changed
- **Tema claro é o padrão** para novos usuários (`data-theme="light"` no bootstrap do `index.html`).
- Escuro **somente** com `data-theme="dark"` (preferência salva em `mutirao.theme`); não herda mais `prefers-color-scheme` como padrão silencioso.
- `isDark()` simplificado: retorna verdadeiro apenas se `dataset.theme === "dark"`.
- Paleta escura recalibrada (superfícies em camadas, texto de alto contraste, primary `#8FB0FF`, accent suavizado).
- Controles Leaflet no escuro alinhados a `data-theme` (sem media query de sistema).

### Files
- `src/css/tokens/design-tokens.css`
- `src/css/map/layers.css` (atribuição / zoom)
- `index.html` (script de bootstrap)
- `runtime.js` (`isDark` / `toggleTheme`)

---

## [1.11.0] — Usabilidade (toasts de sucesso, ranking, formulário, fontes, menu) — 2026-11-14

### Added
- Toast + banner **“Problema registrado com sucesso!”** após `submitAdd`.
- Card **“Menu principal (sempre à mão)”** na home do mapa com atalhos Ranking / Votação / Conta.
- Botão **“Votar neste problema”** em cada item do ranking (abre votação do mês na RPA do ponto).
- Formulário de ponto: dicas de detalhe (tamanho, tempo, risco), **Limpar textos**, botão **Publicar no mapa**.
- Onboarding inicial (depois evoluído em 1.11.2).
- Tipografia base 17px; botões/labels reforçados.

### Fixed
- “X” duplicados em painéis (sheet-bar vs cabeçalho interno).
- `mobile-lock.css`: tiles/SVG Leaflet **isentos** de `max-width: 100%` (corrige “mapa gigante” sob a máscara no mobile).

---

## [1.10.2] — Mobile-lock e painéis laterais — 2026-11-13

### Fixed
- Painel desktop alargado (`min(560px, 48vw)`, teto 600px).
- `mobile-lock.css` como **último** CSS da cascata (`max-width: 959.98px`) impede herança de larguras desktop no mobile.
- Legenda: chevron substituído por ícone **X** de fechar.

### Docs
- `RESPONSIVE.md`, diagramas e fluxos atualizados.

---

## [1.10.1] — UI/UX: chrome de navegação e ajuda contextual — 2026-11-13

### Added
- `modules/ui/help.js`: dicionário `HELP`, `sheetBar(view)` (Voltar / ? / Fechar), `openHelp` / `closeHelp`.
- Histórico de navegação (`hist`, `goBack`, `closeToMap`).
- Hash de rotas Fase 1 (`panico:ID`, `obra:ID`).

### Fixed
- Painel de detalhe com scroll e altura segura no mobile.
- Lacunas Fase 1: bairro no login, `pickCancel` / `_returnTo`, `respLida`.

---

## [1.10.0] — Modularização runtime + toasts canônicos — 2026-11-12/13

### Changed
- Entrada ES module: `main.js` → `createApp` → `installRuntime`.
- Toasts: `toastGen`, timers canceláveis, fallback 220ms sob `prefers-reduced-motion`.
- Views registradas em `src/js/views/*`; HTML de tela ainda centralizado no runtime IIFE.

---

# CHANGELOG — Mutirão · Recife

## [1.10.2] — Trava de responsividade mobile — 2026-11-13

### Fixed
- **Painéis no celular.** A largura ampliada do desktop (`min(560px, 48vw)`, até 600px, fixa em 560px a partir de 1250px) permanece **somente** em `@media (min-width: 960px)`.
- Abaixo de 960px, `layout/mobile-lock.css` (último `@import` de `app.css`) força painel e mapa a `width: 100%`, `min-width: 0`, `max-width: 100%`.
- **Causa estrutural:** `responsive-fix.css` era importado antes de `components/ui.css`. A grade `.stats { repeat(3, 1fr) }`, a galeria (`.ph-item { flex: 0 0 220px }`) e o `min-width: auto` de itens de grid/flex voltavam a impor o min-content e empurravam a janela para fora da viewport. Corrigir só no `responsive-fix` não bastava: a cascata posterior ganhava.
- Tabbar de 5 colunas usa `minmax(0, 1fr)` e a pílula ativa não passa de 64px no mobile, para não alargar o documento.
- Botões no mobile: `white-space: normal` (o UA de `button` é `nowrap`).

### Unchanged (desktop)
- Nenhuma regra de `mobile-lock.css` vale em `min-width: 960px`.
- Painel esquerdo, mapa deslocado e toast desktop permanecem os da 1.10.1.

---

## [1.10.1] — Painel desktop mais largo e legenda com X — 2026-11-13

### Changed
- Painel desktop: `width: min(560px, 48vw)`; `min-width: min(420px, 100%)`; `max-width: 600px`.
- A partir de 1250px: painel e `mapwrap.left` fixos em **560px**.
- Legenda: chevron `#i-chev` substituído por `#i-close` (classe `.legend-close`).

### Note
- O registro 1.10.0 abaixo cita `min(440px, 42vw)`. Esse valor foi intermediário e **não** é o da árvore atual.

---

## [1.10.0] — Auditoria UI/UX, responsividade e acessibilidade — 2026-11-13

### Fixed
- **Conta:** cabeçalho reorganizado (avatar + nome + Sair; ações em grade). Botões Mensagens/Líder não estouram mais a largura do painel.
- **Overflow horizontal:** painéis, modais, formulários e listas com `min-width:0`, `overflow-x:hidden` e `overflow-wrap`.
- **Mobile fullscreen:** ranking, conta, F1 e demais telas usam coluna flex com rolagem vertical apenas.
- **Botões em `.row`:** passam a quebrar de linha em telas estreitas (50%/100% conforme breakpoint).
- **Stats / cats / coupon:** adaptam grade e tipografia em telas pequenas.

### Added
- `src/css/layout/responsive-fix.css` — correções sistemáticas de layout, tablet e a11y (área de toque ≥44px).
- Ajuda contextual, Voltar/Fechar e dimensionamento de modal/menu (1.9.x) mantidos.

### Changed
- Painel desktop: largura `min(440px, 42vw)` com mapa alinhado.
- Toast desktop reposicionado em função da largura do painel.

---

[1.9.0] — Modularização ES modules do JavaScript — 2026-11-12

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
