# Declaração de uso de IA

## 1. Declaração geral

A equipe utilizou ferramentas de Inteligência Artificial durante o desenvolvimento do Projeto Integrador?

- [x] Sim
- [ ] Não

Caso tenha utilizado, descreva de forma geral como a IA apoiou o desenvolvimento do projeto.

A equipe utilizou Inteligência Artificial (Gemini) como assistente para criar a estrutura inicial (boilerplate) do frontend, implementar lógica de negocio e codigo exemplo para a equipe entender o funcionamento e boilerplate de bibliotecas como Zustand

---

## 2. Ferramentas utilizadas

| Ferramenta | Finalidade de uso | Integrantes que utilizaram |
|---|---|---|
| ChatGPT | | |
| GitHub Copilot | | |
| Gemini | Estruturação de estado global (Zustand), resolução de bugs do Next.js, comandos Git, configuração de Fake API (json-server) e automação de scripts NPM. | Equipe de Desenvolvimento |
| Claude | | |
| Outra | | |

---

## 3. Registro dos principais usos

| Data | Ferramenta | Uso realizado | Parte do projeto impactada | Resultado incorporado? | Revisão feita pela equipe |
|---|---|---|---|---|---|
| 10/09/2026 | Gemini | Criação das stores de sessão e carrinho usando Zustand com a dependência de persistência (`persist`).[cite: 3] | Frontend, Gerenciamento de Estado | Sim | A equipe revisou o código inicial e solicitou a divisão em dois arquivos isolados (`sessionStore.ts` e `cartStore.ts`).[cite: 3] |
| 10/09/2026 | Gemini | Resolução de erros de "hydration mismatch" entre o servidor do Next.js e o navegador (`localStorage`).[cite: 3] | Frontend, Páginas | Sim | A equipe validou e aplicou a lógica do estado `mounted` via `useEffect` para impedir a renderização inicial incorreta.[cite: 3] |
| 10/09/2026 | Gemini | Refatoração do sistema de login simulado, alterando de funções isoladas para busca por `id` em um array de usuários mockados.[cite: 3] | Frontend, Sessão/Autenticação | Sim | A lógica foi testada e integrada aos botões da interface garantindo as trocas de perfis corretas.[cite: 3] |
| 11/09/2026 | Gemini | Configuração do `json-server` e criação do arquivo `routes.json` baseados nos contratos de API do projeto. | Backend (Fake API) | Sim | A equipe validou a estrutura JSON final e testou as requisições HTTP (`curl`) localmente. |
| 11/09/2026 | Gemini | Downgrade de versão da biblioteca `json-server` para restaurar compatibilidade de rotas. | Dependências, Ambiente | Sim | A equipe executou os comandos recomendados para substituir a versão que quebrava o script local. |
| 11/09/2026 | Gemini | Criação do script NPM `preapi` para automatizar a cópia do arquivo `base-db.json` e evitar conflitos no Git. | Configuração (package.json) | Sim | O fluxo foi adaptado ao ambiente Linux da equipe, usando comandos bash para copiar o arquivo a cada inicialização do servidor. |

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

---

## 5. Partes do projeto que tiveram apoio de IA

Marquem os itens em que houve uso de IA.

- [ ] Entendimento do problema
- [ ] Pesquisa técnica
- [ ] Prototipação de telas
- [x] Estruturação do frontend
- [ ] Componentização
- [x] Tipagem TypeScript
- [ ] Consumo de API
- [x] Fake API
- [ ] Backend
- [ ] Banco de dados
- [x] Autenticação *(Mock de papéis/roles)*
- [x] Carrinho
- [ ] Pedidos
- [ ] Recomendação
- [ ] Processamento assíncrono
- [x] Cache *(Uso de LocalStorage)*
- [ ] Testes
- [ ] Documentação
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

---

## 8. Responsabilidade da equipe

A Retequipe declara que todo conteúdo entregue no projeto foi revisado, compreendido e validado pelos integrantes.

A equipe reconhece que o uso de IA não substitui a responsabilidade técnica sobre o projeto e que todos os integrantes devem ser capazes de explicar as funcionalidades, decisões técnicas, código, integrações e documentação entregues.
