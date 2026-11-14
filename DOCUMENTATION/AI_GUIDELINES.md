# Diretrizes para edição assistida por IA — Mutirão (1.11.2)

Antes de qualquer mudança, leia `AI_CONTEXT_GUIDE.md` e o `CHANGELOG`.

## Não negociável

- Não alterar regras de negócio sem pedido explícito.
- Mudanças **somente de cor/tema** limitam-se a `design-tokens.css` (e CSS de mapa temático).
- Cascata CSS: `mobile-lock.css` permanece o último `@import` de layout em `app.css`.
- Onboarding: duas etapas; sem X; persistência só em “Sim, não mostrar novamente”.
- Toasts: API com `toastGen` e fallback temporal.

## Preferências

- Manter linguagem cidadã (pt-BR simples) em copy de UI.
- Evitar duplicar botões Fechar (sheet-bar vs cabeçalho).
- Documentar em `CHANGELOG.md` qualquer versão funcional nova.

---

Instruções para agentes de IA. Objetivo: **mudança local, tokens baixos, zero regressão acidental**.

---

## Mapa mental (30 segundos)

```
Identidade visual  → src/css/tokens/design-tokens.css
Layout chrome      → src/css/layout/shell.css
UI painel          → src/css/components/*
Mapa visual        → src/css/map/*
Fase 1 visual      → src/css/features/fase1.css
Toast              → src/js/core/toast.js
Lógica / views     → src/js/app.js
Constantes domínio → src/js/core/constants.js
Geo dados          → src/js/data/*
Infra completa     → DOCUMENTACAO_INFRAESTRUTURA.md
```

---

## Protocolo de alteração

1. Classificar o pedido (token / CSS domínio / JS tela / dados).  
2. Abrir **só** o arquivo canônico da tabela acima.  
3. Grep pelo `id`, classe ou nome de função antes de editar `app.js`.  
4. Não reformatar arquivos não pedidos.  
5. Após JS: `node --check <arquivo>`.  
6. Após CSS: confirmar que o módulo ainda é importado em `src/css/app.css`.  
7. Atualizar `DOCUMENTATION/DEVELOPMENT/CHANGELOG.md` se a mudança for comportamental.

---

## Proibições

- Duplicar implementação de toast em `app.js`.  
- Editar `vendor.css` salvo upgrade deliberado de Leaflet.  
- Apagar `@import` de `app.css`.  
- Sobrescrever `.mapwrap` position.  
- Remover `bindNewFeatures` do fim de `bindPanel`.  
- Remover fallback de 220ms do toast.  
- Inventar backend, auth OAuth ou build React — o stack é vanilla estático.

---

## Onde adicionar coisas novas

| Novo… | Passos |
|---|---|
| Cor de marca | Token em `design-tokens.css` (claro + escuro) |
| Componente de painel | CSS em `components/ui.css` (ou arquivo novo + `@import` em `app.css`) |
| View de painel | `vNome` + ramo em `renderPanel` + `NAVOF` + CSS mobile `data-view` + bind |
| Camada de mapa | JS Leaflet em app.js + estilos em `map/layers.css` |
| Feature tipo Fase 1 | `features/<nome>.css` + bloco em app.js + doc em DOCUMENTATION/ |

---

## Validação mínima

- [ ] Sintaxe JS ok  
- [ ] Tema claro e escuro  
- [ ] Mobile &lt; 960px e desktop  
- [ ] Toast some sozinho  
- [ ] Mapa não colapsou (altura do `#map`)