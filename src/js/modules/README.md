# modules/ — aplicação ES module (1.11.2)

| Arquivo | Função |
|---------|--------|
| `main.js` | Instancia e chama `boot()` |
| `createApp.js` | Monta o objeto `app` e instala runtime |
| `install/runtime.js` | Mapa, estado, views, binds, onboarding |
| `install/dom.js` / `constants.js` | Auxiliares de instalação |
| `ui/help.js` | `HELP`, `sheetBar`, `openHelp` |
| `ui/toast.js` | Bridge/UI de toast no módulo |
| `lib/dom.js` / `constants.js` | Helpers compartilhados do módulo |

Não duplicar lógica de toast: a implementação canônica de auto-dismiss está em `core/toast.js`.
