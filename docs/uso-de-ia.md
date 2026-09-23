# Declaração de uso de IA

## 1. Declaração geral

A equipe utilizou ferramentas de Inteligência Artificial durante o desenvolvimento do Projeto Integrador?

- [x] Sim
- [ ] Não

Caso tenha utilizado, descreva de forma geral como a IA apoiou o desenvolvimento do projeto.

A equipe utilizou Inteligência Artificial (Gemini) como assistente para criar a estrutura inicial (boilerplate) do frontend, implementar lógica de negocio e codigo exemplo para a equipe entender o funcionamento e boilerplate de bibliotecas como Zustand. Além disso, a IA apoiou o entendimento do ciclo de vida de renderização do Next.js (Hydration), estruturou requisições HTTP (Axios) para a Fake API, e ajudou a depurar erros lógicos no fluxo de hooks do React.
---

## 2. Ferramentas utilizadas

| Ferramenta | Finalidade de uso | Integrantes que utilizaram |
|---|---|---|
| ChatGPT | | |
| GitHub Copilot | | |
| Gemini | Estruturação de estado global (Zustand), resolução de bugs do Next.js, comandos Git, configuração de Fake API (json-server) e automação de scripts NPM. | Paulo Nery |
| Claude | | |
| Outra | | |

---

## 3. Registro dos principais usos

