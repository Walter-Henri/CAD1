# Design System — Mutirão · Recife

**Fonte canônica:** [`src/css/tokens/design-tokens.css`](../src/css/tokens/design-tokens.css)

Qualquer mudança de marca (cores, tipografia base, raios, sombra, tema escuro) deve começar neste arquivo.

---

## Tokens

### Tipografia

| Token | Valor |
|---|---|
| `--font` | Nunito, system UI rounded |

Pesos usados no produto: 600–900 (Google Fonts no `index.html`).

### Cores — tema claro (`:root`)

| Token | Hex | Papel |
|---|---|---|
| `--bg` | `#F3F5FC` | Fundo da app |
| `--surface` | `#FFFFFF` | Cartões, painel |
| `--surface-2` | `#EAEFFA` | Hover / secundário |
| `--ink` | `#0B0B0F` | Texto principal |
| `--ink-2` | `#3F3F46` | Texto secundário |
| `--line` / `--line-soft` | cinzas | Bordas |
| `--primary` | `#1E3A8A` | Ações primárias / topbar |
| `--accent` | `#FFD400` | Destaque / FAB adicionar |
| `--ok` / `--warn` / `--err` | verde / âmbar / vermelho | Feedback |
| `--sea` / `--land` / `--morro` | mapa | Água, terra, encostas |

### Cores — tema escuro

Definidas em:

1. `@media (prefers-color-scheme: dark)` com `:root:not([data-theme="light"])`  
2. `:root[data-theme="dark"]`  

O JS grava `data-theme` em `document.documentElement` e `localStorage['mutirao.theme']`.

### Forma

| Token | Uso |
|---|---|
| `--r-sm` 10px | Chips, pequenos controles |
| `--r` 16px | Cards, inputs |
| `--r-lg` 22px | Folhas / painéis |
| `--shadow` | Elevação padrão |

### Breakpoint

| Nome | Valor | Onde |
|---|---|---|
| Desktop shell | `960px` | `layout/shell.css` (tabbar some, topnav aparece) |
| Pickbar | `768px` / `767px` | `components/pickbar.css` |

Token informativo: `--bp-desktop: 960px` (documentação; media queries ainda usam literais para compatibilidade).

---

## Arquivos CSS por papel

| Arquivo | Responsabilidade |
|---|---|
| `tokens/design-tokens.css` | Variáveis e temas |
| `base/reset.css` | html/body, ícones, focus |
| `base/animations.css` | `@keyframes`, microinterações |
| `layout/shell.css` | Topbar, app, panel, mapwrap, tabbar |
| `components/ui.css` | Botões, forms, cards, ranking, detalhe, conta |
| `components/overlays.css` | Modal, toast, SV, galeria |
| `components/pickbar.css` | Fluxo de escolha de local |
| `map/chrome.css` | FAB, menu, legenda |
| `map/markers.css` | Pins de problema |
| `map/layers.css` | Polígonos, clusters, riscos, Leaflet |
| `features/fase1.css` | Pânico, obras, tabbar 5 colunas |
| `vendor.css` | Leaflet + MarkerCluster (terceiros) |
| `app.css` | Apenas `@import` na ordem da cascata |

```mermaid
flowchart TB
  DS[design-tokens.css] --> ALL[Demais módulos usam var(--*)]
  ALL --> UI[Componentes]
  ALL --> MAP[Mapa]
  ALL --> F1[Fase 1]
```

---

## Como reestilizar com segurança

1. Alterar só tokens para rebrand.  
2. Se precisar de exceção por componente, editar o arquivo do domínio — não copiar cores literais novas em cinco arquivos.  
3. Preferir `var(--primary)` a `#1E3A8A` espalhado (legado no topbar ainda usa hex fixo por contraste garantido sobre azul).  
4. Testar tema claro, escuro e `prefers-reduced-motion`.  
5. Nunca sobrescrever `.mapwrap { position:absolute; inset:0 }`.


## Layout responsivo (1.10)

- Breakpoints: 380px (estreito), 600px (tablet), 960px (desktop).
- Painel desktop: `min(440px, 42vw)`, máximo 480px.
- Mobile fullscreen: `display:flex; flex-direction:column; overflow-x:hidden`.
- Toque mínimo: 44×44px em botões e ícones de ação.
- Módulo: `src/css/layout/responsive-fix.css`.
