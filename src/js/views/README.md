# Views — registro por tela

Cada arquivo registra metadados em `Mutirao.views`.  
As funções `vMapa`, `vDetalhe`, … que geram o HTML do painel **continuam em `app.js`** (mesmo IIFE do mapa e do estado).

| Arquivo | Funções em `app.js` |
|---|---|
| `mapa.js` | `vMapa` |
| `detalhe.js` | `vDetalhe` |
| `ranking.js` | `vRanking` |
| `votacao.js` | `vVotacao` |
| `conta.js` | `vLogin`, `vConta` |
| `adicionar.js` | `vAdicionar`, `vSucesso` |
| `panico.js` | `vPanico`, `vPanicoAdd`, `vPanicoDetalhe` |
| `obras.js` | `vObras`, `vObraAdd`, `vObraDetalhe` |
| `mensagens.js` | `vMensagens` |
| `alertas.js` | `vAlertas`, `vLider` |

Roteamento: `renderPanel()` em `app.js` + `NAVOF` + `go()`.  
Eventos F1: `bindNewFeatures(S.view, on)` no fim de `bindPanel`.