| Data | Ferramenta | Uso realizado | Parte do projeto impactada | Resultado incorporado? | Revisão feita pela equipe |
|---|---|---|---|---|---|
| 10/09/2026 | Gemini | Criação das stores de sessão e carrinho usando Zustand com a dependência de persistência (`persist`).| Frontend, Gerenciamento de Estado | Sim | A equipe revisou o código inicial e solicitou a divisão em dois arquivos isolados (`sessionStore.ts` e `cartStore.ts`).|
| 10/09/2026 | Gemini | Resolução de erros de "hydration mismatch" entre o servidor do Next.js e o navegador (`localStorage`). | Frontend, Páginas | Sim | A equipe validou e aplicou a lógica do estado `mounted` via `useEffect` para impedir a renderização inicial incorreta. |
| 10/09/2026 | Gemini | Refatoração do sistema de login simulado, alterando de funções isoladas para busca por `id` em um array de usuários mockados. | Frontend, Sessão/Autenticação | Sim | A lógica foi testada e integrada aos botões da interface garantindo as trocas de perfis corretas. |
| 11/09/2026 | Gemini | Configuração do `json-server` e criação do arquivo `routes.json` baseados nos contratos de API do projeto. | Backend (Fake API) | Sim | A equipe validou a estrutura JSON final e testou as requisições HTTP (`curl`) localmente. |
| 11/09/2026 | Gemini | Downgrade de versão da biblioteca `json-server` para restaurar compatibilidade de rotas. | Dependências, Ambiente | Sim | A equipe executou os comandos recomendados para substituir a versão que quebrava o script local. |
| 11/09/2026 | Gemini | Criação do script NPM `preapi` para automatizar a cópia do arquivo `base-db.json` e evitar conflitos no Git. | Configuração (package.json) | Sim | O fluxo foi adaptado ao ambiente Linux da equipe, usando comandos bash para copiar o arquivo a cada inicialização do servidor. |
| 13/09/2026 | Gemini | Explicação do ciclo de hidratação e implementação de Proteção de Rotas (Route Guards) para as páginas de Dashboard e Login. | Frontend, Roteamento | Sim | A equipe posicionou as barreiras de retorno nulo (`return null`) rigorosamente após a declaração dos hooks, respeitando as regras do React. |
| 13/09/2026 | Gemini | Implementação de serviços HTTP (Axios) para Login e Cadastro na Fake API, utilizando o utilitário TypeScript `Omit` para ignorar o campo `id`. | Frontend, Consumo de API | Sim | O código foi integrado aos formulários de autenticação de Clientes e Artesãos, permitindo a persistência simulada. |
| 14/09/2026 | Gemini | Conversão dos formulários de autenticação e registro para componentes básicos do Chakra UI v3 (`Field.Root`, `Grid`, `Box`, `Button`). | Frontend, Componentização/UI | Sim | A equipe validou a estrutura visual, o uso de temas personalizados (`brand`) e o comportamento responsivo dos inputs. |
| 14/09/2026 | Gemini | Implementação de validação de duplicidade de E-mail e CPF nos serviços de cadastro (`userService`) com tratamento de exceções via `throw new Error`. | Frontend/Backend, Validação de Dados | Sim | A equipe revisou a captura de erros no bloco `catch` dos formulários e testou as mensagens personalizadas exibidas aos usuários. |
| 14/09/2026 | Gemini | Adaptação do cadastro de Clientes para suportar a nova estrutura complexa de dados do tipo `Endereco` (array de objetos). | Frontend, Tipagem TypeScript | Sim | A equipe validou o mapeamento correto dos inputs do formulário para o payload esperado pela API. |
| 15/09/2026 | Gemini | Criação do Documento de Requisitos de Software | Gestão de Projeto / Documentação | Sim | A equipe validou os requisitos com as histórias de usuário criado previamente |
| 16/09/2026 | Gemini | Criação do dos documentos de Spec-Driven Development | Gestão de Projeto / Documentação | Sim | A equipe revisou e centralizou a terminologia usada nos requerimentos |
| 18/09/2026 | Gemini | Implementação de rotas dinâmicas no Next.js usando o formato amigável para SEO `[slug]` (`titulo-id`) em substituição ao roteamento simples de ID. | Frontend, Roteamento | Sim | A equipe implementou o utilitário `createSlug`, atualizou os componentes de link e ajustou a lógica de `decodeURIComponent` e `split` no componente de página para garantir que a API receba a string correta do ID do produto. |
| 18/09/2026 | Gemini | Resolução de bugs e otimização de `useEffect`. A IA ajudou a corrigir arrays de dependência incompletos na lógica de busca com debounce (evitando "stale closures") e corrigiu erros onde tipos `string` vs `number` causavam erros 404 em chamadas da API do Axios. | Frontend, Otimização de Performance e Consumo de API | Sim | A equipe envolveu funções em `useCallback`, removeu conversões impróprias de `Number()` e corrigiu os blocos `try/catch` para expor de forma adequada as falhas de API (ex: `getArtesaoById`). |
21/09/2026 | Gemini | Estruturação da API de Pedidos (/orders), criação de interface individual de compras e mesclagem de tabelas de vendas no Dashboard do Artesão. | Frontend, Pedidos e Tipagem | Sim | A equipe validou as alterações de interface para exibir os detalhes de envio e do comprador para o artesão.
21/09/2026 | Gemini | Resolução de cache de navegador em requisições GET utilizando um timestamp (_t) no Axios. | Frontend, Consumo de API | Sim | O código foi incorporado no orderService para forçar a exibição de vendas recém-feitas na tela do artesão em tempo real.
21/09/2026 | Gemini | Unificação das páginas de Checkout e Pagamento e adição de fluxo de envio ("Declarar Postagem") via PATCH. | Frontend, Fluxo de Compra e Envios | Sim | A equipe substituiu os fluxos separados por um checkout mais robusto e validou os modais de inserção de código de rastreio.
21/09/2026 | Gemini	Criação do Dashboard Administrativo com cards de estatísticas (Total Arrecadado, Itens Vendidos, Pendências). | Frontend, Dashboard Admin | Sim | A equipe testou o fluxo de login de administrador e a renderização correta dos cálculos com base na API.
| 21/09/2026 | Gemini | Implementação do endpoint de avaliações, página de acompanhamento de pedidos para o comprador (`/customer/pedidos`), fluxos de confirmação de recebimento, submissão de reviews (nota 0-10 com limite de 2000 caracteres) e atualização dinâmica de nota média do artesão. | Backend, Avaliações, Pedidos e Vitrine | Sim | A equipe validou a persistência dos dados no json-server, a restrição de caracteres/nota e a listagem correta das últimas 5 reviews e nota média na página do produto. |
| 23/09/2026 | Gemini | Criação de header de navegação e substituição de avaliações hard coded pela integração com a API de avaliações. | Frontend, Painel do Artesão | Sim | A equipe validou a requisição dupla (Promise.all) e a exibição condicional no painel do artesão. |
| 23/09/2026 | Gemini | Implementação da dedução automática de estoque de produtos no momento de confirmação da compra via requisição `PATCH`. | Frontend/Backend, Checkout e Integração | Sim | A equipe testou o fluxo simulado de pagamento e validou a baixa correta do estoque no banco simulado. |
| 23/09/2026 | Gemini | Adição de dados realistas de avaliações na base de testes (`base-db.json`) para renderizar a reputação correta do vendedor. | Banco de Dados / Fake API | Sim | O arquivo `base-db.json` foi atualizado para inicializar corretamente com métricas prontas. |
| 23/09/2026 | Gemini | Implementação de tabela de histórico completo de compras no painel de Administrador, com recursos de filtragem por comprador, status de envio e conversão visual do ID do artesão pelo Nome. | Frontend, Dashboard Admin | Sim | A equipe validou o cruzamento de dados de `/orders` e `/artesaos`. |
| 23/09/2026 | Gemini | Correção da validação de limite de itens ao adicionar no carrinho a partir da página do produto e diferenciação de feedback visual ("Esgotado" vs "Limite atingido"). | Frontend, Produto e Carrinho | Sim | A IA resolveu um problema de tipagem (String vs Number) que impedia o cálculo correto do estoque restante com o carrinho. |

