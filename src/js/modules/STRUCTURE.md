# Estrutura JavaScript — Mutirão

Entrada: `modules/main.js` (ES module).

```
core/toast.js · data/*
modules/
  main.js · createApp.js
  install/{dom,constants,runtime}.js
  lib/ · ui/{toast,help}.js
app.js  # legado, não carregado
```

Fluxo: `createApp` → help + runtime → `boot()`.
