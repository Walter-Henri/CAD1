# Mutirão · Recife

Mapa colaborativo em que moradores marcam problemas do bairro (barreiras, alagamentos, buracos, esgoto, lixo, obras paradas). Ver é livre; marcar, apoiar e votar exige conta local. A associação usa o ranking e a votação do mês para priorizar o que levar ao vereador.

**Versão funcional documentada: 1.11.2** (novembro/2026)  
`package.json` permanece em `1.0.0` (versão de pacote npm); o histórico de produto está em [`DOCUMENTATION/DEVELOPMENT/CHANGELOG.md`](DOCUMENTATION/DEVELOPMENT/CHANGELOG.md).

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| UI | HTML + CSS + JavaScript (sem framework, sem bundler) |
| Mapa | Leaflet 1.9.4 + MarkerCluster 1.5.3 (CDN) |
| Tiles | OpenStreetMap |
| Geocode | Nominatim OSM (debounce; sem API key) |
| Persistência | `localStorage` (estado do protótipo) |
| Entrada JS | ES modules: `src/js/modules/main.js` → `createApp` → `installRuntime` |
| Namespace legado | `window.Mutirao` (util, toast, help) |

Não há backend de aplicação. Tudo roda no navegador.

---

## Estrutura do repositório

```
mutirao/
├── index.html                      # Shell HTML, SVG sprite, scripts
├── src/
│   ├── css/
│   │   ├── app.css                 # @import (ordem = cascata)
│   │   ├── tokens/design-tokens.css # Temas claro (padrão) e escuro
│   │   ├── base/{reset,animations}.css
│   │   ├── layout/{shell,responsive-fix,mobile-lock}.css
│   │   ├── components/{ui,overlays,pickbar}.css
│   │   ├── map/{chrome,markers,layers}.css
│   │   ├── features/fase1.css
│   │   └── vendor.css              # Leaflet (carregado no index)
│   └── js/
│       ├── modules/
│       │   ├── main.js             # boot ES module
│       │   ├── createApp.js
│       │   ├── install/{runtime,dom,constants}.js
│       │   ├── ui/{help,toast}.js
│       │   └── lib/{dom,constants}.js
│       ├── core/{util,constants,toast}.js   # namespace Mutirao (scripts clássicos)
│       ├── services/{geocode,gps,share}.js
│       ├── views/*.js              # registro de telas
│       ├── data/{bairros,vizinhos,seed,riscos,env}.js
│       ├── app.js                  # legado (aponta para modules/)
│       └── STRUCTURE.md
├── scripts/inject-env.mjs
├── DOCUMENTATION/                  # ver índice abaixo
├── DOCUMENTACAO_INFRAESTRUTURA.md
├── package.json
├── vercel.json
└── .env.example
```

---

## Documentação (índice)

| Documento | Conteúdo |
|-----------|----------|
| [DOCUMENTATION/AI_CONTEXT_GUIDE.md](DOCUMENTATION/AI_CONTEXT_GUIDE.md) | Contexto para agentes e onboarding técnico |
| [DOCUMENTATION/AI_GUIDELINES.md](DOCUMENTATION/AI_GUIDELINES.md) | Regras ao editar o código com IA |
| [DOCUMENTATION/ARCHITECTURE/SYSTEM_OVERVIEW.md](DOCUMENTATION/ARCHITECTURE/SYSTEM_OVERVIEW.md) | Visão de sistema |
| [DOCUMENTATION/ARCHITECTURE/DIAGRAMS.md](DOCUMENTATION/ARCHITECTURE/DIAGRAMS.md) | Diagramas (C4, sequência, navegação, dados) |
| [DOCUMENTATION/ARCHITECTURE/DATA_AND_FLOWS.md](DOCUMENTATION/ARCHITECTURE/DATA_AND_FLOWS.md) | Modelo de dados e fluxos |
| [DOCUMENTATION/DESIGN_SYSTEM.md](DOCUMENTATION/DESIGN_SYSTEM.md) | Tokens, temas claro/escuro, componentes |
| [DOCUMENTATION/DEVELOPMENT/CHANGELOG.md](DOCUMENTATION/DEVELOPMENT/CHANGELOG.md) | Histórico de versões |
| [DOCUMENTATION/DEVELOPMENT/RESPONSIVE.md](DOCUMENTATION/DEVELOPMENT/RESPONSIVE.md) | Breakpoints e mobile-lock |
| [DOCUMENTATION/FASE1.md](DOCUMENTATION/FASE1.md) | Pânico, obras, mensagens, líder |
| [DOCUMENTATION/BUGFIXES/BUGFIX_REPORT.md](DOCUMENTATION/BUGFIXES/BUGFIX_REPORT.md) | Bugs corrigidos |
| [DOCUMENTATION/TESTING/UIUX_AUDIT_REPORT.md](DOCUMENTATION/TESTING/UIUX_AUDIT_REPORT.md) | Auditoria UI/UX |
| [DOCUMENTATION/TESTING/TEST_EXECUTION_REPORT.md](DOCUMENTATION/TESTING/TEST_EXECUTION_REPORT.md) | Testes manuais |
| [DOCUMENTACAO_INFRAESTRUTURA.md](DOCUMENTACAO_INFRAESTRUTURA.md) | Infra, deploy, env |

---

## Funcionalidades (1.11.2)

- **Mapa:** máscara regional, bairros, vizinhos, clusters, filtros, legenda, mapa de calor, riscos oficiais  
- **Pontos:** adicionar (pick → formulário → sucesso), apoiar, fotos, notas, Street View, WhatsApp  
- **Ranking e votação do mês** (com atalho de voto a partir do ranking)  
- **Fase 1:** pânico, obras, alertas, mensagens ao líder, painel do líder  
- **Conta** local (nome, bairro, tema)  
- **Toasts** com auto-dismiss (token de geração + fallback `prefers-reduced-motion`)  
- **Ajuda contextual (`?`)** e barra Voltar / Fechar  
- **Onboarding em 2 etapas** (boas-vindas + “não mostrar novamente”)  
- **Temas:** claro = padrão; escuro sob demanda (`mutirao.theme`)  
- **Responsivo:** desktop painel ~560px; mobile com `mobile-lock.css` (Leaflet isento de `max-width`)

---

## Rodar localmente

```bash
npm run dev       # inject-env + serve
# ou
npx serve .
# ou
python3 -m http.server 8080
```

Abra a URL do servidor. Preferível origem `http` (geolocalização e tiles).

---

## Persistência (`localStorage`)

| Chave | Uso |
|-------|-----|
| `mutirao.v1` | Estado principal (user, pontos, votos, filtros, panics, obras, msgs…) |
| `mutirao.theme` | `light` \| `dark` |
| `mutirao.onboarded` | `1` se o usuário pediu para não ver boas-vindas de novo |

---

## Identidade

Feito pela comunidade. **Não é um site da prefeitura.** Protótipo para associação de moradores e cidadania digital no Recife.
