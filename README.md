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

## API do mapa (CARTO)

Os tiles do mapa vêm do CARTO. Sem chave, funcionam em modo demo com limitação de taxa.  
Para produção, obtenha uma chave gratuita em [carto.com](https://carto.com).

### Localmente

```bash
# 1. Crie o arquivo de variáveis locais (não sobe pro Git)
cp .env.example .env.local

# 2. Coloque sua chave CARTO dentro do arquivo
CARTO_API_KEY=sua_chave_aqui

# 3. Suba o projeto (o script gera src/js/data/env.js automaticamente)
npm run dev
```

### Na Vercel

1. Vá em **Settings > Environment Variables** do seu projeto.  
2. Adicione `CARTO_API_KEY` com o valor da sua chave.  
3. Faça um novo deploy — o `buildCommand` do `vercel.json` roda `inject-env.mjs` automaticamente.

> ⚠️ Nunca coloque a chave diretamente em `env.js`, `app.js` ou qualquer arquivo versionado.

## Street View

Cada ponto de problema exibe um botão **Street View**. Ao clicar, abre um overlay com o Street View do Google centralizado nas coordenadas do ponto, sem exigir chave de API.
