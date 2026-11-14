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

## Adendo 1.10.1 — largura desktop e legenda

- Painel desktop passou de `min(440px, 42vw)` para `min(560px, 48vw)` (máx. 600px; 560px fixos ≥1250px). Esse é o visual aprovado no computador. A linha “≥960px: painel min(440px, 42vw)” acima é o registro da 1.10.0, superado.
- Legenda: ícone X (`.legend-close` / `#i-close`) no lugar do chevron.

## Adendo 1.10.2 — o desktop largo vazou para o celular

**Sintoma:** as janelas que no desktop ficam à esquerda passavam da borda do smartphone.

**Causa:** não foi reduzir o media query. `ui.css` carrega depois de `responsive-fix.css` e restaura min-content (`.stats` com `1fr`, galeria com base 220px, botão `nowrap`). Itens de grid com `min-width: auto` alargam o painel.

**Correção:** `src/css/layout/mobile-lock.css` importado por último, só em `max-width: 959.98px`. Desktop não recebe essas regras.

**Telas que precisam caber em 360px e 390px:** Conta, Detalhe, Ranking, Votação, Adicionar, Sucesso, Alertas, Pânico (lista, form, detalhe), Obras (lista, form, detalhe), Mensagens, Líder, modal de ajuda, menu, legenda, pickbar.

**Aceite desktop:** em 1280px e 1440px a coluna continua a da 1.10.1. Se um ajuste mobile mudar essa coluna, a entrega está errada.


---

## Atualização 1.11.x (2026-11-14)

| Achado usabilidade | Tratamento |
|--------------------|------------|
| Falta de feedback pós-envio | Toast + `.success-banner` na view sucesso |
| Pouca didática / primeira visita | Onboarding 2 etapas + `?` contextual |
| Menu pouco visível | `.nav-hint-card` + FABs rotulados + tabbar |
| Ícones sem rótulo | Tab labels + `.fab-lbl` |
| Fontes pequenas | Base 17px, títulos maiores |
| Medo de errar no form | Texto de reasssurance + Limpar textos |
| Guia de descrição | Placeholders de tamanho/tempo/risco |
| Voto só em tela separada | “Votar neste problema” no ranking |
| X inconsistente | Um chrome de fechar; onboarding sem X |

Critérios de aceite: ver CHANGELOG 1.11.0–1.11.2.
