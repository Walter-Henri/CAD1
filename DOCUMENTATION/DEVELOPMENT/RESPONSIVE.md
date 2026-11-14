# Responsividade — Mutirão · Recife (1.11.2)

## Breakpoints

| Largura | Comportamento |
|---------|----------------|
| **≥ 1250px** | Painel ~560px fixo; mapa à direita |
| **≥ 960px** | Desktop: painel `min(560px, 48vw)`, max 600px; tabbar oculta; topnav |
| **600–959px** | Tablet: painéis full; stats em 3 colunas quando cabe |
| **≤ 959.98px** | Mobile: `mobile-lock.css` força largura 100%; tabbar visível |
| **≤ 380px** | Stats empilham em 1 coluna |

Arquivos: `layout/shell.css`, `layout/responsive-fix.css`, `layout/mobile-lock.css` (**último** `@import` em `app.css`).

## Problema resolvido: mapa “gigante” no mobile

`max-width: 100%` genérico em `img`/`svg` esmagava o overlay Leaflet (máscara/bairros) e deixava o OSM desalinhado por baixo.

**Correção:** em `mobile-lock.css`, tiles, panes, markers e SVG do Leaflet usam `max-width: none !important`; `.mapwrap` / `#map` com `overflow: hidden`.

## Painéis

- Mobile: bottom-sheet / full viewport conforme `data-view`
- Desktop: coluna esquerda; conteúdo com `min-width: 0` e scroll interno
- Detalhe: altura máxima com `overflow-y: auto` para não cortar conteúdo

## Tabbar e FABs

- Tabbar: Mapa, Ranking, Alertas, Obras, Conta (rótulos de texto)
- FABs: Adicionar ponto, Perigo agora, Mais ações (rótulos `.fab-lbl`)

## Testes manuais sugeridos

1. 360×800: mapa sem faixa de tiles “vazando”; painéis sem scroll horizontal indesejado.
2. 960×800 e 1280×800: painel legível (~560px), mapa ao lado.
3. Rotacionar tablet: `invalidateSize` / `fitRecife` após resize (já ligados ao fluxo de mapa).
