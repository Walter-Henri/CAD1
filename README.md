# Mutirão · Recife — E7 Protótipo

Mapa colaborativo de problemas de bairro no Recife. Moradores marcam barreiras, alagamentos, buracos e obras paradas; a associação leva os mais votados ao vereador. A Fase 1 acrescenta emergência (pânico), fiscalização de obra pública e mensagem ao líder de bairro.

> **Para IAs e desenvolvedores:** leia [`DOCUMENTATION/AI_CONTEXT_GUIDE.md`](DOCUMENTATION/AI_CONTEXT_GUIDE.md) antes de modificar qualquer arquivo.  
> **Infraestrutura:** [`DOCUMENTACAO_INFRAESTRUTURA.md`](DOCUMENTACAO_INFRAESTRUTURA.md)  
> **Fase 1:** [`DOCUMENTATION/FASE1.md`](DOCUMENTATION/FASE1.md) · **JS modular:** [`src/js/STRUCTURE.md`](src/js/STRUCTURE.md)

## Stack

Vanilla HTML + CSS + JavaScript (sem framework, sem bundler).  
Mapa: Leaflet 1.9.4 + OpenStreetMap tiles (sem API key).  
Geocodificação: Nominatim OSM (sem API key).  
Namespace global: `window.Mutirao` (core + services).

## Estrutura

```
mutirao/
├── index.html                 # Entrada — 181 linhas (HTML + SVG + scripts)
├── src/
│   ├── css/
│   │   ├── vendor.css              # Leaflet + MarkerCluster
│   │   ├── app.css                 # Entrada (@import dos módulos)
│   │   ├── tokens/design-tokens.css
│   │   ├── base/{reset,animations}.css
│   │   ├── layout/shell.css
│   │   ├── layout/responsive-fix.css  # overflow, breakpoints, a11y
│   │   ├── components/{ui,overlays,pickbar}.css
│   │   ├── map/{chrome,markers,layers}.css
│   │   └── features/fase1.css
│   └── js/
│       ├── core/
│       │   ├── util.js        # $, esc, icon, norm, hash, tempo, fmt
│       │   ├── constants.js   # CATS, STATUS, RPA, PANICO_*, OBRA_ST, NAVOF
│       │   └── toast.js       # toast() com auto-dismiss (canônico)
│       ├── services/
│       │   ├── geocode.js     # reverseGeocode, geocodeSearch
│       │   ├── gps.js         # getGPS
│       │   └── share.js       # helpers de compartilhamento
│       ├── views/             # registro por tela (ver views/README.md)
│       ├── data/              # bairros, vizinhos, seed, riscos, env
│       ├── app.js             # mapa, estado, rotas, views, bind, boot (~1405 linhas, 85 funções)
│       └── STRUCTURE.md
├── scripts/inject-env.mjs
├── DOCUMENTATION/
│   ├── AI_CONTEXT_GUIDE.md
│   ├── FASE1.md
│   ├── ARCHITECTURE/SYSTEM_OVERVIEW.md
│   ├── BUGFIXES/BUGFIX_REPORT.md
│   ├── TESTING/TEST_EXECUTION_REPORT.md
│   └── DEVELOPMENT/CHANGELOG.md
├── package.json
├── vercel.json
└── .env.example
```

## Ordem de scripts (`index.html`)

1. Leaflet + MarkerCluster (CDN)  
2. `data/*` → globais `BAIRROS`, `VIZINHOS`, `SEED`, `RISCOS`, `ENV`  
3. `core/util` → `core/constants` → `core/toast`  
4. `services/geocode` → `gps` → `share`  
5. `views/*` (registro de telas)  
6. `app.js` (IIFE; `toast` delega a `Mutirao.toast`)

## UI/UX (1.10)

Auditoria de dimensionamento, responsividade e acessibilidade: ver [`DOCUMENTATION/TESTING/UIUX_AUDIT_REPORT.md`](DOCUMENTATION/TESTING/UIUX_AUDIT_REPORT.md).

## Rodar localmente

```bash
npm run dev       # gera env.js + serve
# ou
npx serve .
# ou
python3 -m http.server 8080
```

## Deploy na Vercel

1. Suba no GitHub  
2. Importe no Vercel — **Framework:** `Other` (static)  
3. **Root Directory:** `.` | **Build Command:** `node scripts/inject-env.mjs` | **Output:** `.`  
4. Deploy  

## Funcionalidades

**Base**

- Mapa vetorial de Recife + 6 municípios da RMR  
- World mask (tiles só nas cidades do GeoJSON)  
- Pontos com GPS, Nominatim e crosshair  
- Apoiar, notar, fotos, Street View, WhatsApp  
- Choropleth, riscos oficiais (Defesa Civil), ranking, votação, conta  
- Tema claro/escuro  

**Fase 1**

- **Pânico:** FAB, tipos, gravidade, marcadores pulsantes, resolver  
- **Obras:** cadastro, status por datas/conclusão, histórico  
- **Líder:** mensagens e painel (autoativação de `role`)  
- **Hub Alertas** na tabbar (5 abas no mobile)  

**Correções recentes (1.7.1)**

- Toasts somem sozinhos (fallback se `animationend` não dispara)  
- `bindNewFeatures` ligado a cada `bindPanel`  
- Marcadores de pânico/obra no boot  
- Painel mobile em tela cheia para as views da Fase 1  

## Persistência

| Chave localStorage | Conteúdo |
|---|---|
| `mutirao.v1` | user, mine, supported, notes, photos, votes, morro |
| `mutirao.theme` | `'light'` / `'dark'` |
| `mutirao.panics` | ocorrências de pânico (`S.panics`) |
| `mutirao.obras` | obras públicas (`S.obras`) |
| `mutirao.msgs` | mensagens ao líder (`S.messages`) |
