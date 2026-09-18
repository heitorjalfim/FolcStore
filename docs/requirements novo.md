# Requirements — Módulo de IA de Recomendação

## Convenções deste documento

- Cada requisito é expresso como **história de usuário** no formato:
  `Como [tipo de usuário], quero [objetivo], para [benefício esperado].`
- Cada história possui um ou mais **critérios de aceitação em notação EARS**
  (Easy Approach to Requirements Syntax), usando os padrões:
  - **Ubíquo:** `O MÓDULO DE RECOMENDAÇÃO DEVERÁ [resposta verificável].`
  - **Evento:** `QUANDO [evento], O MÓDULO DE RECOMENDAÇÃO DEVERÁ [resposta verificável].`
  - **Estado:** `ENQUANTO [estado], O MÓDULO DE RECOMENDAÇÃO DEVERÁ [resposta verificável].`
  - **Não desejado:** `SE [erro ou situação indesejada], ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ [resposta verificável].`
- Critérios evitam termos não mensuráveis ("rápido", "inteligente", "adequado",
  "fácil de usar") — toda condição de aceite é observável e testável (valor
  numérico, contagem, presença/ausência de campo, código de retorno, etc.).
- O identificador entre colchetes (ex.: `[RF01]`) referencia o requisito
  correspondente no Documento de Requisitos de Software do projeto, para
  rastreabilidade.

---

## 1. Recomendações na página inicial

### História de usuário 1.1
Como **comprador cadastrado**, quero **ver uma vitrine de produtos recomendados na
página inicial**, para **descobrir peças artesanais alinhadas ao meu interesse sem
precisar navegar por todo o catálogo**. `[RF01]`

**Critérios de aceitação:**
- QUANDO um usuário autenticado com pelo menos um evento de navegação ou compra
  registrado acessar a página inicial, O MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar uma
  lista com o número de itens solicitado pelo marketplace (parâmetro `quantidade`),
  composta exclusivamente por produtos com status "ativo" no catálogo.
- QUANDO o marketplace solicitar recomendações para um usuário autenticado sem
  nenhum evento de navegação ou compra registrado, O MÓDULO DE RECOMENDAÇÃO DEVERÁ
  aplicar a estratégia de cold start definida no projeto (seção 4 do `design.md`) e
  retornar o número de itens solicitado.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ garantir que nenhum item retornado nas
  recomendações da página inicial esteja indisponível (estoque zero ou status
  "inativo") no momento da geração da resposta.

### História de usuário 1.2
Como **visitante não identificado**, quero **ver uma vitrine de produtos em
destaque na página inicial**, para **conhecer o catálogo mesmo sem estar
logado**. `[RF01]`

**Critérios de aceitação:**
- QUANDO o marketplace solicitar recomendações para um visitante sem identificador
  de usuário (sessão anônima), O MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar uma lista
  ordenada por popularidade (volume de compras nos últimos 30 dias) contendo o
  número de itens solicitado.
- SE a base de eventos de popularidade dos últimos 30 dias estiver vazia, ENTÃO O
  MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar produtos ordenados por data de cadastro
  decrescente como critério de desempate documentado.

---

## 2. Recomendações na página do produto

### História de usuário 2.1
Como **comprador**, quero **ver produtos similares ao que estou visualizando**,
para **comparar opções parecidas antes de decidir a compra**. `[RF02]`

**Critérios de aceitação:**
- QUANDO um usuário acessar a página de um produto com identificador válido no
  catálogo, O MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar uma lista de produtos
  similares cujo `product_id` seja diferente do produto visualizado.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ calcular a similaridade entre produtos com base
  em, no mínimo, os atributos categoria, material e faixa de preço, conforme
  definido na seção "Estratégia principal" do `design.md`.
- SE o produto visualizado não possuir atributos suficientes cadastrados (categoria
  ou material ausentes) para o cálculo de similaridade, ENTÃO O MÓDULO DE
  RECOMENDAÇÃO DEVERÁ retornar produtos da mesma categoria do artesão responsável
  pelo item, ou lista vazia caso o artesão não possua outros produtos ativos.

### História de usuário 2.2
Como **comprador**, quero **ver sugestões de "quem viu este produto também
comprou" e itens complementares**, para **descobrir peças relacionadas que eu não
pesquisaria diretamente**. `[RF03]`

**Critérios de aceitação:**
- QUANDO um produto tiver ao menos um par de coocorrência registrado (produtos
  comprados em uma mesma transação), O MÓDULO DE RECOMENDAÇÃO DEVERÁ incluir esses
  produtos na resposta da recomendação "combine com", ordenados por frequência de
  coocorrência decrescente.
