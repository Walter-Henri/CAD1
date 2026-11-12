# Arquitetura JS modular (ES modules)

## Entrada

`index.html` → `<script type="module" src="src/js/modules/main.js">`

```
main.js
  └─ createApp.js
       ├─ install/dom.js          ← lib/dom.js
       ├─ install/constants.js    ← lib/constants.js
       └─ install/runtime.js      ← estado, mapa, rotas, views, bind, F1, busca
  └─ app.boot()
```

## Responsabilidades

| Módulo | Conteúdo |
|---|---|
| `lib/dom.js` | `$`, `esc`, `icon`, `tempo`, `fmt` |
| `lib/constants.js` | `CATS`, `STATUS`, `RPA`, `MORRO`, chips |
| `ui/toast.js` | bridge `Mutirao.toast` |
| `install/dom.js` | anexa utils em `app` |
| `install/constants.js` | anexa constantes em `app` |
| `install/runtime.js` | núcleo: S, mapa Leaflet, `go`, views `v*`, bind, GPS, F1 |
| `createApp.js` | composição |
| `main.js` | instancia e chama `boot` |

## Por que `runtime.js` ainda é grande

Mapa, painel e F1 compartilham dezenas de closures (`map`, `S`, `go`, `panel`).  
Separá-los em ES modules puros exige um objeto de contexto em **cada** chamada.  
O bag `app` + `installRuntime` isola o núcleo sem globals, enquanto lib/ui permanecem trocáveis.

Próximo passo natural: fatiar `install/runtime.js` em `install/map.js`, `install/views.js`, `install/fase1.js` passando o mesmo `app` e movendo `let` compartilhados para `app.*`.

## Scripts clássicos (ainda necessários)

- `data/*.js` — `BAIRROS`, `SEED`, `RISCOS`, …
- `core/toast.js` — implementação canônica do toast
- Leaflet CDN