---

## 4. Prompts ou descrições relevantes

### Prompt 1

Prompt ou descrição:

> "create boilerplate for using zustand in react to keep track of a shopping cart and log in session(visitante, comprador, artesao)... is should persist when user closes the app and comes back the next day"

Como a resposta foi utilizada:

> A base gerada foi utilizada para configurar os stores principais do projeto (`sessionStore` e `cartStore`). A equipe utilizou as recomendações do middleware `persist` do Zustand para salvar os dados no navegador de forma que o carrinho e a sessão do usuário permaneçam salvos ao recarregar a página.

### Prompt 2

Prompt ou descrição:

> A equipe informou problemas onde a aplicação exibia um estado padrão por um segundo antes de carregar o usuário correto do localStorage ("the app shows the default state for a second before showing the correct one") e questionou sobre como corrigir erros de hidratação.

Como a resposta foi utilizada:

> O código fornecido pela IA para adicionar um estado `mounted` usando `useState` e `useEffect` foi incorporado nas páginas (`page.tsx` e `ola-role/page.tsx`). A equipe garantiu que o componente só renderizasse as informações de sessão e carrinho após a montagem segura no navegador, removendo as falhas visuais.

### Prompt 3

Prompt ou descrição:
> "i want to use json-server to create at least these gateways... [contratos em XLSX e PDF anexados detalhando rotas GET, POST, PATCH, DELETE para Produtos, Artesãos e Clientes]"

Como a resposta foi utilizada:
> A resposta orientou a criação do arquivo `routes.json` para prefixar as rotas da Fake API com `/api/v1/` e estruturou o banco de dados inicial (`base-db.json`) contendo todos os atributos exigidos nos contratos. As orientações permitiram testar a API mockada de forma isolada antes da construção do backend real.

### Prompt 4

Prompt ou descrição:
> "what is the best place to put if(!mounted || isCustomerLogged()) return null; ?"

Como a resposta foi utilizada:
> A resposta confirmou o local exato (antes do retorno JSX e após todas as declarações de Hooks) e explicou os motivos técnicos (Rules of Hooks), o que auxiliou a equipe a aplicar a lógica de proteção de rota de maneira segura nas páginas de Dashboard sem gerar erros no React

### Prompt 5

Prompt ou descrição:
> por favor altere pra user componentes basico de chakra ui

Como a resposta foi utilizada:
> deu um boilerplate bonito

### Prompt 6

Prompt ou descrição:
> change this to check if someone with the same email or cpf already exists, and return a different error for each

Como a resposta foi utilizada:
> depois de algumas iterações foi mantido o try catch

### Prompt 7

Prompt ou descrição:
> Utilizando o Documento de Requisitos, faca o design.md: Deve descrever diagrama de componentes; fluxo dos dados; modelo de dados; estratégia principal e baseline; interface de integração; exemplo de requisição e resposta; tratamento de erros [...]

