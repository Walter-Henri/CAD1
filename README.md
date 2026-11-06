# Mutirão · Recife — E7 Protótipo v1

Mapa colaborativo de problemas de bairro no Recife. Moradores marcam barreiras, alagamentos, buracos e obras paradas; a associação leva os mais votados ao vereador.

> **Para IAs e desenvolvedores:** leia [`DOCUMENTATION/AI_CONTEXT_GUIDE.md`](DOCUMENTATION/AI_CONTEXT_GUIDE.md) antes de modificar qualquer arquivo.

## Stack

Vanilla HTML + CSS + JavaScript (sem framework, sem bundler).  
Mapa: Leaflet 1.9.4 + OpenStreetMap tiles (sem API key).  
Geocodificação: Nominatim OSM (sem API key).

## Estrutura

```
mutirao/
├── index.html              # Entrada (HTML + SVG sprite + script tags)
├── src/
│   ├── css/
│   │   ├── vendor.css      # Leaflet + MarkerCluster CSS
│   │   └── app.css         # Estilos da aplicação (818 linhas)
│   └── js/
│       ├── app.js          # Toda a lógica (987 linhas, 67 funções)
│       └── data/
│           ├── bairros.js  # 94 bairros do Recife (GeoJSON)
│           ├── vizinhos.js # 6 municípios adjacentes (GeoJSON)
│           ├── seed.js     # 40 pontos de exemplo
│           ├── riscos.js   # 373 pontos reais (Defesa Civil/Sedec)
│           └── env.js      # Variáveis de ambiente (stub)
├── scripts/
│   └── inject-env.mjs      # Gera env.js no build
├── DOCUMENTATION/
│   ├── AI_CONTEXT_GUIDE.md           # Guia central para IAs
│   ├── ARCHITECTURE/SYSTEM_OVERVIEW.md
│   ├── BUGFIXES/BUGFIX_REPORT.md
│   ├── TESTING/TEST_EXECUTION_REPORT.md
│   └── DEVELOPMENT/CHANGELOG.md
├── package.json
├── vercel.json
└── .env.example
```

## Rodar localmente

```bash
npm run dev       # gera env.js + serve em localhost
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

- Mapa vetorial de Recife + 6 municípios da RMR
- World mask: tiles OSM visíveis apenas nas cidades do GeoJSON
- Adicionar pontos com GPS, busca de endereço (Nominatim) e crosshair
- Apoiar, notar, compartilhar problemas
- Street View integrado por ponto
- Mapa de calor (choropleth) por bairro
- Compartilhar via WhatsApp
- Camada de riscos oficiais (Defesa Civil 2024)
- Ranking, votação mensal, conta de usuário
- Tema claro/escuro com persistência

## Persistência

| Chave localStorage | Conteúdo |
|---|---|
| `mutirao.v1` | Estado completo (pontos, apoios, notas, fotos, votos) |
| `mutirao.theme` | Preferência de tema (`'light'` / `'dark'`) |
