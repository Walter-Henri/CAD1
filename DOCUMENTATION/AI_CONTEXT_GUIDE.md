# Guia de contexto para IA — Mutirão · Recife (1.11.2)

Use este arquivo antes de editar o código.

## O que é

SPA estática de mapa cidadão (Recife). Sem backend. Estado em `localStorage`.

## Onde está a lógica

| Preocupação | Onde |
|-------------|------|
| Boot | `src/js/modules/main.js` → `createApp.js` → `install/runtime.js` |
| Telas HTML / binds | `install/runtime.js` (`v*`, `bindPanel`, `go`) |
| Ajuda / sheet-bar | `modules/ui/help.js` |
| Toast | `core/toast.js` + `modules/ui/toast.js` |
| Temas | `tokens/design-tokens.css` + `isDark` / bootstrap `index.html` |
| Mobile | `layout/mobile-lock.css` (último na cascata) |
| Geo / GPS | `services/geocode.js`, `services/gps.js` |
| Dados | `data/*.js` (globais) |

## Regras de ouro

1. **Não** introduzir React/Vue/bundler sem decisão explícita do mantenedor.
2. **Não** reordenar `@import` de `app.css` sem revisar cascata (mobile-lock deve ser o último).
3. Toasts: sempre via API canônica (token `toastGen`); nunca só `animationend`.
4. Novas telas: registrar em `views/`, implementar `v*` + binds no runtime, entrada em `renderPanel` / `NAVOF` / `HASH_VIEWS` se necessário.
5. Tema: claro é padrão; não reativar dark automático por `prefers-color-scheme` como default.
6. Onboarding: respeitar `mutirao.onboarded`; não reintroduzir X na etapa de boas-vindas.

## Versão documentada

**1.11.2** — ver [DEVELOPMENT/CHANGELOG.md](DEVELOPMENT/CHANGELOG.md).

## Leitura recomendada na ordem

1. Este guia  
2. [ARCHITECTURE/SYSTEM_OVERVIEW.md](ARCHITECTURE/SYSTEM_OVERVIEW.md)  
3. [ARCHITECTURE/DIAGRAMS.md](ARCHITECTURE/DIAGRAMS.md)  
4. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)  
5. [FASE1.md](FASE1.md) se a tarefa for pânico/obras/líder  
