# 🧭 AI_CONTEXT_GUIDE — Mutirão · Recife

> **Propósito:** Guia permanente de contexto técnico para IAs e engenheiros.  
> Leia este arquivo antes de qualquer modificação no projeto.

---

## 1. O que é o projeto

**Mutirão** é um webapp comunitário de registro e acompanhamento de problemas urbanos em **Recife, PE, Brasil** (protótipo E7 v1).

Moradores marcam problemas no mapa (alagamentos, buracos, obras paradas, lixo, barreiras, esgoto). A associação de bairro usa os registros para pressionar vereadores e órgãos municipais. Ninguém cobra sozinho.

---

## 2. Stack técnica (implementada, verificada)

| Camada | Tecnologia | Notas |
|---|---|---|
| Linguagem | Vanilla JS (ES2017+) | Sem framework, sem bundler |
| HTML | HTML5 semântico | 1 arquivo, 158 linhas |
| CSS | CSS3 + Custom Properties | 818 linhas, 47 KB |
| Mapa | **Leaflet 1.9.4** | Via CDN cdnjs |
| Clusters | Leaflet.MarkerCluster 1.5.3 | Via CDN cdnjs |
| Tipografia | Nunito (Google Fonts) | 400–900 |
| Tiles | **OpenStreetMap** (sem API key) | Dark: CSS filter invert |
| Geocodificação | **Nominatim OSM** (sem API key) | Rate limit: 1 req/s |
| Deploy | **Vercel** (static) | buildCommand: inject-env.mjs |
| Dados | GeoJSON embutido | bairros, vizinhos, seed, riscos |
| Estado | **localStorage** (`mutirao.v1`) | Sem backend |

---

## 3. Estrutura de arquivos

```
mutirao/
├── index.html              ← ENTRADA — esqueleto HTML + SVG sprite + script tags
├── src/
│   ├── css/
│   │   ├── app.css         ← TODOS os estilos da aplicação (818 linhas, 47 KB)
│   │   └── vendor.css      ← Leaflet 1.9.4 + MarkerCluster 1.5.3 CSS (14 KB)
│   └── js/
│       ├── app.js          ← TODA a lógica da aplicação (987 linhas, 67 funções)
│       └── data/
│           ├── bairros.js  ← 94 bairros do Recife — GeoJSON + centróides + RPA (119 KB)
│           ├── vizinhos.js ← 6 municípios adjacentes GeoJSON (8 KB)
│           ├── seed.js     ← 40 pontos de exemplo do protótipo (6 KB)
│           ├── riscos.js   ← 373 pontos reais — Defesa Civil/Sedec PCR (186 KB)
│           └── env.js      ← Stub de variáveis de ambiente (257 B)
├── scripts/
│   └── inject-env.mjs      ← Gera env.js a partir de variáveis de ambiente no build
├── package.json            ← Scripts: build, dev, start
├── vercel.json             ← buildCommand + headers de segurança
├── .env.example            ← Template de variáveis (atualmente nenhuma obrigatória)
└── DOCUMENTATION/          ← Base de conhecimento técnico
```

**Ordem de carregamento dos scripts em index.html:**
```
leaflet.js → leaflet.markercluster.js → bairros.js → vizinhos.js → seed.js → riscos.js → env.js → app.js
```
⚠️ Esta ordem é obrigatória — `app.js` é um IIFE que consome as globais `BAIRROS`, `VIZINHOS`, `SEED`, `RISCOS`, `ENV`.

---

## 4. Arquitetura — visão geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.html                               │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐ │
│  │ SVG Sprite│  │              Leaflet Map                     │ │
│  │  (ícones) │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  └──────────┘  │  │ tilePane  │  │overlayPane│  │markerPane│  │ │
│                │  │ (OSM png) │  │(GeoJSON)  │  │(clusters)│  │ │
│  ┌──────────┐  │  └──────────┘  └──────────┘  └──────────┘  │ │
│  │  topbar  │  │                  ↑                            │ │
│  │  panel   │  │            maskPane z-450                     │ │
│  │  tabbar  │  │            (world mask SVG)                   │ │
│  │  pickbar │  └──────────────────────────────────────────────┘ │
│  └──────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
         ↓                           ↓
    app.js IIFE              Nominatim OSM API
  (estado S + go())          (geocodificação)
         ↓
  localStorage 'mutirao.v1'
