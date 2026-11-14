# Visão geral do sistema — Mutirão · Recife (1.11.2)

## Propósito

Protótipo front-end de mapa cidadão para Recife: moradores registram problemas urbanos, apoiam pontos existentes e participam da votação mensal que orienta a associação de moradores.

## Princípios

1. **Sem backend** — estado em `localStorage`; dados geográficos e seed em JS estático.
2. **Ver livre, agir com conta** — mapa e ranking públicos; mutações sensíveis passam por `need()`.
3. **Mobile-first com desktop reforçado** — tabbar no mobile; painel lateral largo no desktop (≥960px).
4. **Tema claro padrão** — escuro só por escolha explícita do usuário.
5. **Acessibilidade prática** — alvos ≥44px, `?` de ajuda, onboarding, tipografia legível.

## Arquitetura lógica

| Camada | Responsabilidade | Arquivos-chave |
|--------|------------------|----------------|
| Shell | HTML, sprite SVG, tabbar, maptools | `index.html` |
| Estilo | Tokens, layout, mapa, UI, mobile-lock | `src/css/**` |
| Boot | ES module entry | `modules/main.js`, `createApp.js` |
| Runtime | Mapa Leaflet, estado `S`, views, binds | `install/runtime.js` (~1500 linhas) |
| UI auxiliar | Toast, ajuda, sheet-bar | `ui/toast.js`, `ui/help.js` |
| Dados | GeoJSON bairros/vizinhos, seed, riscos | `data/*.js` |
| Serviços | Nominatim, GPS, share | `services/*.js` |

## Ciclo de vida

1. Bootstrap de tema (`light` se não houver `mutirao.theme`).
2. Scripts clássicos (data + core) e módulo `main.js`.
3. `createApp()` monta o bag da aplicação; `installRuntime` registra mapa, handlers e `boot`.
4. `boot()`: legenda, markers, hash/rota, `maybeOnboard()`.
5. Interação: `go` / `renderPanel` / `bindPanel` / `sheetBar`.

## Fronteiras

- **Não** autentica em servidor.
- **Não** envia ocorrências à prefeitura automaticamente.
- Integrações externas são somente leitura (tiles, geocode) ou links (WhatsApp, Street View).

## Documentos relacionados

- [DIAGRAMS.md](DIAGRAMS.md)
- [DATA_AND_FLOWS.md](DATA_AND_FLOWS.md)
- [../DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md)
- [../DEVELOPMENT/CHANGELOG.md](../DEVELOPMENT/CHANGELOG.md)
