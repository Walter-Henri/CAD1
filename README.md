# Mutirão · E7 Protótipo v1

Mapa colaborativo de problemas de bairro no Recife. Os moradores marcam barreiras, alagamentos, buracos e obras paradas; a associação leva os mais votados ao vereador.

## Stack

Vanilla HTML + CSS + JavaScript (sem framework, sem bundler).  
Dependências externas via CDN: Leaflet 1.9.4, MarkerCluster 1.5.3, Nunito (Google Fonts).

## Estrutura

```
mutirao/
├── index.html              # Entrada da aplicação
├── src/
│   ├── css/
│   │   ├── vendor.css      # CSS do Leaflet + MarkerCluster
│   │   └── app.css         # Estilos da aplicação
│   └── js/
│       ├── data/
│       │   ├── bairros.js  # GeoJSON dos bairros do Recife
│       │   ├── vizinhos.js # GeoJSON das cidades vizinhas
│       │   └── seed.js     # Pontos de exemplo do protótipo
│       └── app.js          # Lógica da aplicação (IIFE)
├── vercel.json
└── README.md
```

## Rodar localmente

Qualquer servidor estático funciona. Exemplo com Node.js:

```bash
npx serve .
```

Ou com Python:

```bash
python3 -m http.server 8080
```

Acesse `http://localhost:8080` (ou `8000` para Python).

## Deploy na Vercel

1. Suba o repositório no GitHub.  
2. No painel da Vercel, importe o repositório.  
3. **Framework Preset:** `Other` (detecção automática de site estático).  
4. **Root Directory:** `.` (raiz do repositório).  
5. **Build Command:** deixe vazio (não há etapa de build).  
6. **Output Directory:** `.` (já está configurado em `vercel.json`).  
7. Clique em **Deploy**.

## Funcionalidades

- Mapa de pontos colaborativo por bairro e RPA do Recife
- Adicionar, apoiar, votar e enviar fotos (dados ficam no localStorage)
- Ranking de problemas por apoios ou tempo de espera
- Votação mensal da associação
- Busca por bairro ou problema
- Tema claro/escuro com preferência salva
- Responsivo (mobile + desktop)

## Persistência

Os dados do usuário são salvos no `localStorage` com a chave `mutirao.v1`.  
A preferência de tema é salva com a chave `mutirao.theme`.
# CAD1
