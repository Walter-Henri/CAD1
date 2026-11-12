# Fase 1 — Pânico, Obras e Líder

**Código:** `src/js/app.js` (bloco F1), `src/css/app.css` (componentes F1), `index.html` (FAB, tabbar, ícones)  
**Documentação conferida em:** 2026-11-12

## Status das integrações

| Item | Estado |
|---|---|
| Views e modelos de dados | Implementados |
| FAB PÂNICO, menu, tabbar, botões da Conta | Ligados |
| `bindNewFeatures(S.view, on)` no fim de `bindPanel` | **Corrigido** — submits e cards respondem após o render |
| Marcadores `pgLayer` / `ogLayer` no boot | **Corrigido** (`renderPanicoMarkers` + `renderObraMarkers` no início) |
| Painel mobile para views F1 | **Corrigido** — `data-view` listadas no CSS de tela cheia |
| Toasts auto-dismiss | **Corrigido** — ver `core/toast.js` |
| `S.user.bairro` no login | Ainda não atribuído |
| Hash das views F1 | Ainda colapsa para `#mapa` |
| `pickCancel` e `_returnTo` | Cancelar o pick ainda ignora `_returnTo` |
| `respLida` | Nunca marcado como lido |

## Features

| Feature | Arquivos |
|---|---|
| F1 Pânico | `app.js`, `app.css`, `index.html` |
| F2–F3 Obras | `app.js`, `app.css` |
| F4 Líder / mensagens | `app.js` |
| F5 Integração (Alertas, menu, pick) | `app.js`, `index.html` |

**9 views:** `vAlertas`, `vPanico`, `vPanicoAdd`, `vPanicoDetalhe`, `vObras`, `vObraAdd`, `vObraDetalhe`, `vMensagens`, `vLider`

## Persistência

| Chave | Array | Save |
|---|---|---|
| `mutirao.panics` | `S.panics` | `saveP()` |
| `mutirao.obras` | `S.obras` | `saveO()` |
| `mutirao.msgs` | `S.messages` | `saveM()` |

### Pânico

```js
{ id, t, tipo, sev, desc, b, r, lat, lng, pSt, criadoPor, created }
// pSt nasce 'acontecendo'; resolve → 'resolvido'
```

`PANICO_TIPO`: deslizamento, alagamento, desabamento, arvore, via, ponte, outro  
`PANICO_SEV`: critico, alto, medio  

### Obra

```js
{ id, t, orgao, desc, b, r, lat, lng, inicio, previsao, historico,
  conclusao_admin, conclusao_verificada, criadoPor, created }
```

`computeObraStatus(o)` (primeira regra que casar):

1. `conclusao_verificada` → `em_inauguracao`  
2. `conclusao_admin` → `em_conclusao`  
3. previsão vencida **e** início há &gt; 2 anos → `nunca_concluida`  
4. previsão vencida → `atrasada`  
5. senão → `em_andamento`  

### Mensagem

```js
{ id, de, bairro, texto, ts, resposta, respLida }
```

`doLogin` grava só `{ name, login }`. `#goLider` promove `role='lider'`.  
`S.user.bairro` **não é escrito** em nenhum fluxo — mensagens saem com `bairro:''`.

## Navegação

| Entrada | Destino |
|---|---|
| FAB **PÂNICO** | `panicoAdd` (exige login) |
| Tabbar Alertas / Obras | `alertas` / `obras` |
| Menu → Alertas de pânico / Obras | `panico` / `obras` |
| Conta → Mensagens / Painel do líder | `mensagens` / promove e `lider` |

`NAVOF` agrupa pânico/mensagens/líder na aba `alertas` e obras em `obras`.  
Pick compartilhado: `S.draft._returnTo` lido em `#pickOk`.

## Mapa

`pgLayer` e `ogLayer` são `L.layerGroup` (markerPane).  
Pânico ativo: `zIndexOffset: 900`, some se `pSt==='resolvido'`.

## Como testar

1. **Toast:** qualquer ação que dispare `toast()` — some em ~3 s; toasts seguidos não “grudam”.  
2. **Pânico:** login → FAB → local → registrar → aparece em Alertas e no mapa → resolver.  
3. **Obras:** aba Obras → Registrar → status por datas → atualizar / declarar / verificar.  
4. **Mensagens:** Conta → Mensagens → enviar; Conta → Painel do líder → responder (filtro por bairro ainda limitado).  

## Limitações restantes

| Limitação | Impacto |
|---|---|
| Sem `S.user.bairro` no login | Mensagem e painel do líder não alinham bairro |
| Hash F1 → `#mapa` | Reload não restaura a tela |
| `pickCancel` ignora `_returnTo` | Cancelar pick no meio do fluxo de pânico/obra |
| `respLida` fixo | Aviso de resposta nova não some |
| `pSt: nao_verificado` | Só rótulo; ninguém grava |
| localStorage only | Sem sync entre aparelhos |
| Sem foto em pânico/obra | Escopo Fase 2 |
| Nominatim sem retry | Falha silenciosa possível |
