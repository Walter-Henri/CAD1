# Relatório de auditoria UI/UX — Mutirão · Recife (1.10.0)

Data: 2026-11-13

## Problemas identificados

| Área | Problema |
|------|----------|
| Conta | Cabeçalho com avatar + 2 botões + título + Sair na mesma linha; conteúdo cortado e/ou rolagem horizontal |
| Painéis mobile | Fullscreen sem contenção de overflow-x; textos e botões podiam ultrapassar a largura |
| `.row` de ações | `flex: 1 1 140px` em painéis estreitos gerava rolagem lateral (detalhe, forms) |
| Stats / coupon | Números e códigos longos sem quebra adequada |
| Modal / menu | Altura e largura inconsistentes em telas baixas |
| Detalhe (prévio) | Folha limitada a 74% da altura |

## Correções implementadas

1. **Conta** — HTML reestruturado (`conta-head`, `conta-id`, `conta-actions`).
2. **`responsive-fix.css`** — overflow, `min-width: 0`, `overflow-wrap`, breakpoints:
   - ≤380px: stats empilhados; botões full width
   - ≤959px: painéis em coluna; ações empilhadas; cats 2 colunas
   - 600–959px: tablet (2 colunas em ações)
   - ≥960px: painel `min(440px, 42vw)`
3. **Acessibilidade** — área de toque mínima 44px; foco já existente em `reset.css`; `touch-action: manipulation`.
4. **Modal/menu/help** — max-height com rolagem vertical; scrim com safe-area.

## Componentes e telas revisados

- Shell: topbar, panel, tabbar, mapwrap
- Conta / Login
- Mapa, Detalhe, Ranking, Votação
- Adicionar / Sucesso / Pickbar
- Alertas, Pânico, Obras, Mensagens, Líder
- Modal, menu “Mais ações”, toast, galeria

## Testes realizados (revisão de CSS + estrutura)

| Cenário | Resultado esperado |
|---------|-------------------|
| Mobile ~360px — Conta | Sem overflow-x; ações empilhadas; rolagem vertical |
| Mobile — Detalhe | Ações em 2 colunas ou 100% ≤380px; ficha rolável |
| Tablet 768px | Ações em 2 colunas; cats 3 colunas |
| Desktop ≥960px | Painel lateral estável; mapa deslocado |
| Modal filtros / ajuda | Cabe na viewport; rolagem interna se necessário |

*Nota:* ambiente de build sem browser automatizado; validação visual final recomendada no dispositivo real.

## Pontos que ainda merecem atenção

- Validar contraste fino no tema escuro em monitores de baixo brilho.
- Tabbar com 5 itens em aparelhos muito estreitos (rótulos curtos já em 10px).
- Fotos do usuário em base64 podem pesar o scroll em aparelhos antigos.