Como a resposta foi utilizada:
> Utilizada para gerar os arquivos em Markdown do ciclo de Spec-Driven Development (product.md, requirements.md e design.md), convertendo todos os 31 requisitos para a sintaxe formal EARS, detalhando a arquitetura técnica (diagramas, schema SQL, contratos JSON/REST e políticas de fallback) e criando a folha de rosto individual com a tabela de auditoria do uso de IA.

### Prompt 8

Prompt ou descrição:
> "in Nextjs, I can use [id] to create a link with that id for every product, but could I do something like [id+titulo] ?" e atualizações subsequentes para corrigir falhas de `undefined` na obtenção de rotas dinâmicas.

Como a resposta foi utilizada:
> A resposta permitiu refatorar as URLs de produto da aplicação para torná-las amigáveis para SEO. A equipe criou o helper `createSlug`, modificou a pasta `app/product/[id]` para `app/product/[slug]`, e assegurou que o componente de página decodificasse adequadamente e analisasse o ID do parâmetro de URL antes de acionar as chamadas de API.

### Prompt 9

Prompt ou descrição:

> "combine /customer/checkout e /customer/pagamento para uma unica pagina que cria o pedido... adicione situacaoEntrega e codigoPostagem a interface de orders... adicione um botao 'Declarar Postagem' que salva um codigo no codigoPostagem e muda situacaoEntrega para 'Enviado'"

Como a resposta foi utilizada:
> A IA auxiliou na unificação do fluxo do usuário comprador em uma única tela de Checkout otimizada. Além disso, permitiu expandir a interface do pedido e adicionar um modal no painel do artesão para submissão de códigos de rastreamento de envios (atualização via método PATCH).

### Prompt 10

Prompt ou descrição:
> "crie uma pagina simples de admin para ver estatisticas das compras. use como base [código da página administrativa atual]"

Como a resposta foi utilizada:
> A IA gerou um painel de administração estruturado, consumindo o serviço de pedidos (/orders) para calcular e renderizar cards de estatísticas globais (Volume Financeiro, Total de Pedidos, Peças Vendidas e Entregas Pendentes) usando os componentes visuais do Chakra UI.

### Prompt 11

Prompt ou descrição:
> "crie um endpoint para avaliações, a interface deve ter idComprador, idArtesao, idProduto, notaMedia... crie uma pagina para /customer/pedidos que deve permitir usuarios verem seus pedidos... quando declarado recebido o produto, comprador tem opção de deixar um review de 0 a 10 pro produto com uma descrição de até 2000 caracteres. faça aparecer as 5 ultimas reviews e a nota média do artesao em seus produtos"

Como a resposta foi utilizada:
> A IA auxiliou na criação do ecossistema completo de avaliações (endpoint `/avaliacoes`, cálculo dinâmico de nota média e contagem no perfil do artesão), desenvolvimento da página de gerenciamento de pedidos do cliente com rastreio e botões de confirmação de entrega, além da estruturação do modal de submissão de reviews (0 a 10 com limitação de 2000 caracteres) e exibição das 5 últimas reviews na vitrine pública do produto.

### Prompt 12

Prompt ou descrição:
> "altere carrinho para reduzir do estoque a quantidade que é comprada" e "faça que /admin mostre uma lista com todas as compras, podendo filtrar por comprador, vendedor, estado de envio" e "use nome do vendedor inves de id"

Como a resposta foi utilizada:
> A resposta da IA serviu para conectar múltiplos pontos do sistema simultaneamente: implementamos o `PATCH` de atualização de estoque (deduzindo a quantidade comprada) no momento da finalização da venda, e ao mesmo tempo estruturamos a tabela do Admin para mapear os pedidos, convertendo os IDs criptografados dos artesãos para seus nomes reais e aplicando filtros combinados.

### Prompt 13

Prompt ou descrição:
> "altere /product para contar quantos ja tem no carrinho para nao ser possivel adicionar no carrinho uma quantidade alem do estoque" e "se o item já tiver no carrinho, diga 'limite atingido no carrinho' inves de 'esgotado'"

Como a resposta foi utilizada:
> A IA identificou e resolveu um problema lógico sutil em que as comparações de ID no Zustand estavam quebrando por conta da conversão indevida para `Number()`. A correção garantiu a estabilidade do carrinho e melhorou a experiência visual diferenciando um produto puramente sem estoque de um produto cujas últimas unidades já estão na posse (carrinho) do próprio cliente.

