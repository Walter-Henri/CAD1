# Diagramas técnicos — Mutirão · Recife (1.11.2)

Cada caixa corresponde a arquivo, função ou chave de `localStorage` existente no repositório.

---

## 1. Contexto (C4 — sistema)

```mermaid
flowchart LR
  subgraph browser [Navegador]
    HTML[index.html]
    CSS[app.css + módulos]
    DATA[data/*.js globais]
    CORE[core + Mutirao]
    MAIN[modules/main.js]
    RT[install/runtime.js]
    HELP[ui/help.js]
    TOAST[ui/toast + core/toast]
    LS[(localStorage)]
    HTML --> CSS
    HTML --> DATA
    HTML --> CORE
    HTML --> MAIN
    MAIN --> RT
    RT --> HELP
    RT --> TOAST
    RT --> LS
  end
  OSM[OpenStreetMap tiles]
  NOM[Nominatim]
  SV[Street View iframe]
  RT --> OSM
  RT --> NOM
  RT --> SV
```

| Externo | Uso | API key |
|---------|-----|---------|
| Leaflet 1.9.4 + MarkerCluster | Mapa e clusters | Não |
| OSM tiles | Basemap | Não |
| Nominatim | Busca / reverse | Não (1 req/s; debounce) |
| Street View | Overlay iframe | Não |

---

## 2. Componentes (módulos JS)

```mermaid
flowchart TB
  main[main.js] --> create[createApp.js]
  create --> runtime[install/runtime.js]
  create --> dom[install/dom.js]
  runtime --> help[ui/help.js]
  runtime --> toastUI[ui/toast.js]
  runtime --> geo[services/geocode.js]
  runtime --> gps[services/gps.js]
  coreT[core/toast.js] -.-> toastUI
  util[core/util.js] --> runtime
  const[core/constants.js] --> runtime
  views[views/*.js registro] --> runtime
  data[data/bairros vizinhos seed riscos env] --> runtime
```

---

## 3. Navegação de telas

```mermaid
stateDiagram-v2
  [*] --> mapa: boot
  mapa --> pick: Adicionar / Trocar local
  pick --> adicionar: Confirmar local
  adicionar --> sucesso: Publicar
  sucesso --> detalhe: Ver no mapa
  mapa --> detalhe: pino / lista
  detalhe --> mapa: Voltar / Fechar
  mapa --> ranking
  ranking --> votacao: Votar neste / Ir à votação
  mapa --> alertas
  alertas --> panico
  panico --> panicoAdd
  panico --> panicoDetalhe
  mapa --> obras
  obras --> obraAdd
  obras --> obraDetalhe
  conta --> mensagens
  conta --> lider
  mapa --> conta
```

Hash suportado: `#ranking`, `#votacao`, `#conta`, `#adicionar`, `#panico:ID`, `#obra:ID`, e demais em `HASH_VIEWS`.

---

## 4. Fluxo de onboarding (1.11.2)

```mermaid
sequenceDiagram
  participant Boot
  participant Modal
  participant LS as localStorage
  Boot->>LS: mutirao.onboarded === "1"?
  alt já onboarded
    Boot-->>Boot: não abre modal
  else primeira visita / "continuar mostrando"
    Boot->>Modal: etapa 1 boas-vindas (sem X)
    Modal->>Modal: Entendi, vamos lá
    Modal->>Modal: etapa 2 confirmação
    alt Sim, não mostrar
      Modal->>LS: onboarded = 1
      Modal->>Modal: close
    else Não, continuar mostrando
      Modal->>Modal: close (sem gravar)
    end
  end
```

---

## 5. Toast (auto-dismiss)

```mermaid
sequenceDiagram
  participant App
  participant Toast as toast()
  participant DOM
  App->>Toast: toast(msg, ic)
  Toast->>Toast: toastGen++
  Toast->>DOM: show #toast
  Toast->>Toast: timer TOAST_MS
  Toast->>DOM: class toast-out
  alt animationend
    Toast->>DOM: hide
  else prefers-reduced-motion / sem evento
    Toast->>DOM: hide após TOAST_OUT_MS (220ms)
  end
```

---

## 6. Temas

```mermaid
flowchart LR
  boot[index.html script] -->|sem preferência| light[data-theme=light]
  boot -->|mutirao.theme| saved[light ou dark]
  user[Botão tema] --> toggle[toggleTheme]
  toggle --> LS[(mutirao.theme)]
  toggle --> DOM[dataset.theme]
  DOM --> CSS[design-tokens.css]
```

---

## 7. Cascata CSS (ordem crítica)

```
tokens → reset → shell → responsive-fix → map/* → components/* → animations → fase1 → mobile-lock (último)
```

`mobile-lock.css` (≤959.98px) impõe painel/mapa a 100% e **não** aplica `max-width` em tiles/SVG Leaflet.

---

## 8. Persistência

```mermaid
erDiagram
  MUTIRAO_V1 ||--o{ POINT : mine
  MUTIRAO_V1 ||--o{ PANIC : panics
  MUTIRAO_V1 ||--o{ OBRA : obras
  MUTIRAO_V1 ||--o{ MSG : msgs
  MUTIRAO_V1 ||--o| USER : user
  THEME ||--|| PREF : mutirao.theme
  ONBOARD ||--|| FLAG : mutirao.onboarded
```

Detalhes de campos em [`DATA_AND_FLOWS.md`](DATA_AND_FLOWS.md).
