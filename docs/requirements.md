# Requisitos do Sistema — Marketplace de Artesanato

## Requisitos Funcionais (RF)

### RF01 — Cadastrar Comprador
**Como** visitante, **quero** me cadastrar como comprador, **para** adicionar itens ao carrinho e finalizar pedidos.
* **Critério 1.1 (Event-driven):** QUANDO o visitante enviar o formulário com nome, e-mail, senha e CPF preenchidos corretamente, O MÓDULO DE AUTENTICAÇÃO DEVERÁ criar a conta de comprador e retornar o código HTTP 201.
* **Critério 1.2 (Unwanted behavior):** SE o visitante tentar cadastrar um e-mail já existente no banco de dados, ENTÃO O MÓDULO DE AUTENTICAÇÃO DEVERÁ retornar o código de erro HTTP 409.

### RF02 — Login Comprador
**Como** comprador, **quero** realizar login no sistema, **para** acessar minha conta e acompanhar minhas compras.
* **Critério 2.1 (Event-driven):** QUANDO o comprador fornecer e-mail e senha válidos, O MÓDULO DE AUTENTICAÇÃO DEVERÁ emitir um token JWT e redirecionar o usuário para a página de origem ou página inicial.
* **Critério 2.2 (Unwanted behavior):** SE o comprador informar credenciais inválidas, ENTÃO O MÓDULO DE AUTENTICAÇÃO DEVERÁ retornar o código HTTP 401 mantendo uma mensagem genérica por razões de segurança.

### RF03 — Buscar e Filtrar Produtos por Categoria e Região
**Como** comprador, **quero** pesquisar produtos por categoria e região, **para** encontrar itens do meu interesse.
* **Critério 3.1 (Event-driven):** QUANDO o comprador aplicar filtros de categoria e/ou região, O MÓDULO DE CATÁLOGO DEVERÁ retornar apenas os produtos que atendam simultaneamente aos filtros selecionados.
* **Critério 3.2 (State-driven):** ENQUANTO não houver produtos correspondentes ao filtro aplicado, O MÓDULO DE CATÁLOGO DEVERÁ exibir uma lista vazia com mensagem informativa.

### RF04 — Consultar Frete
**Como** comprador, **quero** consultar o frete durante a compra, **para** saber o custo total e prazo do pedido.
* **Critério 4.1 (Event-driven):** QUANDO o comprador inserir um CEP de destino válido no carrinho, O MÓDULO DE LOGÍSTICA DEVERÁ retornar as opções de frete disponíveis com prazos e valores.
* **Critério 4.2 (Unwanted behavior):** SE o CEP informado estiver fora da área de entrega, ENTÃO O MÓDULO DE LOGÍSTICA DEVERÁ informar a indisponibilidade de entrega para a localidade.

### RF05 — Adicionar Item ao Carrinho
**Como** comprador, **quero** adicionar um produto ao carrinho, **para** prosseguir com a compra.
* **Critério 5.1 (Event-driven):** QUANDO o comprador solicitar a adição de um produto com estoque disponível, O MÓDULO DE CARRINHO DEVERÁ incluir o item e sua quantidade no carrinho do usuário.
* **Critério 5.2 (Unwanted behavior):** SE a quantidade solicitada for superior ao estoque disponível ou igual a zero, ENTÃO O MÓDULO DE CARRINHO DEVERÁ bloquear a adição e exibir uma mensagem de erro indicando o limite de estoque.

### RF06 — Finalizar Pedido
**Como** comprador, **quero** finalizar um pedido, **para** adquirir os produtos contidos no carrinho.
* **Critério 6.1 (Event-driven):** QUANDO o comprador confirmar o checkout com endereço cadastrado e pagamento aprovado, O MÓDULO DE PEDIDOS DEVERÁ registrar o pedido, atualizar o estoque dos produtos e disponibilizar o comprovante.
* **Critério 6.2 (State-driven):** ENQUANTO o comprador não possuir um endereço de entrega vinculado à conta, O MÓDULO DE PEDIDOS DEVERÁ impedir a conclusão do checkout.
* **Critério 6.3 (Unwanted behavior):** SE o pagamento for recusado ou o carrinho estiver vazio, ENTÃO O MÓDULO DE PEDIDOS DEVERÁ interromper a finalização e notificar o usuário.

### RF07 — Avaliar Compra
**Como** comprador, **quero** avaliar minha compra, **para** compartilhar minha experiência com o vendedor e outros usuários.
* **Critério 7.1 (Event-driven):** QUANDO o comprador enviar nota e comentário para um pedido com status "Entregue", O MÓDULO DE AVALIAÇÕES DEVERÁ registrar a avaliação no histórico da compra, no produto e no perfil do artesão.
* **Critério 7.2 (Unwanted behavior):** SE o pedido não estiver com status "Entregue" ou já possuir avaliação anterior, ENTÃO O MÓDULO DE AVALIAÇÕES DEVERÁ rejeitar a submissão.