- QUANDO o usuário estiver na tela do carrinho de compras com um ou mais itens
  adicionados, O MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar sugestões de itens
  complementares para cada produto presente no carrinho.
- SE nenhum par de coocorrência existir para o produto solicitado, ENTÃO O MÓDULO
  DE RECOMENDAÇÃO DEVERÁ retornar lista vazia para essa seção, sem gerar erro na
  resposta.

---

## 3. Coleta de sinais comportamentais

### História de usuário 3.1
Como **equipe de dados**, quero **que o módulo registre os eventos de interação dos
usuários**, para **alimentar o motor de recomendação com dados atualizados de
comportamento**. `[RF04]`

**Critérios de aceitação:**
- QUANDO o marketplace emitir um evento de interação (visualização de produto,
  clique, adição ao carrinho, favoritar, compra ou avaliação) para o módulo, O
  MÓDULO DE RECOMENDAÇÃO DEVERÁ persistir o evento com identificador de usuário (ou
  de sessão anônima), identificador de produto, tipo de evento e carimbo de data e
  hora.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ processar o registro de eventos de forma
  assíncrona em relação à requisição HTTP de origem, retornando confirmação de
  recebimento em até 100 ms no percentil 95 (p95), sem aguardar o processamento
  completo do evento.
- SE um evento recebido não contiver identificador de produto válido no catálogo,
  ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ rejeitar o evento e registrar a ocorrência
  em log de erros com o motivo da rejeição.

---

## 4. Recomendações por categoria, técnica e região

### História de usuário 4.1
Como **comprador**, quero **filtrar recomendações por categoria de artesanato,
técnica ou região do artesão**, para **explorar o catálogo de acordo com meu
interesse cultural específico**. `[RF05]`

**Critérios de aceitação:**
- QUANDO o marketplace solicitar recomendações informando um filtro de categoria,
  técnica ou região, O MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar exclusivamente
  produtos que atendam ao(s) filtro(s) informado(s).
- SE o filtro informado não corresponder a nenhuma categoria, técnica ou região
  cadastrada, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar lista vazia e um
  código de resposta indicando filtro inválido, sem interromper a disponibilidade
  do serviço.

---

## 5. Motor de recomendação (núcleo de IA)

### História de usuário 5.1
Como **equipe de dados**, quero **que o motor combine filtragem colaborativa e
recomendação baseada em conteúdo**, para **gerar recomendações relevantes tanto
para usuários com histórico quanto para itens novos**. `[RF06]`

**Critérios de aceitação:**
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ gerar recomendações combinando um componente de
  filtragem colaborativa e um componente baseado em atributos de conteúdo,
  conforme os pesos configuráveis descritos na seção "Estratégia principal" do
  `design.md`.
- QUANDO o marketplace solicitar cinco recomendações para um usuário sem histórico
  de eventos, O MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar cinco itens elegíveis
  utilizando a estratégia de cold start definida no projeto.
- QUANDO um produto for cadastrado sem nenhum evento de interação associado, O
  MÓDULO DE RECOMENDAÇÃO DEVERÁ torná-lo elegível para recomendação baseada em
  conteúdo a partir de seus atributos cadastrais, em até 24 horas após o cadastro
  (rastreável a `RNF06`).
- SE o motor de recomendação não conseguir gerar recomendações por indisponibilidade
  do serviço, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ acionar o mecanismo de fallback
  descrito em `RNF03`, retornando produtos populares em vez de retornar erro ao
  chamador.

---

## 6. Recomendações por e-mail e notificação

### História de usuário 6.1
Como **comprador**, quero **receber recomendações personalizadas por e-mail ou
notificação**, para **ser lembrado de produtos e artesãos do meu interesse mesmo
fora da plataforma**. `[RF07]`

**Critérios de aceitação:**
- QUANDO o job periódico de geração de recomendações por canal externo for
  executado, O MÓDULO DE RECOMENDAÇÃO DEVERÁ gerar uma lista de recomendações para
  cada usuário com consentimento de comunicação ativo, registrado no perfil.
- SE o usuário tiver revogado o consentimento de comunicação por e-mail ou
  notificação, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ excluí-lo do lote de envio
  correspondente.

---

## 7. Recomendações para o artesão (vendedor)

### História de usuário 7.1
Como **artesão**, quero **receber sugestões de precificação, categorias e produtos
com potencial de conversão**, para **tomar decisões melhor embasadas sobre meu
catálogo**. `[RF08]`