```

---

## 5. app.js — estrutura interna (987 linhas, 67 funções)

O app inteiro é um **IIFE** (`(function(){ ... })()`). Não há módulos ES6. Variáveis como `map`, `bLayer`, `cg` são acessíveis por closure dentro do IIFE.

### Estado global `S`

```js
S = {
  view: 'mapa',           // tela ativa
  sel: null,              // ponto selecionado (id)
  user: null,             // { name, bairro }
  mine: [],               // ids dos pontos do usuário
  supported: Set,         // ids apoiados
  votes: {},              // votos mensais
  notes: {},              // notas por ponto
  photos: {},             // fotos por ponto
  rankMode: 'apoios',     // critério do ranking
  pending: null,          // voto pendente de confirmação
  draft: null,            // rascunho do ponto sendo adicionado
  lastAdded: null,        // id do último ponto adicionado
  morro: false,           // destaque de bairros de morro
  create: false,
}
```

### Funções críticas

| Função | Responsabilidade |
|---|---|
| `go(view)` | Roteador principal — atualiza `S.view`, `window.location.hash`, chama `renderPanel()`, atualiza tabbar |
| `renderPanel()` | Despacha para `vMapa()`, `vDetalhe()`, `vRanking()`, `vVotacao()`, `vConta()`, `vLogin()`, `vAdicionar()`, `vSucesso()` via `transPanel()` |
| `transPanel(html)` | Injeta HTML no `#panel` com animação CSS (90ms exit + 150ms enter); respeita `prefers-reduced-motion` |
| `bindPanel()` | Anexa todos os event listeners ao HTML renderizado no painel |
| `buildWorldMask()` | Cria polígono SVG (anel externo + 100 buracos) para recortar mapa apenas nas cidades do GeoJSON |
| `setBaseTile(dark)` | Inicializa/atualiza L.tileLayer OSM; aplica CSS filter para dark mode via `_applyTileTheme()` |
| `renderMarkers()` | Limpa e recria todos os marcadores no cluster group |
| `mkIcon(p, sel)` | Gera L.divIcon com cor da categoria via `--pc` CSS custom property |
| `updatePick()` | Atualiza bairro + coordenadas + reverse geocoding (debounce 900ms) no pickbar |
| `getGPS(cb)` | Obtém localização via `navigator.geolocation`; atualiza botão GPS com spinner |
| `reverseGeocode(lat,lng)` | Chama Nominatim OSM reverse; retorna endereço curto |
| `geocodeSearch(q)` | Chama Nominatim OSM search; retorna array de resultados |
| `toggleChoropleth()` | Liga/desliga mapa de calor por densidade de problemas nos bairros |
| `shareWhatsApp(p)` | Gera mensagem formatada e abre `wa.me/?text=...` |
| `openSVLayer(lat,lng,title)` | Abre overlay full-screen com iframe do Google Street View |
| `toggleRiskLayer()` | Carrega/exibe/esconde 373 pontos reais de risco (Defesa Civil/Sedec) |
| `toast(msg, ic)` | Exibe toast com animação entrada/saída |
| `save()` | Persiste estado em localStorage |

---

## 6. Fluxo de dados

```
Dados de entrada
  ├── GeoJSON (bairros.js, vizinhos.js, seed.js, riscos.js) — estáticos, carregados uma vez
  ├── Interações do usuário — eventos DOM
  ├── GPS nativo — navigator.geolocation
  └── Nominatim API — fetch (geocoding reverso + busca)

Estado em memória
  └── S (objeto único) → go() → renderPanel() → bindPanel()

Persistência
  └── localStorage.setItem('mutirao.v1', JSON.stringify(state))
      ├── user, mine, supported, notes, votes, morro
      └── photos (pode falhar; fallback sem fotos)

Saída visual
  ├── Leaflet map layers (tiles, GeoJSON, markers, mask)
  ├── Panel HTML (injetado por renderPanel)
  ├── Toast notifications
  └── Overlays (#layer div): Street View iframe, choropleth legend
```

---

## 7. Sistema de temas (claro/escuro)

- **Detecção:** `isDark()` → checa `document.documentElement.dataset.theme` ou `prefers-color-scheme`
- **Toggle:** `toggleTheme()` → atualiza `dataset.theme`, persiste em `localStorage('mutirao.theme')`, chama `setBaseTile(isDark())`
- **Anti-flash:** `<script>` inline no `<head>` lê `mutirao.theme` antes do primeiro render
- **Tiles OSM dark:** `_applyTileTheme(dark)` aplica `filter: invert(100%) hue-rotate(180deg) brightness(.9) contrast(.88) saturate(.85)` no `tilePane`
- **CSS vars:** `:root` (claro) + `@media prefers dark :root:not([data-theme=light])` + `:root[data-theme=dark]`

---

## 8. Mapa — arquitetura de camadas