### RF08 — Navegar na Vitrine
**Como** comprador, **quero** navegar pela vitrine principal, **para** descobrir novos produtos e artesãos.
* **Critério 8.1 (Event-driven):** QUANDO o usuário acessar a página inicial, O MÓDULO DE VITRINE DEVERÁ carregar a lista de produtos em destaque e as categorias cadastradas.

### RF09 — Visualizar Detalhes do Produto
**Como** comprador, **quero** visualizar as informações detalhadas de um produto, **para** compreender suas características antes da compra.
* **Critério 9.1 (Event-driven):** QUANDO o comprador selecionar um produto ativo na vitrine, O MÓDULO DE CATÁLOGO DEVERÁ exibir fotos, descrição, técnica, matéria-prima, categoria, preço, quantidade em estoque e nome do artesão.
* **Critério 9.2 (Unwanted behavior):** SE o produto estiver inativo ou desativado, ENTÃO O MÓDULO DE CATÁLOGO DEVERÁ retornar o código HTTP 404 informando a indisponibilidade do item.

### RF10 — Visualizar Perfil do Artesão
**Como** comprador, **quero** acessar o perfil do artesão, **para** conhecer sua trajetória e visualizar outros produtos de seu catálogo.
* **Critério 10.1 (Event-driven):** QUANDO o comprador clicar no nome do artesão, O MÓDULO DE PERFIL DEVERÁ exibir a biografia, localização e o catálogo completo de produtos do vendedor.

### RF11 — Cadastrar e Gerenciar Endereços de Entrega
**Como** comprador, **quero** cadastrar e salvar endereços de entrega, **para** facilitar compras futuras.
* **Critério 11.1 (Event-driven):** QUANDO o comprador salvar um novo endereço com CEP, logradouro, número, bairro, cidade e estado, O MÓDULO DE USUÁRIOS DEVERÁ vincular o endereço ao perfil do comprador.
* **Critério 11.2 (Event-driven):** QUANDO o comprador solicitar a exclusão de um endereço salvo, O MÓDULO DE USUÁRIOS DEVERÁ remover o registro e confirmar a operação.

### RF12 — Visualizar Avaliações
**Como** comprador, **quero** ler avaliações de outros usuários, **para** obter segurança quanto à qualidade dos produtos e atendimento do artesão.
* **Critério 12.1 (Event-driven):** QUANDO o comprador acessar a seção de avaliações na página do produto ou do artesão, O MÓDULO DE AVALIAÇÕES DEVERÁ calcular e exibir a nota média, lista de comentários e fotos associadas.

### RF13 — Acessar Painel Comprador
**Como** comprador, **quero** acessar meu painel de controle, **para** visualizar meus pedidos e histórico de compras de forma centralizada.
* **Critério 13.1 (Event-driven):** QUANDO o comprador autenticado acessar a área "Meu Painel", O MÓDULO DE PAINEL DEVERÁ retornar o resumo de pedidos recentes, histórico de compras e notificações.
* **Critério 13.2 (Unwanted behavior):** SE o usuário não estiver autenticado, ENTÃO O MÓDULO DE PAINEL DEVERÁ redirecioná-lo para a tela de login.

### RF14 — Cadastrar Vendedor
**Como** artesão, **quero** me cadastrar como vendedor, incluindo minha biografia, **para** anunciar meus produtos.
* **Critério 14.1 (Event-driven):** QUANDO o visitante preencher todos os dados cadastrais obrigatórios, incluindo o nome do ateliê/artesão e a biografia, O MÓDULO DE AUTENTICAÇÃO DEVERÁ criar a conta de vendedor.
* **Critério 14.2 (Unwanted behavior):** SE a biografia ou qualquer outro campo obrigatório estiver em branco, ENTÃO O MÓDULO DE AUTENTICAÇÃO DEVERÁ rejeitar o cadastro com o código HTTP 400.

### RF15 — Login Artesão
**Como** artesão, **quero** realizar login no sistema, **para** acessar meu painel de controle e gerenciar vendas.
* **Critério 15.1 (Event-driven):** QUANDO o artesão informar e-mail e senha corretos, O MÓDULO DE AUTENTICAÇÃO DEVERÁ autenticar o usuário e redirecioná-lo para o painel do artesão.

