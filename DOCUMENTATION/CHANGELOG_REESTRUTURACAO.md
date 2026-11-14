# Changelog da reestruturação de infraestrutura

**Data:** 2026-11-12

## CSS

### Antes
- Um único `src/css/app.css` (~895 linhas) com tokens, layout, componentes, mapa e Fase 1.

### Depois
- `app.css` virou **ponto de entrada** com `@import` ordenados.
- Módulos:
  - `tokens/design-tokens.css`
  - `base/reset.css`, `base/animations.css`
  - `layout/shell.css`
  - `components/ui.css`, `overlays.css`, `pickbar.css`
  - `map/chrome.css`, `markers.css`, `layers.css`
  - `features/fase1.css`
- `vendor.css` inalterado (Leaflet).

### Preservação
- Seletores e regras copiados do monolito (split mecânico).  
- `index.html` continua referenciando `src/css/app.css`.

## Documentação

- Criado `DOCUMENTACAO_INFRAESTRUTURA.md` (visão completa + Mermaid).  
- Criados `DESIGN_SYSTEM.md`, `AI_GUIDELINES.md`, este arquivo.  
- Guias anteriores (FASE1, AI_CONTEXT, STRUCTURE) permanecem válidos e referenciados.

## JS

- Sem nova quebra de IIFE nesta etapa (já modularizado em core/services/views nas sessões 1.7.x).

## Validação

- Arquivos CSS presentes; cadeia de import revisada.  
- Browser E2E visual **não** automatizado neste ambiente — recomenda-se smoke manual (mapa + toast + uma view F1).

---

## Continuação pós-reestruturação

A partir de **1.10**, o histórico unificado está em [`DEVELOPMENT/CHANGELOG.md`](DEVELOPMENT/CHANGELOG.md) (inclui 1.10.x UI/UX, 1.11.x usabilidade, temas e onboarding).
