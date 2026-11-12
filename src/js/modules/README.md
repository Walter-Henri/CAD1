# modules/ — ES modules da aplicação

## Bootstrap

```
index.html
  data/*.js (globais)
  core/toast.js (Mutirao.toast)
  modules/main.js   type=module
    → createApp()
        → install/dom.js
        → install/constants.js
        → install/runtime.js
    → app.boot()
```

## Arquivos ativos

| Arquivo | Responsabilidade |
|---|---|
| `main.js` | Entrada |
| `createApp.js` | Composição |
| `lib/dom.js` | Utilitários DOM/texto |
| `lib/constants.js` | CATS, STATUS, chips |
| `ui/toast.js` | Bridge de toast |
| `install/dom.js` | Injeta utils em `app` |
| `install/constants.js` | Injeta constantes em `app` |
| `install/runtime.js` | Estado, mapa, rotas, views, eventos, Fase 1 |

`src/js/app.js` na raiz de `js/` é **stub legado** e não é carregado.
