# Dados e fluxos — Mutirão · Recife (1.11.2)

## Estado `S` (chave `mutirao.v1`)

Persistido por `save()` em `install/runtime.js`. Fotos em data-URL podem ser omitidas se o quota do `localStorage` estourar (fallback grava sem `photos`).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `user` | object \| null | `{ name, login, bairro, role }` |
| `mine` | array | Pontos criados pelo usuário |
| `supported` | Set serializado | IDs apoiados |
| `notes` | object | Notas por ponto |
| `photos` | object | Fotos por ponto |
| `votes` | object | Voto por área (`S.area`) |
| `panics` | array | Ocorrências de pânico (F1) |
| `obras` | array | Obras acompanhadas (F1) |
| `msgs` | array | Mensagens ao líder |
| `morro` | boolean | Ênfase visual de morros |
| `filt` | object | Filtros de categoria/status |
| `view` | string | Tela atual |
| `sel` / `selP` / `selO` | id | Seleção ponto / pânico / obra |
| `draft` | object \| null | Rascunho de novo ponto (inclui `_returnTo`) |
| `area` | string | `all` ou RPA numérica em string |
| `rankMode` | string | `apoios` \| `tempo` |
| `lastAdded` | id | Último ponto publicado |

## Outras chaves

| Chave | Valores | Uso |
|-------|---------|-----|
| `mutirao.theme` | `light` \| `dark` | Tema visual |
| `mutirao.onboarded` | `1` | Não reexibir boas-vindas |

## Dados estáticos (globais)

| Global | Arquivo | Conteúdo |
|--------|---------|----------|
| `BAIRROS` | `data/bairros.js` | Polígonos e metadados de bairros Recife |
| `VIZINHOS` | `data/vizinhos.js` | Municípios/áreas vizinhas (máscara) |
| `SEED` | `data/seed.js` | Pontos de exemplo |
| `RISCOS` | `data/riscos.js` | Pontos oficiais de risco |
| `ENV` | `data/env.js` (+ inject) | Flags / URLs opcionais |

## Fluxo: publicar problema

1. `startAdd` → `need` (login se preciso) → `go('pick')`.
2. Usuário posiciona mapa / busca / GPS → `pickOk` → `go('adicionar')`.
3. Formulário (`vAdicionar`): tipo, título, ref, descrição, fotos, paliativo.
4. `submitAdd` valida → grava em `S.mine` → `save` → toast sucesso → `go('sucesso')`.
5. Sucesso: banner, compartilhar WhatsApp, ver no mapa.

## Fluxo: votação a partir do ranking

1. `vRanking` lista top 10; cada item tem `data-go-vote` + `data-area-r`.
2. Clique define `S.area` = RPA do ponto e `go('votacao')`.
3. `voteForm` grava `S.votes[area]`.

## Fluxo: onboarding

Ver diagrama em [DIAGRAMS.md](DIAGRAMS.md) §4. Preferência permanente só com “Sim, não mostrar novamente”.

## Funções de navegação

| Função | Comportamento |
|--------|----------------|
| `go(v, opt)` | Empilha histórico (salvo `back`/`replace`), atualiza hash, `renderPanel` |
| `goBack()` | `hist.pop()` ou mapa |
| `closeToMap()` | Limpa hist e vai ao mapa |
| `sheetBar(view)` | Chrome Voltar / ? / Fechar (mapa: só dica + ?) |
