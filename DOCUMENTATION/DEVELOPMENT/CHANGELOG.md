# CHANGELOG — Mutirão · Recife

## [Unreleased] — 2026-11-05

### Fixed (8 bugs CSS corrigidos)
- BUG-001: `.search input` + form inputs sem `color:var(--ink)` → texto invisível no tema claro
- BUG-002: `.b-poly` duplicata com `fill-opacity:.95` sobrescrevia `.35`
- BUG-003: `.mapwrap{position:relative}` (2ª ocorrência) colapsava o mapa
- BUG-004: `.pickbar` duplicata com z-index:850 conflitava
- BUG-005: `.mk.sel .pin` regra antiga com `border-color:#0B0B0F`

### Removed (dead code)
- 8 comentários-placeholder de sessões anteriores
- `.nomorro .b-poly.morro` redundante
- `.b-poly:hover` incompleto (supersedido)
- `.mk.sel .pin` antigo (conflito com regra --pc)

## [1.6.0] — GPS + Geocodificação + Choropleth + WhatsApp

### Added
- `getGPS()` via `navigator.geolocation` com spinner
- `reverseGeocode(lat,lng)` — Nominatim, debounce 900ms
- `geocodeSearch(q)` — Nominatim, debounce 500ms
- Pickbar redesenhada: busca + GPS + endereço + coordenadas
- `renderChoropleth()` — mapa de calor por bairro (azul→amarelo→vermelho)
- `shareWhatsApp(p)` — mensagem formatada → `wa.me/?text=`
- Ícones `i-whatsapp`, `i-gps`

## [1.5.0] — OSM + World Mask

### Changed
- Tiles CARTO → **OpenStreetMap** (sem API key)
- Dark mode: CSS `filter: invert(100%) hue-rotate(180deg)`

### Added
- `buildWorldMask()` — polígono com 100 holes (94+6) recorta o mapa
- `maskPane` z-index 450

## [1.4.0] — Design profissional + Riscos Defesa Civil

### Added
- Tiles CARTO `voyager_nolabels` / `dark_nolabels`
- `toggleRiskLayer()` — 373 pontos reais Sedec/PCR
- Cores por RPA nos polígonos (`.rpa-1` a `.rpa-6`)
- Clusters 3-tier com anel e halo

## [1.3.0] — UX + Microinterações

### Added
- `transPanel()` com animação CSS
- `flyTo()` suave
- Tabbar com pill expansível 48→72px + `.tab-press`
- `openSVLayer()` — Street View iframe overlay

## [1.2.0] — Multi-arquivo + Dark/Light toggle

### Changed
- Projeto refatorado: HTML monolítico → multi-arquivo

### Added
- `toggleTheme()` + script anti-flash
- `i-sun`, `i-moon`

## [1.0.0] — Protótipo E7 v1

### Added
- Mapa Leaflet, 94 bairros, 40 pontos seed
- Adicionar / apoiar / notar pontos
- Ranking, votação, conta
- localStorage persistence
