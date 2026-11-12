# Estrutura JS — Mutirão

Conferido em 2026-11-12.

```
src/js/
├── core/
│   ├── util.js         # $, esc, icon, norm, hash, DAY, NOW, isDesk, tempo, fmt
│   ├── constants.js    # CATS, STATUS, RPA, PANICO_TIPO/SEV, OBRA_ST, NAVOF
│   └── toast.js        # Mutirao.toast — auto-dismiss (token + fallback)
├── services/
│   ├── geocode.js      # Mutirao.reverseGeocode, Mutirao.geocodeSearch
│   ├── gps.js          # Mutirao.getGPS
│   └── share.js        # Mutirao.services.share helpers
├── views/
│   ├── README.md
│   ├── mapa.js, detalhe.js, ranking.js, votacao.js, conta.js
│   ├── adicionar.js, panico.js, obras.js, mensagens.js, alertas.js
│   └── (registro Mutirao.views._*; HTML das v* ainda no IIFE de app.js)
├── data/               # bairros, vizinhos, seed, riscos, env (globais)
├── app.js              # IIFE: mapa Leaflet, S, rotas, views, bind, boot
└── STRUCTURE.md
```

## Ordem de carga

1. Leaflet + MarkerCluster  
2. `data/*`  
3. `core/util` → `constants` → `toast`  
4. `services/geocode` → `gps` → `share`  
5. `views/*`  
6. `app.js`  

## Toast

Única implementação: `core/toast.js`.  
`app.js`: `const toast = (msg,ic) => Mutirao.toast(msg,ic)`.

- 3100ms visível  
- `toastGen` isola timers  
- Fallback 220ms se não houver `animationend`  

## Por que as `v*` ainda estão no IIFE

O mapa Leaflet, `S`, `panel` e helpers compartilham o mesmo closure. Extrair o HTML das views para ES modules exigiria um objeto de contexto injetado em todas as funções. Os arquivos em `views/` documentam a divisão por tela e registram metadados em `Mutirao.views` para manutenção.
