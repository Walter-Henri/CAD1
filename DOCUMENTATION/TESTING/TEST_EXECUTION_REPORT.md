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

## 1.10.2 — responsividade (estático)

| Checagem | Resultado |
|----------|-----------|
| `mobile-lock.css` é o último `@import` de `app.css` | Sim |
| Regras de largura do painel nesse arquivo estão dentro de `max-width: 959.98px` | Sim |
| Desktop `min(560px, 48vw)` permanece em `shell.css` / `responsive-fix.css` | Sim |
| `node --check src/js/modules/install/runtime.js` | Executar na entrega |
| Browser automatizado | Não há neste repositório |

Procedimento manual: [`../DEVELOPMENT/RESPONSIVE.md`](../DEVELOPMENT/RESPONSIVE.md).


- Não remover o fallback de toast  
- Não tirar `bindNewFeatures` de `bindPanel`  
- Não encolher a lista de `data-view` do painel mobile

---

## Bateria sugerida pós-1.11.2 (manual)

| # | Caso | Esperado |
|---|------|----------|
| 1 | Limpar site data e abrir app | Tema claro; onboarding etapa 1 sem X |
| 2 | Entendi → Sim, não mostrar | Não reaparece após F5 |
| 3 | Entendi → Não, continuar | Reaparece após F5 |
| 4 | Publicar ponto | Toast + banner sucesso |
| 5 | Ranking → Votar neste | Abre votação na RPA |
| 6 | Mobile mapa | Sem OSM “gigante” sob máscara |
| 7 | Alternar tema | Escuro legível; preferência persiste |
| 8 | `?` em qualquer tela | Ajuda contextual |