### RF16 — Acessar Painel Artesão
**Como** artesão, **quero** acessar meu painel de controle, **para** gerenciar vendas e estoque.
* **Critério 16.1 (Event-driven):** QUANDO o artesão autenticado acessar seu painel, O MÓDULO DE PAINEL DEVERÁ exibir o resumo de vendas, controle de estoque e notificações recentes.

### RF17 — Adicionar Produto Único ao Marketplace
**Como** vendedor, **quero** adicionar produtos únicos (como esculturas), **para** defini-los como itens de estoque unitário.
* **Critério 17.1 (Event-driven):** QUANDO o artesão cadastrar um anúncio marcando a opção "item único" e informando a descrição da obra, O MÓDULO DE CATÁLOGO DEVERÁ publicar o produto fixando o estoque em exatamente 1 unidade.

### RF18 — Adicionar Produto em Lote ao Marketplace
**Como** vendedor, **quero** adicionar produtos em lote, **para** definir a quantidade disponível em estoque.
* **Critério 18.1 (Event-driven):** QUANDO o artesão cadastrar um produto do tipo "lote" informando uma quantidade maior que zero, O MÓDULO DE CATÁLOGO DEVERÁ publicar o produto com o número exato de unidades disponíveis.
* **Critério 18.2 (Unwanted behavior):** SE a quantidade informada para o lote for menor ou igual a zero, ENTÃO O MÓDULO DE CATÁLOGO DEVERÁ bloquear a publicação.

### RF19 — Postagem Feita
**Como** vendedor, **quero** registrar a postagem de um pedido, **para** informar o comprador e o sistema sobre o envio.
* **Critério 19.1 (Event-driven):** QUANDO o vendedor registrar um código de rastreio válido para um pedido, O MÓDULO DE LOGÍSTICA DEVERÁ atualizar o status do pedido para "Postado" e notificar o comprador.

### RF20 — Avaliar Venda
**Como** vendedor, **quero** avaliar uma venda, **para** registrar minha experiência com o comprador.
* **Critério 20.1 (Event-driven):** QUANDO o vendedor submeter uma avaliação sobre um pedido concluído, O MÓDULO DE AVALIAÇÕES DEVERÁ vincular a avaliação ao histórico da transação e torná-la visível à administração.

### RF21 — Gerenciar Catálogo
**Como** artesão, **quero** gerenciar as especificações e preços do meu catálogo, **para** manter meus anúncios atualizados.
* **Critério 21.1 (Event-driven):** QUANDO o artesão alterar preço ou descrição de um produto e salvar, O MÓDULO DE CATÁLOGO DEVERÁ atualizar as informações e refleti-las imediatamente para todos os compradores.
* **Critério 21.2 (Unwanted behavior):** SE o artesão informar um preço menor ou igual a zero ou valor não numérico, ENTÃO O MÓDULO DE CATÁLOGO DEVERÁ rejeitar a alteração.

### RF22 — Visualizar Pedidos Recebidos
**Como** artesão, **quero** visualizar os pedidos recebidos, **para** organizar a produção e envio.
* **Critério 22.1 (Event-driven):** QUANDO o artesão consultar a lista de pedidos recebidos, O MÓDULO DE PEDIDOS DEVERÁ exibir os detalhes dos itens solicitados, comprador e endereço para envio.

### RF23 — Gerenciar Perfil
**Como** artesão, **quero** atualizar meus dados pessoais e biografia, **para** manter meu perfil atraente.
* **Critério 23.1 (Event-driven):** QUANDO o artesão alterar sua foto de perfil ou biografia e confirmar, O MÓDULO DE PERFIL DEVERÁ atualizar os dados e refleti-los publicamente.
* **Critério 23.2 (Unwanted behavior):** SE o campo de biografia for esvaziado, ENTÃO O MÓDULO DE PERFIL DEVERÁ impedir o salvamento.

### RF24 — Login Administrador
**Como** administrador, **quero** realizar login no sistema, **para** acessar o painel administrativo.
* **Critério 24.1 (Event-driven):** QUANDO o usuário com perfil de administrador informar e-mail e senha corretos, O MÓDULO DE AUTENTICAÇÃO DEVERÁ liberar o acesso ao painel administrativo.
* **Critério 24.2 (Unwanted behavior):** SE um usuário sem permissão de administrador tentar autenticar-se nessa rota, ENTÃO O MÓDULO DE AUTENTICAÇÃO DEVERÁ negar o acesso e retornar HTTP 403.

### RF25 — Acessar Painel Administrativo
**Como** administrador, **quero** acessar o painel administrativo, **para** gerenciar operações globais da plataforma.
* **Critério 25.1 (Event-driven):** QUANDO o administrador autenticado acessar o painel administrativo, O MÓDULO ADMINISTRATIVO DEVERÁ disponibilizar ferramentas de moderação e emissão de relatórios.

