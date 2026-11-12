# Arquitetura — Mutirão · Recife

Conferido em 2026-11-12. Detalhe F1: [`../FASE1.md`](../FASE1.md). JS: [`../../src/js/STRUCTURE.md`](../../src/js/STRUCTURE.md).

## Camadas

```
NAVEGADOR
  topbar · #panel · mapwrap (Leaflet) · tabbar (5 colunas mobile)
  pickbar · #layer (modal / Street View)

              ↓
  Scripts clássicos
  core (util, constants, toast) → services → views (registry) → app.js IIFE

  app.js
  ┌─────────────┬──────────────┬─────────────────┐
  │ go / NAVOF  │ renderPanel  │ map + layers    │
  │ transPanel  │ bindPanel    │ world mask      │
  │             │ bindNewFeatures              │
  └─────────────┴──────────────┴─────────────────┘
  ┌─────────────┬──────────────┬─────────────────┐
  │ GPS/Nominatim│ choropleth  │ S + localStorage│
  └─────────────┴──────────────┴─────────────────┘
  Fase 1: panics, obras, messages · pgLayer · ogLayer

  Globais data: BAIRROS · VIZINHOS · SEED · RISCOS · ENV
  Namespace: window.Mutirao (toast, util, constants, services)
```

## Toast

```
toast(msg, ic)
  → Mutirao.toast (core/toast.js)
  → gen++ ; clear timers
  → show 3,1s → toast-out + fallback 220ms
  → hidden (só se gen atual)
```

## Bind do painel

```
transPanel(html)
  → bindPanel()
       → listeners base + Conta
       → bindNewFeatures(S.view, on)   // F1
```

## Fluxos resumidos

**Ponto comum:** `startAdd` → pick → adicionar → `submitAdd` → markers + panico/obra markers  

**Pânico:** FAB → panicoAdd → pick (`_returnTo`) → saveP → markers  

**Obra:** obras → obraAdd → saveO → status via `computeObraStatus`  

**Líder:** Conta → goLider (role) → vLider (msgs do bairro + obras)  

## Painel por viewport

| Viewport | Comportamento |
|---|---|
| ≥ 960px | Painel 420px; tabbar oculta; topnav sem Alertas/Obras (menu/Conta) |
| &lt; 960px | Tela cheia para ranking, votação, conta, adicionar, sucesso **e** todas as views F1 |

## Scripts (ordem obrigatória)

```
leaflet → markercluster
→ bairros → vizinhos → seed → riscos → env
→ core/util → constants → toast
→ services/geocode → gps → share
→ views/*
→ app.js
```