**Critérios de aceitação:**
- QUANDO um artesão acessar o painel de vendedor, O MÓDULO DE RECOMENDAÇÃO DEVERÁ
  disponibilizar, para cada produto ativo do artesão, uma faixa de preço de
  referência calculada a partir de produtos de categoria e material equivalentes.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ apresentar as faixas de preço e as
  categorias/tags mais buscadas como valores de referência, sem aplicar alteração
  automática no preço cadastrado pelo artesão.

---

## 8. Configuração administrativa do motor

### História de usuário 8.1
Como **equipe de negócio**, quero **configurar pesos, regras e ativação de
estratégias de recomendação por vitrine**, para **ajustar o comportamento do motor
sem depender de nova implantação de código**. `[RF09]`

**Critérios de aceitação:**
- QUANDO um administrador autorizado alterar o peso de um dos componentes do motor
  (colaborativo ou baseado em conteúdo) pelo painel administrativo, O MÓDULO DE
  RECOMENDAÇÃO DEVERÁ aplicar o novo peso nas próximas requisições de recomendação
  em até 5 minutos, sem necessidade de reinício do serviço.
- SE um usuário sem perfil de permissão "administrador do módulo de recomendação"
  tentar alterar uma configuração, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ recusar a
  operação e retornar código de acesso não autorizado.

---

## 9. Explicabilidade das recomendações

### História de usuário 9.1
Como **comprador**, quero **entender por que um produto foi recomendado para
mim**, para **confiar mais nas sugestões apresentadas**. `[RF10]`

**Critérios de aceitação:**
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ incluir, em cada item retornado na resposta de
  recomendação, um campo `motivo` preenchido com um dos motivos pré-definidos
  cadastrados no catálogo de justificativas do sistema (ex.: `compra_anterior`,
  `categoria_favorita`, `artesao_seguido`, `popular_na_categoria`).
- SE não for possível determinar um motivo específico para um item recomendado,
  ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ preencher o campo `motivo` com o valor
  `tendencia_geral`, nunca deixando o campo vazio ou nulo.

---

## 10. Feedback sobre recomendações

### História de usuário 10.1
Como **comprador**, quero **indicar que não me interessa por uma recomendação ou
por um artesão**, para **que as próximas sugestões sejam mais relevantes para
mim**. `[RF11]`

**Critérios de aceitação:**
- QUANDO um usuário registrar feedback negativo explícito sobre um item ou artesão
  (ação "não me interessa" ou "ocultar artesão"), O MÓDULO DE RECOMENDAÇÃO DEVERÁ
  excluir esse item ou os itens desse artesão das recomendações futuras exibidas
  para esse usuário, a partir da próxima requisição de recomendação.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ registrar todo evento de clique, ignorar ou
  compra associado a uma recomendação exibida, vinculando-o ao identificador da
  recomendação original para uso em retreinamento.

---

## 11. Diversidade de exposição de artesãos

### História de usuário 11.1
Como **equipe de negócio**, quero **que as recomendações distribuam exposição entre
diferentes artesãos**, para **evitar concentração de visibilidade em poucos
vendedores e cumprir o propósito social do marketplace**. `[RF12]`

**Critérios de aceitação:**
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ garantir que, em uma lista de recomendações com
  10 ou mais itens, no máximo 30% dos itens pertençam ao mesmo artesão, salvo
  quando o número de artesãos elegíveis para aquele contexto for insuficiente para
  atender ao limite (situação documentada em log).
- ENQUANTO a regra de diversidade estiver ativada no painel administrativo, O
  MÓDULO DE RECOMENDAÇÃO DEVERÁ aplicar o limite de concentração por artesão em
  toda resposta de recomendação da vitrine correspondente.

---

## 12. Desempenho e disponibilidade

### História de usuário 12.1
Como **equipe técnica**, quero **que o módulo responda dentro de um tempo
previsível e permaneça disponível**, para **não degradar a experiência de
navegação do marketplace**. `[RNF01, RNF03]`

**Critérios de aceitação:**
- QUANDO o marketplace solicitar recomendações em tempo real para exibição em
  página, O MÓDULO DE RECOMENDAÇÃO DEVERÁ responder em até 300 ms no percentil 95
  (p95), medido em ambiente de produção.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ manter disponibilidade mensal igual ou superior a
  99,5%, medida pela proporção de requisições respondidas com sucesso sobre o
  total de requisições recebidas.
- SE o componente principal do motor de recomendação não responder dentro do tempo
  limite configurado, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar a lista de
  fallback por popularidade em até 300 ms adicionais, evitando erro exibido ao
  usuário final.

---

## 13. Escalabilidade e atualização do modelo

### História de usuário 13.1
Como **equipe técnica**, quero **que o módulo suporte crescimento do catálogo e da
base de usuários e incorpore novos itens automaticamente**, para **que o sistema
continue funcionando conforme o marketplace cresce**. `[RNF02, RNF06]`