### RF26 — Acompanhar Status da Compra
**Como** administrador, **quero** acompanhar o status das compras, **para** monitorar a operação do marketplace.
* **Critério 26.1 (Event-driven):** QUANDO o administrador acessar a listagem global de transações, O MÓDULO ADMINISTRATIVO DEVERÁ exibir o status detalhado de todos os pedidos cadastrados no sistema.

### RF27 — Monitorar Satisfação do Usuário
**Como** administrador, **quero** monitorar a satisfação dos usuários, **para** identificar oportunidades de melhoria.
* **Critério 27.1 (Event-driven):** QUANDO o administrador consultar o relatório de satisfação, O MÓDULO ADMINISTRATIVO DEVERÁ compilar as avaliações e comentários registrados por compradores e vendedores.

### RF28 — Monitorar Indicadores
**Como** administrador, **quero** monitorar indicadores de desempenho, **para** fundamentar decisões estratégicas.
* **Critério 28.1 (Event-driven):** QUANDO o administrador selecionar um período de análise, O MÓDULO ADMINISTRATIVO DEVERÁ gerar relatórios contendo taxa de conversão, ticket médio e lista de produtos mais vendidos.

### RF29 — Realizar Curadoria
**Como** administrador, **quero** realizar a curadoria de produtos, **para** destacar artesãos e itens na vitrine.
* **Critério 29.1 (Event-driven):** QUANDO o administrador marcar um produto elegível como "Destaque da Semana", O MÓDULO DE VITRINE DEVERÁ exibir imediatamente o item na seção principal de destaques da plataforma.

### RF30 — Processar Frete
**Como** sistema de frete, **quero** consultar os serviços de logística integrados, **para** disponibilizar opções de envio.
* **Critério 30.1 (Event-driven):** QUANDO uma requisição de consulta de frete for recebida com um CEP válido, O MÓDULO DE LOGÍSTICA DEVERÁ calcular e retornar opções, prazos e valores de entrega.

### RF31 — Recomendar Produtos (IA)
**Como** sistema de recomendação, **quero** recomendar produtos baseados no histórico, **para** aumentar a relevância das ofertas.
* **Critério 31.1 (Event-driven):** QUANDO um comprador com histórico de navegação acessar a home, O MÓDULO DE RECOMENDAÇÃO DEVERÁ exibir a lista "Recomendados para Você".
* **Critério 31.2 (State-driven):** ENQUANTO o comprador não possuir histórico registrado, O MÓDULO DE RECOMENDAÇÃO DEVERÁ apresentar recomendações genéricas baseadas nos produtos mais vendidos.

---

## Requisitos Não Funcionais (RNF)

### RNF01 — Autenticação Segura via JWT
* **Critério N1.1:** O MÓDULO DE SEGURANÇA DEVERÁ autenticar compradores, artesãos e administradores gerando e validando tokens JWT assinados com expiração pré-definida.

### RNF02 — Controle de Acesso Baseado em Perfis (RBAC)
* **Critério N2.1:** O MÓDULO DE SEGURANÇA DEVERÁ interceptar todas as requisições para rotas protegidas e verificar se o perfil contido no token JWT possui autorização para a operação, retornando HTTP 401 ou 403 em caso negativo.

### RNF03 — Padronização RESTful e Tratamento de Erros
* **Critério N3.1:** A API DO SISTEMA DEVERÁ estruturar suas rotas segundo o padrão RESTful e retornar respostas utilizando códigos HTTP padronizados (200, 201, 400, 401, 403, 409, 500) acompanhados de payload de erro padronizado.

### RNF04 — Validação Client-side e Usabilidade Reativa
* **Critério N4.1:** O FRONT-END DEVERÁ validar os campos dos formulários antes do envio e atualizar componentes dinâmicos (como filtros e adição ao carrinho) sem requerer o recarregamento total da página.

### RNF05 — Integridade Transacional e de Estoque
* **Critério N5.1:** O BANCO DE DADOS DEVERÁ utilizar transações ACID durante a finalização do pedido para garantir que a baixa de estoque e o registro da compra ocorram de forma atômica.

### RNF06 — Tolerância a Falhas em Integrações Externas
* **Critério N6.1:** SE qualquer serviço externo (como APIs de frete ou recomendação) falhar ou ultrapassar o tempo limite de 500 milissegundos, ENTÃO O SISTEMA DEVERÁ acionar a estratégia de fallback e fornecer respostas contendo dados em cache ou valores estáticos padrão.
