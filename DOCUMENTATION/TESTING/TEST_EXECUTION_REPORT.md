# Relatório de Testes — Mutirão · Recife

Atualizado em **2026-11-12**.

## Baseline mapa (2026-11-05) — 24 checks estáticos

Cobria tiles, world mask, layout e sintaxe. **Não** cobria Fase 1 nem toasts.

Sintaxe atual: `node --check` em `app.js` e módulos `core/` + `services/` → exit 0.

## Fase 1 + 1.7.1 — verificação manual / estática

| Área | Resultado |
|---|---|
| Símbolos F1 (views, saveP/O/M, markers) | Presentes |
| `bindNewFeatures` no fim de `bindPanel` | Sim |
| Boot chama `renderPanicoMarkers` + `renderObraMarkers` | Sim |
| CSS mobile lista views F1 | Sim |
| `core/toast.js` com gen + fallback | Sim |
| `app.js` delega `toast` → `Mutirao.toast` | Sim |
| Ordem de scripts no `index.html` | core → services → views → app |
| Timer: toast B não é escondido pelo timer de A | Pass (teste unitário de lógica) |

## Ainda sem prova automatizada de runtime no browser

- Fluxo completo pânico / obra / mensagem no dispositivo  
- Visual do painel mobile em cada `data-view` F1  
- Nominatim real  

## Regressões a vigiar

- Não remover o fallback de toast  
- Não tirar `bindNewFeatures` de `bindPanel`  
- Não encolher a lista de `data-view` do painel mobile  
