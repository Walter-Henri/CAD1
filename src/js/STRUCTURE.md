# Estrutura JavaScript — Mutirão

## Entrada

```html
<script type="module" src="src/js/modules/main.js"></script>
```

Scripts clássicos **antes** do module: Leaflet, `data/*`, `core/toast.js`.

## Árvore

```
src/js/
├── core/                    # clássico (toast canônico)
│   ├── util.js
│   ├── constants.js
│   └── toast.js             # Mutirao.toast
├── data/                    # globais BAIRROS, SEED, RISCOS…
├── modules/                 # ES modules (aplicação)
│   ├── main.js              # createApp() + boot()
│   ├── createApp.js         # composição install*
│   ├── application.js       # reexport boot (compat)
│   ├── registry.js
│   ├── lib/
│   │   ├── dom.js           # $, esc, icon, tempo, fmt
│   │   └── constants.js     # CATS, STATUS, chips
│   ├── ui/
│   │   └── toast.js         # bridge → Mutirao.toast
│   ├── install/
│   │   ├── dom.js
│   │   ├── constants.js
│   │   └── runtime.js       # estado, mapa, rotas, views, bind, F1
│   └── STRUCTURE.md
├── services/                # clássico legado (geocode/gps helpers)
└── views/                   # registro legado de telas
```

## Fluxo

```
main.js
  → createApp()
       → installDom(app)
       → installConstants(app)
       → installRuntime(app)   # anexa S, map, go, boot, …
  → app.boot()
```

## Como evoluir

1. Utils puros → `modules/lib/`
2. Nova feature isolada → `modules/install/<feature>.js` chamado em `createApp.js`
3. Fatiar `runtime.js` → novos `install/*` recebendo o mesmo `app` e usando `app.S`, `app.map`, `app.go`
