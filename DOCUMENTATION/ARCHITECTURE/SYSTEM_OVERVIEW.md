# Arquitetura — Mutirão · Recife

## Componentes e camadas

```
NAVEGADOR
  topbar(nav+busca+tema) │ panel(lateral) │ mapwrap(Leaflet) │ tabbar(mobile)
  pickbar(GPS+geocod+busca) │ #layer(overlays: SV, choropleth)

              ↓
  app.js IIFE — 987 linhas, 67 funções
  ┌──────────────────┬──────────────────┬──────────────────────┐
  │ Roteador         │ Renderizador     │ Mapa                 │
  │ go(view)         │ renderPanel()    │ buildWorldMask()     │
  │ hash routing     │ transPanel()     │ setBaseTile(dark)    │
  │ S.view           │ bindPanel()      │ renderMarkers()      │
  └──────────────────┴──────────────────┴──────────────────────┘
  ┌──────────────────┬──────────────────┬──────────────────────┐
  │ GPS+Geocoding    │ Choropleth       │ Estado + Persistência│
  │ getGPS()         │ renderChoropleth │ S { view,sel,user…}  │
  │ reverseGeocode() │ toggleChoropleth │ save() → localStorage│
  │ geocodeSearch()  │ _renderChoroLeg  │ 'mutirao.v1'         │
  └──────────────────┴──────────────────┴──────────────────────┘

              ↓ consome globais
  BAIRROS(94) · VIZINHOS(6) · SEED(40) · RISCOS(373) · ENV

              ↓ fetch sem API key
  OSM Tiles · Nominatim · Google SV iframe · WhatsApp wa.me
```

## Camadas do mapa Leaflet (z-index)

| z | Pane | Conteúdo |
|---|---|---|
| 600 | markerPane | Clusters + marcadores |
| 450 | maskPane* | World mask SVG (recorte geográfico) |
| 400 | overlayPane | VIZINHOS + BAIRROS + riskLayer + choropleth |
| 200 | tilePane | OSM tiles + CSS dark filter |

`* maskPane` criado via `map.createPane('maskPane')` — `L.polygon([outerBox, ...100 holes])`

## Fluxo: Adicionar Ponto

```
btnAdd → go('pick') → pickbar visível + pickpin
  │
  ├─ GPS → getGPS() → flyTo(lat,lng,16)
  ├─ Busca → geocodeSearch() → showPickSuggest() → flyTo
  └─ Arrastar mapa (crosshair fixo) → updatePick() em moveend
        ↓
  bairroAt(lat,lng) + reverseGeocode() debounce 900ms
        ↓
  "Confirmar" → S.draft = {lat,lng,b,r} → go('adicionar')
        ↓
  go('sucesso') → renderMarkers() → animação pin-drop
```

## Fluxo: Roteamento

```
URL hash → go(view) → transPanel(html) → bindPanel()
  Telas: mapa │ detalhe │ ranking │ votacao │ conta │ login
         adicionar │ sucesso │ pick
```

## Dependências de carregamento (index.html — ORDEM OBRIGATÓRIA)

```
leaflet.js → leaflet.markercluster.js
  → bairros.js → vizinhos.js → seed.js → riscos.js → env.js → app.js
```
⚠️ `app.js` é um IIFE que consome as globais `BAIRROS`, `VIZINHOS`, `SEED`, `RISCOS`, `ENV`.
Alterar esta ordem causa falha silenciosa.
