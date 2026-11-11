# Estrutura JS — Mutirão

```
src/js/
├── core/
│   ├── util.js         # $, esc, icon, norm, hash, tempo, fmt
│   ├── constants.js    # CATS, STATUS, RPA, PANICO_*, OBRA_ST, NAVOF
│   └── toast.js        # toast() com auto-dismiss (token + fallback)
├── services/
│   ├── geocode.js      # reverseGeocode, geocodeSearch (Nominatim)
│   ├── gps.js          # getGPS
│   └── share.js        # helpers de compartilhamento
├── views/
│   └── README.md       # mapa de telas → funções v*
├── data/               # GeoJSON e seed (globais)
└── app.js              # mapa Leaflet, estado S, rotas, views, bind, boot
```

## Ordem de carga (index.html)

1. Leaflet + MarkerCluster (CDN)
2. data/* (BAIRROS, VIZINHOS, SEED, RISCOS, ENV)
3. core/util → core/constants → core/toast
4. services/geocode → gps → share
5. app.js

## Toast

`core/toast.js` é a implementação canônica. `app.js` delega com `Mutirao.toast`.

Correções:
- Token `toastGen` impede timer antigo de esconder toast novo
- Fallback de 220ms se `animationend` não disparar (`prefers-reduced-motion`)
- Reinicia animação de entrada ao substituir toast visível