---

## 5. Partes do projeto que tiveram apoio de IA

Marquem os itens em que houve uso de IA.

- [x] Entendimento do problema
- [ ] Pesquisa técnica
- [x] Prototipação de telas
- [x] Estruturação do frontend
- [x] Componentização
- [x] Tipagem TypeScript
- [x] Consumo de API
- [x] Fake API
- [ ] Backend
- [ ] Banco de dados
- [x] Autenticação *(Mock de papéis/roles)*
- [x] Carrinho
- [x] Pedidos
- [ ] Recomendação
- [ ] Processamento assíncrono
- [x] Cache *(Uso de LocalStorage)*
- [ ] Testes
- [x] Documentação
- [ ] README
- [ ] Deploy *(Apoio inicial com comandos de inicialização Git/GitHub)*
- [x] Correção de bugs
- [ ] Outro:

---

## 6. Validação humana

A equipe declara que:

- [x] Todo código gerado ou sugerido por IA foi revisado pelos integrantes.
- [x] O código incorporado foi testado antes da entrega.
- [x] A equipe compreende as partes implementadas com apoio de IA.
- [x] A equipe está apta a explicar tecnicamente as decisões tomadas.
- [x] Nenhuma parte relevante foi incorporada sem análise, adaptação ou validação.
- [x] As limitações, erros ou sugestões inadequadas da IA foram avaliadas pela equipe.

---

## 7. Limitações e problemas encontrados

Registro da equipe:

- A IA sugeriu, em uma de suas otimizações de código para focar na lógica, a remoção completa do CSS (bordas, flexbox e preenchimentos) que já havíamos estabelecido para a tela. A equipe descartou o código não estilizado gerado pela IA e exigiu a inserção da lógica de hidratação sem alterar a interface original, mantendo nossa estrutura visual intacta.
- A IA inicialmente modelou a troca de usuários com funções dedicadas repetitivas (`loginAsVisitante`, `loginAsComprador`). A equipe descartou essa abordagem e solicitou uma refatoração implementando uma busca otimizada por `id` em um vetor unificado (`login(id)`), garantindo uma estrutura de código mais limpa e escalável para a simulação da sessão.
- Falta de extensões em arquivos: a IA recomendou arquivos sem enfatizar que, devido à sintaxe JSX no Next.js (Turbopack), os arquivos precisavam obrigatoriamente da extensão `.tsx`, ocasionando um erro de "The default export is not a React Component". A equipe corrigiu renomeando o arquivo.
- Conflito de versão na dependência: a IA gerou scripts para o `json-server` utilizando a flag `--routes`, que foi removida nas versões 1.0+ da ferramenta, quebrando a inicialização da API local. A equipe precisou intervir, relatar o erro de terminal ("Unknown option '--routes'") e aplicar um downgrade forçado para a versão `0.17.4` para restaurar o funcionamento da Fake API.
- Gestão de versão do banco de dados: a IA sugeriu inicialmente usar o `.gitignore` para mascarar as alterações do arquivo `db.json`, o que falhou pois o arquivo já estava sendo rastreado pelo Git. A equipe interveio e alterou a estratégia para uma abordagem de template, criando um `base-db.json` e automatizando sua cópia para um `running-db.json` via script no NPM.
- Tela em branco por dependência de Hooks: Durante a implementação da proteção do Dashboard, a equipe enfrentou um erro de "not loading" (tela em branco). A IA foi utilizada para diagnosticar que o gatilho de redirecionamento falhava por conta de um array de dependências vazio `[]` no `useEffect`, além de uma inconsistência de tipagem (`nome` vs `nomeArtesao`) não alinhada ao contrato da API. A equipe corrigiu ambas as falhas guiada pela explicação técnica.
- Limite de tokens
- Queria tratar erros quebrando o programa


---

## 8. Responsabilidade da equipe

A Retequipe declara que todo conteúdo entregue no projeto foi revisado, compreendido e validado pelos integrantes.

A equipe reconhece que o uso de IA não substitui a responsabilidade técnica sobre o projeto e que todos os integrantes devem ser capazes de explicar as funcionalidades, decisões técnicas, código, integrações e documentação entregues.
