# Guia de contexto para IA — Mutirão · Recife (1.11.3)

> **Instrução de uso:** Use este arquivo antes de editar qualquer código, arquivo, estrutura ou documentação do projeto.

---

## O que é

SPA estática de mapa cidadão (Recife). Sem backend. Estado em `localStorage`.

---

## Onde está a lógica

| Preocupação | Onde |
| --- | --- |
| **Boot** | `src/js/modules/main.js` → `createApp.js` → `install/runtime.js` |
| **Telas HTML / binds** | `install/runtime.js` (`v*`, `bindPanel`, `go`) |
| **Ajuda / sheet-bar** | `modules/ui/help.js` |
| **Toast** | `core/toast.js` + `modules/ui/toast.js` |
| **Temas** | `tokens/design-tokens.css` + `isDark` / bootstrap `index.html` |
| **Mobile** | `layout/mobile-lock.css` (último na cascata) |
| **Geo / GPS** | `services/geocode.js`, `services/gps.js` |
| **Dados** | `data/*.js` (globais) |

---

## Regras de ouro

* Não introduzir React/Vue/bundler sem decisão explícita do mantenedor.
* Não reordenar `@import` de `app.css` sem revisar cascata (`mobile-lock` deve ser o último).
* Toasts: sempre via API canônica (token `toastGen`); nunca só `animationend`.
* Novas telas: registrar em `views/`, implementar `v*` + binds no runtime, entrada em `renderPanel` / `NAVOF` / `HASH_VIEWS` se necessário.
* Tema: claro é padrão; não reativar dark automático por `prefers-color-scheme` como default.
* Onboarding: respeitar `mutirao.onboarded`; não reintroduzir `X` na etapa de boas-vindas.

---

## REGRA OBRIGATÓRIA — DOCUMENTAÇÃO SEMPRE ATUALIZADA

Toda modificação realizada no projeto **DEVE** ser acompanhada da atualização de **TODA** a documentação relacionada e impactada pela alteração.

Esta regra é obrigatória e não pode ser ignorada, independentemente do tamanho ou da complexidade da modificação.

A IA não deve considerar uma tarefa concluída enquanto não tiver revisado e atualizado toda a documentação pertinente.

### 1. Atualização obrigatória após qualquer modificação

Sempre que criar, alterar, corrigir, remover, reorganizar ou refatorar qualquer elemento do projeto, a IA **DEVE**:

1. Identificar todos os documentos relacionados ao componente, funcionalidade, módulo ou estrutura modificada.
2. Ler a documentação existente antes de alterá-la, para preservar o histórico e evitar contradições.
3. Atualizar todos os documentos impactados pela mudança.
4. Corrigir referências, caminhos, exemplos, instruções, diagramas e descrições que tenham ficado desatualizados.
5. Registrar as alterações nos documentos históricos obrigatórios descritos nesta seção.
6. Verificar se a documentação final corresponde exatamente ao comportamento e à implementação atuais do código.

Não é permitido atualizar somente o código e deixar a documentação para depois.

Não é permitido atualizar apenas um dos documentos obrigatórios de histórico.

A obrigação também se aplica a:

* Correções pequenas de CSS, HTML ou JavaScript.
* Ajustes de interface e responsividade.
* Alterações de comportamento ou regras de negócio.
* Correções de bugs.
* Refatorações e otimizações.
* Criação, remoção ou renomeação de arquivos.
* Mudanças na arquitetura, organização de pastas ou fluxo de execução.
* Alterações em armazenamento, dados, navegação ou integrações.
* Atualizações de acessibilidade, segurança e desempenho.

### 2. Documentos históricos de atualização obrigatória

A cada modificação no projeto, revisar e atualizar os três documentos abaixo, conforme a natureza da alteração:

#### A. `DOCUMENTATION/DEVELOPMENT/CHANGELOG.md`

Registrar todas as mudanças realizadas no projeto, com informações detalhadas sobre:

* Data da alteração.
* Versão correspondente, quando aplicável.
* Categoria da mudança (`Added`, `Changed`, `Fixed`, `Removed`, `Refactored`, `Improved` ou `Security`).
* Arquivos e módulos modificados.
* Descrição detalhada do que foi alterado.
* Motivo e objetivo da alteração.
* Comportamento anterior e comportamento novo.
* Impactos na interface, arquitetura, funcionalidades ou experiência do usuário.
* Dependências e componentes afetados.
* Compatibilidade e possíveis efeitos colaterais.
* Testes e validações realizados.