**Critérios de aceitação:**
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ executar o retreinamento do modelo em ciclo com
  periodicidade máxima de 24 horas, registrando data e hora de início e término de
  cada execução.
- QUANDO um novo produto for cadastrado no catálogo, O MÓDULO DE RECOMENDAÇÃO
  DEVERÁ torná-lo elegível para recomendação baseada em conteúdo em até 24 horas
  após o cadastro.
- QUANDO um novo usuário realizar seu primeiro evento de interação, O MÓDULO DE
  RECOMENDAÇÃO DEVERÁ incorporar esse evento no cálculo de recomendações
  personalizadas em até 24 horas.

---

## 14. Monitoramento e qualidade do modelo

### História de usuário 14.1
Como **equipe de dados**, quero **acompanhar métricas de desempenho e qualidade do
motor de recomendação**, para **identificar degradação do modelo e agir antes que
afete o negócio**. `[RNF04, RNF08]`

**Critérios de aceitação:**
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ expor, via painel administrativo, as métricas
  taxa de clique (CTR), taxa de conversão, cobertura do catálogo e tempo de
  resposta, atualizadas com periodicidade máxima de 24 horas.
- SE a taxa de clique (CTR) medida em uma janela de 7 dias cair mais de 20% em
  relação à média das 4 semanas anteriores, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ
  gerar um alerta automático destinado à equipe responsável, registrado com data,
  hora e valores comparados.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ registrar, para cada execução de teste controlado
  (A/B test) configurada, a taxa de clique e a taxa de conversão de cada grupo
  (variante personalizada e baseline não personalizada) para consulta posterior.

---

## 15. Privacidade e conformidade (LGPD)

### História de usuário 15.1
Como **comprador**, quero **poder consultar, exportar ou solicitar a exclusão dos
meus dados usados para personalização**, para **exercer meus direitos garantidos
pela LGPD**. `[RNF05]`

**Critérios de aceitação:**
- QUANDO um usuário solicitar a exportação de seus dados de personalização, O
  MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar todos os eventos de interação e
  preferências vinculados ao seu identificador em formato estruturado (JSON) em
  até 72 horas.
- QUANDO um usuário solicitar a exclusão de seus dados de personalização, O MÓDULO
  DE RECOMENDAÇÃO DEVERÁ remover ou anonimizar os eventos vinculados ao seu
  identificador em até 30 dias corridos, conforme prazo definido na política de
  privacidade do projeto.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ armazenar exclusivamente os campos de dados
  pessoais necessários para o cálculo de recomendação, conforme lista definida na
  seção "Segurança, privacidade e observabilidade" do `design.md`.

---

## 16. Acessibilidade das interfaces de recomendação

### História de usuário 16.1
Como **comprador que utiliza tecnologia assistiva**, quero **que as vitrines de
recomendação sigam padrões de acessibilidade**, para **conseguir navegar pelas
sugestões independentemente de limitação visual ou motora**. `[RNF07]`

**Critérios de aceitação:**
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ retornar, para cada item recomendado, os campos
  `nome_produto` e `descricao_curta` preenchidos, permitindo que o front-end gere
  texto alternativo (`alt text`) para as imagens dos produtos exibidos.
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ disponibilizar a mesma informação (itens, motivo,
  metadados) tanto para renderização em página web quanto em e-mail, sem
  diferença de conteúdo entre os canais, de forma que o front-end de cada canal
  possa aplicar as marcações de acessibilidade equivalentes ao WCAG 2.1 nível AA.

---

## 17. Segurança de acesso

### História de usuário 17.1
Como **equipe técnica**, quero **que o acesso às APIs e ao painel de configuração
seja autenticado, autorizado e auditado**, para **evitar alterações indevidas no
comportamento do motor de recomendação**. `[RNF10]`

**Critérios de aceitação:**
- O MÓDULO DE RECOMENDAÇÃO DEVERÁ exigir um token de autenticação válido em toda
  requisição recebida em suas APIs, rejeitando requisições sem token ou com token
  expirado.
- QUANDO uma configuração do motor de recomendação for alterada por um usuário
  autenticado, O MÓDULO DE RECOMENDAÇÃO DEVERÁ registrar em log de auditoria o
  identificador do usuário, a alteração realizada e o carimbo de data e hora.
- SE uma requisição de alteração de configuração for recebida sem permissão de
  administrador, ENTÃO O MÓDULO DE RECOMENDAÇÃO DEVERÁ recusar a operação, retornar
  código de acesso não autorizado e registrar a tentativa em log de auditoria.
