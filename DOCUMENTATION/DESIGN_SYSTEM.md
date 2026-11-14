# Design System — Mutirão · Recife (1.11.2)

Fonte canônica de tokens: [`src/css/tokens/design-tokens.css`](../src/css/tokens/design-tokens.css).

## Temas

| Tema | Ativação | Observação |
|------|----------|------------|
| **Claro** | Padrão (`data-theme="light"`) | Bootstrap no `index.html` se não houver `mutirao.theme` |
| **Escuro** | `data-theme="dark"` + `localStorage.mutirao.theme=dark` | Não segue mais o SO como padrão silencioso |

Toggle: botão sol/lua no topo (`toggleTheme` / `isDark`).

### Claro (resumo)

- Fundos: `--bg #EEF2F9`, `--surface #FFFFFF`, `--surface-2 #E8EEF8`
- Texto: `--ink #0B1220`, `--ink-2 #3D4A5C`
- Primária: `--primary #1E3A8A`
- Destaque: `--accent #FFD400` (amarelo Mutirão)

### Escuro (resumo)

- Fundos em camadas: `#0A0F1C` → `#141C2E` → `#1C2740`
- Texto alto contraste: `#F5F7FC` / `#B8C2D6`
- Primária legível: `#8FB0FF`
- Accent levemente suavizado: `#F5D000`

## Tipografia

- Família: Nunito / system-ui (`--font`)
- Corpo: **17px** (1.11.0+)
- Títulos de painel: ~28px; detalhe ~24px
- Botões: 17px, peso 800; altura mínima 52px

## Componentes visuais

| Classe | Papel |
|--------|-------|
| `.btn` / `.btn.acc` / `.btn.sec` / `.btn.ghost` | Ações primárias, secundárias, terciárias |
| `.card` | Superfície elevada |
| `.sheet-bar` | Chrome Voltar / ? / Fechar |
| `.toast` | Feedback temporário |
| `.modal` + `.scrim` | Diálogos |
| `.nav-hint-card` | Atalhos de menu na home |
| `.success-banner` | Confirmação pós-envio |
| `.onboard-steps` | Lista numerada do onboarding |
| `.fab` | Ações flutuantes no mapa (rótulos visíveis) |
| `.tabbar` | Navegação inferior mobile |

## Ícones

Sprite SVG em `index.html` (`#i-*`). Helper `icon(name, cls)` em `core/util.js` / `lib/dom.js`.

## Mapa

- `--sea`, `--land`, `--morro`, máscara `.world-mask`
- Controles zoom/atribuição respeitam tokens no tema escuro

## Regras ao alterar cores

1. Mudar **somente** `design-tokens.css` (e trechos explicitamente temáticos em `map/layers.css`).
2. Não hardcodar hex em views salvo exceções de marca (ex.: pino amarelo do pick).
3. Validar contraste de texto/botão nos dois temas.
