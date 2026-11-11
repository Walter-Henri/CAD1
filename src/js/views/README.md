# Views

Cada tela do painel é renderizada por uma função `v*` em `app.js`.

Organização alvo (registro em `Mutirao.views`):

| Arquivo | Views |
|---|---|
| mapa.js | vMapa |
| detalhe.js | vDetalhe |
| ranking.js | vRanking |
| votacao.js | vVotacao |
| conta.js | vLogin, vConta |
| adicionar.js | vAdicionar, vSucesso |
| panico.js | vPanico, vPanicoAdd, vPanicoDetalhe |
| obras.js | vObras, vObraAdd, vObraDetalhe |
| mensagens.js | vMensagens |
| alertas.js | vAlertas, vLider |

As funções permanecem em `app.js` no mesmo IIFE para preservar closures do mapa/estado.
Os módulos `core/` e `services/` já estão separados e carregados antes.