```
z-index  Leaflet pane      Conteúdo
─────────────────────────────────────────────
 600     markerPane        Clusters + marcadores individuais
 450     maskPane*         World mask (recorte geográfico)
 400     overlayPane       VIZINHOS GeoJSON + BAIRROS GeoJSON + riskLayer + choropleth
 200     tilePane          OSM tiles (+ CSS dark filter)
─────────────────────────────────────────────
*maskPane criado via map.createPane('maskPane')
```

**World mask:** `L.polygon([outerBox, ...holes])` — anel externo cobre toda a RMR; os 100 buracos (94 bairros + 6 vizinhos) deixam os tiles aparecerem apenas nas cidades do GeoJSON.

---

## 9. Integrations

| Serviço | Uso | Chave necessária |
|---|---|---|
| OpenStreetMap tiles | Basemap claro/escuro | Não |
| Nominatim OSM | Reverse geocoding + busca de endereços | Não |
| Google Maps (wa.me) | Link de localização no WhatsApp | Não |
| Google Street View | iframe embed no detalhe do ponto | Não |
| WhatsApp (wa.me) | Compartilhamento de problemas | Não |

> **Zero dependências de API key para funcionar.** O `env.js` é um stub mantido para adições futuras.

---

## 10. Áreas de atenção — antes de modificar

| Área | Risco | Motivo |
|---|---|---|
| `.mapwrap` CSS | 🔴 Crítico | `position:absolute;inset:0` não pode ser sobrescrito; causou bug grave 2× |
| Ordem dos `<script>` | 🔴 Crítico | `app.js` depende de globais dos data files carregados antes |
| `S.view` routing | 🟡 Alto | `go()` é o único ponto de entrada; alterar fora dele quebra estado |
| `bindPanel()` | 🟡 Alto | Deve sempre rodar após `renderPanel()`; `transPanel()` chama como callback |
| `buildWorldMask()` | 🟡 Alto | Deve rodar após `bLayer` e `vizLayer` existirem |
| CSS cascade | 🟠 Médio | Regras duplicadas em sessões anteriores causaram bugs visuais; verificar antes de adicionar |
| Nominatim rate limit | 🟠 Médio | Máximo 1 req/s; debounce de 900ms (reverso) e 500ms (busca) já implementados |
| `localStorage` quota | 🟢 Baixo | Fotos base64 podem causar QuotaExceededError; fallback implementado em `save()` |

---

## 11. Bugs conhecidos corrigidos (histórico)

Ver `DOCUMENTATION/BUGFIXES/BUGFIX_REPORT.md` para detalhes completos.

**Crítico:** `.search input` sem `color: var(--ink)` → texto invisível no tema claro  
**Duplicata CSS `.b-poly`:** `fill-opacity: .95` sobrescrevia `.35` → polígonos sólidos cobriam tiles  
**`.mapwrap { position:relative }`:** Regra rogue colapsava o container do mapa para 0px altura (ocorreu 2×)  
**`.pickbar` duplicada:** `z-index:850` da regra antiga conflitava com `z-index:800` da nova  
**`.mk.sel .pin` conflito:** Regra antiga com `accent/preto` sobrevia junto com nova `--pc/branco`

---

## 12. Checklist para futuras IAs

Antes de modificar qualquer arquivo:
- [ ] Leia `AI_CONTEXT_GUIDE.md` (este arquivo)
- [ ] Identifique o(s) arquivo(s) afetado(s) (`app.js`, `app.css`, `index.html`, data file)
- [ ] Verifique se `.mapwrap` não será sobrescrito
- [ ] Verifique a ordem dos `<script>` em `index.html`
- [ ] Após mudança em CSS, busque por seletores duplicados
- [ ] Após mudança em JS, rode `node --check src/js/app.js`
- [ ] Teste tema claro E escuro
- [ ] Teste em viewport mobile (< 768px) E desktop (>= 960px)
- [ ] Atualize `DOCUMENTATION/DEVELOPMENT/CHANGELOG.md`

---

## 13. Índice de documentação

| Documento | Localização | Conteúdo |
|---|---|---|
| Contexto IA | `DOCUMENTATION/AI_CONTEXT_GUIDE.md` | Este arquivo |
| Visão geral | `DOCUMENTATION/ARCHITECTURE/SYSTEM_OVERVIEW.md` | Arquitetura + diagramas |
| Bugs corrigidos | `DOCUMENTATION/BUGFIXES/BUGFIX_REPORT.md` | Registro técnico de bugs |
| Testes (24/24) | `DOCUMENTATION/TESTING/TEST_EXECUTION_REPORT.md` | Relatório individual |
| Histórico | `DOCUMENTATION/DEVELOPMENT/CHANGELOG.md` | CHANGELOG completo |
| Guia dev | `README.md` | Setup + deploy |
