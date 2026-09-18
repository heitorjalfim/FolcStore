# Product — Módulo de IA de Recomendação

## Contexto do projeto principal

O **Marketplace de Artesanato** é uma plataforma de comércio eletrônico que conecta
artesãos e pequenos produtores a compradores, oferecendo produtos feitos à mão como
cerâmica, cestaria, bordado, marcenaria, joalheria artesanal e têxteis. A plataforma
já possui catálogo de produtos, cadastro de vendedores (artesãos), carrinho de
compras, checkout e painel administrativo.

O **Módulo de IA de Recomendação** é um subsistema desse marketplace, responsável por
personalizar a exibição de produtos para cada visitante e comprador, substituindo
vitrines estáticas e genéricas por seleções relevantes geradas a partir do
comportamento de navegação e compra.

## Problema de negócio ou necessidade do usuário

- O catálogo de artesanato é **longo, disperso e heterogêneo** (milhares de peças
  únicas ou de baixa tiragem, produzidas por milhares de artesãos independentes),
  o que dificulta a descoberta orgânica de produtos pelo comprador.
- Vitrines genéricas (ordenadas por data de cadastro ou nome) **não refletem o
  interesse individual** do usuário, reduzindo engajamento, tempo de sessão e
  conversão.
- Artesãos pequenos e recém-cadastrados **têm baixa visibilidade** frente a
  vendedores já estabelecidos, o que compromete a proposta de valor do marketplace
  como vitrine para novos produtores.
- A equipe de negócio não possui hoje **nenhum mecanismo de personalização
  automatizada**, dependendo de curadoria manual de vitrines, o que não escala com
  o crescimento do catálogo.

## Público-alvo

| Perfil | Descrição | Necessidade em relação ao módulo |
|---|---|---|
| **Comprador (usuário final)** | Visitante ou cliente cadastrado que navega e compra peças artesanais. | Encontrar produtos relevantes ao seu gosto sem precisar buscar manualmente em todo o catálogo. |
| **Artesão (vendedor)** | Pequeno produtor que cadastra e vende suas peças na plataforma. | Ganhar visibilidade proporcional à qualidade/relevância de seus produtos, mesmo sendo novo na plataforma. |
| **Equipe de negócio / marketing** | Responsável por curadoria, campanhas e métricas comerciais do marketplace. | Configurar regras de exposição e acompanhar o impacto das recomendações nas métricas de negócio. |
| **Equipe técnica (engenharia/dados)** | Responsável por operar, monitorar e evoluir o módulo de IA. | Integrar, monitorar e ajustar o motor de recomendação com previsibilidade e observabilidade. |

## Objetivo do módulo

Fornecer, como serviço desacoplado do sistema principal, **recomendações
personalizadas de produtos artesanais** para diferentes pontos de contato do
marketplace (página inicial, página de produto, carrinho, e-mail e notificações),
combinando sinais de comportamento do usuário com atributos dos produtos, de forma
a aumentar a relevância do que é exibido a cada visitante ou comprador.

## Benefícios esperados

- **Para o comprador:** descoberta mais relevante de produtos artesanais alinhados
  ao seu interesse, reduzindo esforço de busca.
- **Para o artesão:** maior chance de exposição de seus produtos a compradores com
  perfil compatível, incluindo mecanismos de diversidade que evitam concentração de
  visibilidade em poucos vendedores.
- **Para o negócio:** aumento esperado de indicadores de engajamento (cliques,
  tempo de sessão) e de conversão (adição ao carrinho, compra) nas vitrines
  personalizadas em relação a vitrines não personalizadas (baseline), mensurado via
  testes controlados (A/B testing).
- **Para a operação:** painel de configuração e métricas que permitem à equipe de
  negócio ajustar regras de recomendação sem depender de novas implantações de
  código.

## Limites do produto (fora de escopo nesta fase)

- O módulo **não decide preço** de produtos nem executa precificação dinâmica
  automática — apenas sugere faixas de referência ao artesão (RF08), sendo a
  decisão final sempre do vendedor.
- O módulo **não substitui a busca textual** do marketplace (busca por palavra-chave
  segue sendo um componente separado do sistema principal).
- O módulo **não realiza recomendações baseadas em imagem/visão computacional** nesta
  primeira fase (ex.: "encontre produtos parecidos com esta foto"); a similaridade
  de conteúdo é calculada a partir de atributos estruturados do produto (categoria,
  material, técnica, preço), não de análise de imagem.
- O módulo **não opera fora dos canais do próprio marketplace** nesta fase (web e
  app); integrações com parceiros externos ou marketplaces de terceiros estão fora
  do escopo inicial (relacionado a RNF09, tratado como requisito desejável de
  arquitetura, não como entrega funcional desta fase).
- Decisões de **moderação de conteúdo e aprovação de produtos** cadastrados
  continuam sendo responsabilidade do sistema principal do marketplace, não do
  módulo de recomendação.