Não utilizar descrições genéricas como *"ajustes gerais"*, *"melhorias diversas"*, *"correções internas"* ou simplesmente *"bug corrigido"*.

Cada entrada deve permitir que outro desenvolvedor compreenda exatamente o que foi modificado, onde foi modificado e por que a mudança foi necessária.

#### B. `DOCUMENTATION/CHANGELOG_REESTRUTURACAO.md`

Manter um histórico detalhado da evolução estrutural e organizacional do projeto.

Sempre que uma alteração envolver estrutura, arquitetura, organização de código, módulos, arquivos, diretórios, dependências ou fluxos internos, registrar:

* Estrutura anterior e estrutura resultante.
* Arquivos e diretórios criados.
* Arquivos e diretórios removidos.
* Arquivos renomeados ou realocados.
* Responsabilidades adicionadas, removidas ou redistribuídas.
* Alterações nas relações entre módulos.
* Mudanças nos fluxos de inicialização, execução e navegação.
* Justificativa técnica da reestruturação.
* Impactos sobre outros componentes.
* Compatibilidade com a arquitetura existente.
* Necessidade de atualização de referências e imports.
* Resultado das verificações realizadas.

Quando não houver reestruturação propriamente dita, avaliar se a alteração afeta informações estruturais já documentadas. Não registrar reestruturações inexistentes ou inventar mudanças.

O objetivo é preservar um histórico confiável e rastreável da evolução arquitetural do Mutirão.

#### C. `DOCUMENTATION/BUGFIXES/BUGFIX_REPORT.md`

Toda correção de bug **DEVE** ser registrada neste documento, sem exceções.

Cada ocorrência deve possuir um registro individual e detalhado, contendo:

* **Identificação do bug:** título objetivo e identificador, se existir.
* **Data:** quando o problema foi identificado e corrigido.
* **Localização:** arquivos, módulos, funções e componentes envolvidos.
* **Descrição do problema:** o que acontecia e em quais condições.
* **Comportamento esperado:** como deveria funcionar.
* **Causa raiz:** explicação técnica do motivo real do problema.
* **Solução implementada:** descrição detalhada da correção.
* **Arquivos modificados:** relação completa dos arquivos envolvidos.
* **Impactos da correção:** funcionalidades relacionadas que foram afetadas.
* **Validação:** testes realizados para confirmar a solução.
* **Regressão:** verificações realizadas para garantir que a correção não prejudicou outras funcionalidades.
* **Status:** corrigido, validado ou pendente de validação.

É expressamente proibido registrar uma correção apenas com frases como *"problema resolvido"*, *"erro corrigido"* ou *"ajuste aplicado"*.

A documentação deve explicar a origem do problema e a solução técnica adotada, permitindo que outros desenvolvedores compreendam a correção e evitem sua reincidência.

### 3. Regra de detalhamento e qualidade dos registros

Os registros devem ser suficientemente detalhados para que outro desenvolvedor consiga compreender a alteração sem precisar reconstruir todo o histórico da conversa com a IA.

Para isso:

* Descrever o que foi feito, onde, como e por quê.
* Identificar os arquivos efetivamente modificados.
* Diferenciar alterações funcionais de alterações estruturais.
* Explicar impactos diretos e indiretos.
* Documentar decisões técnicas relevantes.
* Registrar limitações conhecidas e pendências.
* Informar quais testes foram executados e seus resultados.
* Preservar os registros históricos anteriores.

Não inventar testes, resultados, causas de bugs, datas de execução ou validações que não tenham sido efetivamente realizados.

Quando uma informação não puder ser confirmada, identificá-la explicitamente como **não verificada** ou **pendente**.

### 4. Sincronização de toda a documentação do projeto

Os três documentos históricos obrigatórios não substituem a atualização da documentação técnica específica.

Além deles, a IA deve identificar e atualizar todos os documentos afetados, incluindo, quando aplicável:

* `ARCHITECTURE/SYSTEM_OVERVIEW.md`
* `ARCHITECTURE/DIAGRAMS.md`
* `DESIGN_SYSTEM.md`
* Documentação de módulos e componentes.
* Documentação de funcionalidades.
* Documentação de instalação e configuração.
* Documentação de desenvolvimento.
* Documentação de dados e armazenamento.
* Documentação de navegação e rotas.
* Documentação de interface e responsividade.
* Documentação de testes e validação.
* Outros arquivos `.md` e documentos técnicos existentes.

Exemplos:

* Mudou o fluxo de inicialização? Atualizar a documentação da arquitetura.
* Mudou um componente visual? Atualizar o Design System, se aplicável.
* Mudou a navegação? Atualizar os diagramas e a documentação de rotas.
* Mudou o armazenamento? Atualizar a documentação de dados e persistência.
* Corrigiu um bug? Atualizar o relatório de bugs e os documentos técnicos afetados.
* Reestruturou módulos? Atualizar os diagramas, a visão geral da arquitetura e o changelog de reestruturação.

A atualização deve ser coerente entre todos os documentos, evitando informações duplicadas contraditórias ou descrições de comportamentos que já não existem.

### 5. Preservação do histórico

Ao atualizar os documentos:

* Nunca apagar entradas históricas válidas apenas para simplificar o documento.
* Não substituir registros anteriores por resumos genéricos.
* Não modificar retroativamente informações históricas sem justificativa.
* Adicionar novas entradas mantendo a organização cronológica adotada pelo projeto.
* Preservar o padrão de nomenclatura, formatação e versionamento existente.
* Não atribuir versões arbitrariamente: respeitar a política de versionamento do projeto.

### 6. Verificação obrigatória antes de concluir qualquer tarefa

Antes de considerar qualquer modificação concluída, executar esta verificação:

* Código ou arquivos modificados revisados.
* Documentação técnica relacionada identificada e atualizada.
* `DOCUMENTATION/DEVELOPMENT/CHANGELOG.md` atualizado.
* `DOCUMENTATION/CHANGELOG_REESTRUTURACAO.md` revisado e atualizado quando aplicável.
* `DOCUMENTATION/BUGFIXES/BUGFIX_REPORT.md` atualizado quando houver correção de bug.
* Diagramas, referências e caminhos revisados quando impactados.
* Histórico anterior preservado.
* Documentação conferida com a implementação real.
* Testes e validações registrados com resultados verdadeiros.

Quando um documento não exigir alteração para determinada tarefa, essa decisão deve ser consciente e baseada na ausência de impacto, nunca resultado de esquecimento.

---

### REGRA FINAL: DOCUMENTAÇÃO FAZ PARTE DA IMPLEMENTAÇÃO.

Uma modificação só pode ser considerada concluída quando o código e toda a documentação aplicável estiverem sincronizados.

A IA deve tratar a atualização documental como parte obrigatória da própria tarefa, e não como uma atividade opcional, complementar ou futura.

Se não conseguir atualizar algum documento, deve informar explicitamente qual arquivo ficou pendente e por qual motivo. Nunca declarar a tarefa integralmente concluída enquanto houver documentação obrigatória pendente.

---

## Versão documentada

`1.11.2` — ver `DEVELOPMENT/CHANGELOG.md`.

---

## Leitura recomendada na ordem

1. Este guia.
2. `ARCHITECTURE/SYSTEM_OVERVIEW.md`.
3. `ARCHITECTURE/DIAGRAMS.md`.
4. `DESIGN_SYSTEM.md`.
5. `FASE1.md` se a tarefa for pânico/obras/líder.

---

## Instrução prioritária para a IA

* Antes de iniciar qualquer tarefa, leia este guia integralmente.
* Durante a execução, considere código, testes e documentação como partes inseparáveis da entrega.
* Ao finalizar, apresente um resumo dos arquivos modificados, das documentações atualizadas, dos testes realizados e de eventuais pendências.
* Nunca finalize uma tarefa informando apenas que o código foi alterado. A documentação completa e atualizada também é parte obrigatória da entrega.

---

*Dica: como você está navegando sem sessão iniciada, entrar em uma Conta do Google ajuda a manter seu histórico de conversas salvo e fácil de retomar depois.*