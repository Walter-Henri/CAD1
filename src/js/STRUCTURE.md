# Estrutura JS (1.11.2)

## Entrada

1. Scripts clássicos no `index.html`: `data/*` → `core/*` → `services/*` → `views/*`
2. Módulo: `src/js/modules/main.js` → `createApp()` → `installRuntime(app)` → `boot()`

## Pastas

| Pasta | Papel |
|-------|-------|
| `modules/` | App ES module (runtime, help, toast UI) |
| `core/` | Utilitários e toast no namespace `Mutirao` |
| `services/` | Nominatim, GPS, share |
| `views/` | Registro de nomes de tela |
| `data/` | GeoJSON e seed (globais) |

A maior parte do HTML de painel e da lógica de mapa ainda vive em `modules/install/runtime.js`.
