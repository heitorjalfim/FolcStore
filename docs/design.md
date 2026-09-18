# Design — Módulo de IA de Recomendação

Este documento descreve o desenho técnico do Módulo de IA de Recomendação do
Marketplace de Artesanato. Ele é a referência de implementação para os requisitos
descritos em `requirements.md` e para o contexto de produto descrito em
`product.md`.

---

## 1. Diagrama de componentes

```mermaid
flowchart TB
    subgraph Sistema Principal do Marketplace
        WEB[Front-end Web / App]
        CATALOGO[(Catálogo de Produtos)]
        PERFIL[(Perfil do Usuário)]
        PEDIDOS[(Carrinho / Pedidos)]
        NOTIF[Serviço de Notificações / E-mail]
        ADMIN[Painel Administrativo]
    end

    subgraph Módulo de IA de Recomendação
        API[API de Recomendação\n/REST]
        EVENTS[Serviço de Ingestão de Eventos]
        QUEUE[[Fila de Eventos]]
        FEATURESTORE[(Feature Store)]
        MODELSTORE[(Model Store / Registro de Modelos)]
        TRAINER[Job de Treinamento\ne Retreinamento]
        SERVING[Serviço de Inferência\n(Serving)]
        FALLBACK[Serviço de Fallback\n(Popularidade)]
        CONFIG[(Configurações do Motor)]
        MONITOR[Monitoramento e Métricas]
        AUDIT[(Log de Auditoria)]
    end

    WEB -->|solicita recomendações| API
    WEB -->|envia eventos de interação| EVENTS
    PEDIDOS -->|evento de compra| EVENTS
    EVENTS --> QUEUE
    QUEUE --> FEATURESTORE
    FEATURESTORE --> TRAINER
    CATALOGO -->|atributos de produto| FEATURESTORE
    PERFIL -->|dados de perfil e consentimento| FEATURESTORE
    TRAINER -->|publica novo modelo| MODELSTORE
    MODELSTORE --> SERVING
    API --> SERVING
    SERVING -->|indisponível / timeout| FALLBACK
    API --> FALLBACK
    ADMIN -->|lê/grava pesos e regras| CONFIG
    CONFIG --> SERVING
    CONFIG --> API
    API --> AUDIT
    SERVING --> MONITOR
    API --> MONITOR
    TRAINER --> MONITOR
    MONITOR -->|alertas| ADMIN
    API -->|recomendações personalizadas| NOTIF
```

**Papel de cada componente:**

| Componente | Responsabilidade |
|---|---|
| **API de Recomendação** | Ponto único de entrada síncrono (REST) para o sistema principal solicitar recomendações e configurações. |
| **Serviço de Ingestão de Eventos** | Recebe eventos de interação (visualização, clique, carrinho, compra, favorito, avaliação) e os publica na fila. |
| **Fila de Eventos** | Desacopla a ingestão do processamento, garantindo resposta rápida ao chamador (RNF01, RF04). |
| **Feature Store** | Armazena features de usuário, produto e interação, consumidas tanto pelo treinamento quanto pela inferência. |
| **Model Store** | Versiona os modelos treinados e mantém o modelo ativo em produção. |
| **Job de Treinamento** | Executa o retreinamento periódico (RNF06) e publica novas versões do modelo. |
| **Serviço de Inferência (Serving)** | Calcula recomendações em tempo real combinando os componentes colaborativo e de conteúdo (RF06). |
| **Serviço de Fallback** | Retorna recomendações por popularidade quando o Serving está indisponível ou expira o tempo limite (RNF03). |
| **Configurações do Motor** | Armazena pesos, regras de diversidade e ativação de estratégias por vitrine, editáveis via painel (RF09). |
| **Monitoramento e Métricas** | Coleta CTR, conversão, cobertura, tempo de resposta e dispara alertas (RNF04). |
| **Log de Auditoria** | Registra alterações de configuração e tentativas de acesso não autorizado (RNF10). |

---

## 2. Fluxo dos dados

### 2.1 Fluxo de coleta (assíncrono)

1. O front-end ou o serviço de pedidos emite um evento de interação para o
   **Serviço de Ingestão de Eventos**.
2. O evento é validado (produto existente, tipo de evento reconhecido) e publicado
   na **Fila de Eventos**.
3. Um consumidor processa a fila e atualiza a **Feature Store** (contadores de
   interação, últimos produtos vistos, coocorrências de compra).
4. Eventos rejeitados (produto inexistente, payload inválido) são registrados em
   log de erros e não bloqueiam o restante do lote.

### 2.2 Fluxo de recomendação em tempo real (síncrono)

1. O sistema principal chama `POST /v1/recommendations` informando contexto
   (usuário, tela, produto de referência, filtros).
2. A **API** consulta as **Configurações do Motor** vigentes (pesos, regras de
   diversidade, estratégias ativas por vitrine).
3. A API delega o cálculo ao **Serviço de Inferência**, que consulta a
   **Feature Store** e o **Model Store** para gerar a lista ordenada de
   recomendações.
4. A API aplica as regras de pós-processamento (diversidade de artesãos, filtros
   solicitados, exclusão de itens indisponíveis, motivo de recomendação).
5. Se o Serving não responder dentro do tempo limite configurado, a API aciona o
   **Serviço de Fallback** (popularidade) e retorna a resposta dentro do prazo
   total acordado.
6. A resposta é enviada ao chamador e um evento de "impressão" (recomendação
   exibida) é publicado de volta na Fila de Eventos, para uso em métricas e
   retreinamento.

### 2.3 Fluxo de treinamento (batch)

1. O **Job de Treinamento** é executado em ciclo (mínimo diário).
2. Lê a **Feature Store** consolidada (eventos, atributos de produto, perfil).
3. Treina/atualiza os componentes colaborativo e de conteúdo.
4. Avalia o novo modelo contra métricas mínimas de qualidade (comparação com a
   versão em produção).
5. Se aprovado, publica o novo modelo no **Model Store** e promove-o para produção;
   caso contrário, mantém a versão anterior ativa e registra o motivo da reprovação
   no **Monitoramento**.

---

## 3. Modelo de dados

### 3.1 Entidades principais

**`user_profile`** (referenciada da Feature Store; dados sensíveis minimizados)
| Campo | Tipo | Descrição |
|---|---|---|
| `user_id` | string (UUID) | Identificador do usuário no marketplace. |
| `consentimento_comunicacao` | boolean | Se o usuário aceita receber recomendações por e-mail/notificação. |
| `categorias_preferidas` | array\<string\> | Derivado de interações, não input manual. |
| `artesaos_seguidos` | array\<string\> | IDs de artesãos seguidos pelo usuário. |
| `artesaos_ocultados` | array\<string\> | IDs de artesãos ocultados via feedback negativo (RF11). |
| `atualizado_em` | timestamp | Última atualização do perfil de recomendação. |

**`product_features`**
| Campo | Tipo | Descrição |
|---|---|---|
| `product_id` | string (UUID) | Identificador do produto. |
| `categoria` | string | Categoria do artesanato. |
| `tecnica` | string | Técnica de produção. |
| `material` | string | Material predominante. |
| `preco` | decimal | Preço atual do produto. |
| `artesao_id` | string (UUID) | Identificador do artesão/vendedor. |
| `regiao_artesao` | string | Região/estado do artesão. |
| `status` | enum (`ativo`, `inativo`) | Disponibilidade do produto para recomendação. |
| `popularidade_30d` | integer | Contagem de compras nos últimos 30 dias. |

**`interaction_event`**
| Campo | Tipo | Descrição |
|---|---|---|
| `event_id` | string (UUID) | Identificador único do evento. |
| `user_id` | string (nullable) | Nulo para sessão anônima; nesse caso `session_id` é obrigatório. |
| `session_id` | string | Identificador de sessão (usuários anônimos ou autenticados). |
| `product_id` | string (UUID) | Produto associado ao evento. |
| `tipo_evento` | enum | `visualizacao`, `clique`, `carrinho`, `favorito`, `compra`, `avaliacao`, `impressao_recomendacao`, `feedback_negativo`. |
| `recommendation_id` | string (nullable) | Vincula o evento a uma recomendação exibida anteriormente (RF11). |
| `criado_em` | timestamp | Data e hora do evento. |

**`recommendation_config`**
| Campo | Tipo | Descrição |
|---|---|---|
| `vitrine` | enum | `home`, `produto`, `carrinho`, `email`. |
| `peso_colaborativo` | decimal (0–1) | Peso do componente colaborativo no motor híbrido. |
| `peso_conteudo` | decimal (0–1) | Peso do componente baseado em conteúdo. |
| `diversidade_ativa` | boolean | Ativa/desativa a regra de diversidade por artesão (RF12). |
| `limite_por_artesao` | decimal (0–1) | Percentual máximo de itens por artesão em uma lista. |
| `atualizado_por` | string | Identificador do administrador que fez a última alteração. |
| `atualizado_em` | timestamp | Data e hora da última alteração. |

**`audit_log`**
| Campo | Tipo | Descrição |
|---|---|---|
| `log_id` | string (UUID) | Identificador do registro de auditoria. |
| `user_id` | string | Usuário que realizou a ação. |
| `acao` | string | Descrição da alteração realizada. |
| `resultado` | enum | `sucesso`, `negado`. |
| `criado_em` | timestamp | Data e hora do evento de auditoria. |

### 3.2 Relacionamentos

- `interaction_event.product_id` → `product_features.product_id`
- `interaction_event.user_id` → `user_profile.user_id`
- `product_features.artesao_id` referencia o cadastro de artesão no sistema
  principal (fora do módulo).
- `recommendation_config` é lido por `Serving` e por `API` a cada requisição
  (com cache local de curta duração para atender o requisito de desempenho).

---

## 4. Estratégia principal e baseline

### 4.1 Estratégia principal (modelo híbrido)

O motor combina dois componentes, cujo peso relativo é configurável por vitrine
(`recommendation_config`):

1. **Componente colaborativo:** baseado em fatoração de matriz (ex.:
   *matrix factorization* / ALS) sobre a matriz usuário × produto construída a
   partir de `interaction_event`, ponderando tipos de evento de forma diferente
   (ex.: compra > carrinho > clique > visualização).
2. **Componente baseado em conteúdo:** similaridade entre produtos calculada sobre
   vetores de atributos estruturados (`categoria`, `tecnica`, `material`, faixa de
   `preco`), usando similaridade de cosseno sobre vetores one-hot/embeddings de
   atributos.

O score final de um item para um usuário é uma combinação ponderada:

```
score_final = (peso_colaborativo × score_colaborativo)
            + (peso_conteudo × score_conteudo)
```

Após o cálculo do score, é aplicado um **pós-processamento** com as regras de
negócio: exclusão de itens indisponíveis, exclusão de artesãos ocultados pelo
usuário (RF11), limite de diversidade por artesão (RF12) e atribuição do campo
`motivo` (RF10).

### 4.2 Estratégia de cold start

| Situação | Estratégia aplicada |
|---|---|
| Usuário novo/anônimo sem eventos | Recomendação por popularidade (`popularidade_30d`) na vitrine solicitada, com filtros de categoria/região se informados. |
| Produto novo sem eventos de interação | Elegível apenas pelo componente de conteúdo, comparado a produtos com atributos semelhantes, até acumular eventos suficientes (limiar mínimo configurável) para entrar no componente colaborativo. |
| Vitrine sem dados suficientes para nenhuma estratégia | Fallback por popularidade geral da plataforma; se também vazio, ordenação por data de cadastro decrescente. |

### 4.3 Baseline para avaliação

Para fins de teste A/B (RNF08) e monitoramento de degradação (RNF04), a
**baseline de comparação** é a vitrine **não personalizada**: produtos ordenados
por popularidade geral, sem uso do modelo híbrido. Toda melhoria de CTR e
conversão reportada nas métricas é medida em relação a essa baseline.

---

## 5. Interface de integração

### 5.1 `POST /v1/recommendations`

Endpoint síncrono usado pelo sistema principal para obter recomendações
personalizadas para uma vitrine específica.

**Campos de entrada (request body, JSON):**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `vitrine` | string (enum) | Sim | Uma de `home`, `produto`, `carrinho`, `email`. |
| `usuario_id` | string (UUID) | Não | Ausente para sessão anônima. |
| `sessao_id` | string | Sim (se `usuario_id` ausente) | Identificador de sessão anônima. |
| `produto_referencia_id` | string (UUID) | Condicional | Obrigatório quando `vitrine = produto`. |
| `produtos_carrinho` | array\<string\> | Condicional | Obrigatório quando `vitrine = carrinho`. |
| `quantidade` | integer | Sim | Número de itens desejados (mínimo 1, máximo 50). |
| `filtros` | objeto | Não | `{ "categoria": string, "tecnica": string, "regiao": string }`. |

**Campos de saída (response body, JSON, HTTP 200):**

| Campo | Tipo | Descrição |
|---|---|---|
| `recommendation_id` | string (UUID) | Identificador único da resposta, usado para rastrear feedback e impressões. |
| `origem` | string (enum) | `motor_hibrido`, `cold_start_popularidade` ou `fallback`. |
| `itens` | array de objetos | Lista de recomendações. |
| `itens[].product_id` | string (UUID) | Identificador do produto recomendado. |
| `itens[].nome_produto` | string | Nome do produto (para acessibilidade, RNF07). |
| `itens[].descricao_curta` | string | Descrição curta (para acessibilidade, RNF07). |
| `itens[].motivo` | string (enum) | Justificativa da recomendação (RF10). |
| `itens[].score` | decimal | Score interno do item (uso técnico/depuração). |
| `gerado_em` | timestamp | Data e hora de geração da resposta. |

**Códigos de erro possíveis:**

| Código HTTP | Situação | Corpo da resposta |
|---|---|---|
| `400` | Campo obrigatório ausente ou inválido (ex.: `vitrine` fora do enum, `quantidade` fora do intervalo). | `{ "erro": "requisicao_invalida", "detalhe": "..." }` |
| `401` | Token de autenticação ausente ou expirado. | `{ "erro": "nao_autenticado" }` |
| `403` | Token válido, mas sem permissão para o recurso solicitado. | `{ "erro": "nao_autorizado" }` |
| `404` | `produto_referencia_id` informado não existe no catálogo. | `{ "erro": "produto_nao_encontrado" }` |
| `422` | Filtro informado não corresponde a nenhuma categoria/técnica/região cadastrada. | `{ "erro": "filtro_sem_resultado", "itens": [] }` |
| `503` | Serviço de Inferência indisponível **e** fallback também indisponível (cenário raro). | `{ "erro": "servico_indisponivel" }` |

### 5.2 Exemplo de requisição e resposta

**Requisição:**

```http
POST /v1/recommendations HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "vitrine": "produto",
  "usuario_id": "3f2a1c9e-1234-4a3b-9c21-abc123456789",
  "produto_referencia_id": "9b7e2d10-aaaa-4bbb-8ccc-0987654321ab",
  "quantidade": 5
}
```

**Resposta (HTTP 200):**

```json
{
  "recommendation_id": "7c1e4f2a-55dd-4a11-9c0e-1122334455ff",
  "origem": "motor_hibrido",
  "gerado_em": "2026-09-18T14:32:10Z",
  "itens": [
    {
      "product_id": "1a2b3c4d-0000-4444-8888-abcdefabcdef",
      "nome_produto": "Cesto de fibra natural trançado",
      "descricao_curta": "Cesto artesanal em fibra natural, técnica de trançado manual.",
      "motivo": "categoria_favorita",
      "score": 0.874
    },
    {
      "product_id": "2b3c4d5e-1111-5555-9999-bcdefabcdef1",
      "nome_produto": "Vaso de cerâmica pintado à mão",
      "descricao_curta": "Vaso em cerâmica com pintura artesanal exclusiva.",
      "motivo": "artesao_seguido",
      "score": 0.812
    }
  ]
}
```

**Resposta de erro (HTTP 422 — filtro sem resultado):**

```json
{
  "erro": "filtro_sem_resultado",
  "itens": []
}
```

### 5.3 `POST /v1/events`

Endpoint assíncrono (aceita e enfileira) usado para registrar eventos de
interação (RF04).

**Campos de entrada:**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `tipo_evento` | string (enum) | Sim | `visualizacao`, `clique`, `carrinho`, `favorito`, `compra`, `avaliacao`, `feedback_negativo`. |
| `usuario_id` | string (UUID) | Não | Ausente para sessão anônima. |
| `sessao_id` | string | Sim (se `usuario_id` ausente) | — |
| `product_id` | string (UUID) | Sim | — |
| `recommendation_id` | string (UUID) | Não | Preenchido quando o evento decorre de uma recomendação exibida. |

**Saída (HTTP 202 — aceito para processamento assíncrono):**

```json
{ "event_id": "e5f6a7b8-2222-4444-8888-a1b2c3d4e5f6", "status": "enfileirado" }
```

**Erros possíveis:** `400` (produto inexistente ou tipo de evento inválido),
`401` (não autenticado).

---

## 6. Tratamento de erros e estratégia de contingência

| Cenário | Comportamento esperado |
|---|---|
| Serviço de Inferência não responde dentro do tempo limite | API aciona o Serviço de Fallback (popularidade) e retorna resposta com `origem = "fallback"`, dentro do prazo total definido em RNF01/RNF03. |
| Model Store sem modelo ativo publicado | Serving opera apenas com o componente de conteúdo (regra de cold start) até que um modelo válido seja publicado. |
| Fila de eventos indisponível | Serviço de Ingestão retorna erro `503` ao chamador; eventos não são perdidos silenciosamente — o chamador deve reenviar conforme política de retry do sistema principal. |
| Evento com `product_id` inexistente | Evento é rejeitado na ingestão, registrado em log de erros, não interrompe o processamento dos demais eventos do lote. |
| Configuração inconsistente (soma de pesos ≠ 1) | Alteração é recusada pelo endpoint de configuração antes de ser persistida, retornando erro de validação ao painel administrativo. |
| Falha total (Serving e Fallback indisponíveis) | API retorna `503`; o sistema principal deve exibir vitrine estática pré-definida (comportamento do front-end, fora do escopo deste módulo). |
| Pico de tráfego acima da capacidade da fila | Novas mensagens de evento são aceitas com backpressure controlado; eventos excedentes são descartados com contagem registrada em métricas (não bloqueiam a API de recomendação síncrona). |

---

## 7. Segurança, privacidade e observabilidade

### 7.1 Segurança

- Toda chamada às APIs (`/v1/recommendations`, `/v1/events`, endpoints de
  configuração) exige token de autenticação (Bearer token / OAuth2 client
  credentials) emitido pelo sistema principal.
- Endpoints de configuração (`/v1/config`) exigem perfil de permissão
  `admin_recomendacao`, validado a cada requisição.
- Toda alteração de configuração é registrada em `audit_log`, incluindo
  tentativas negadas por falta de permissão.
- Comunicação entre o sistema principal e o módulo ocorre exclusivamente via
  HTTPS/TLS.

### 7.2 Privacidade (LGPD)

- A Feature Store armazena o mínimo necessário de dados pessoais: identificador
  do usuário, eventos de interação e preferências derivadas — não armazena dados
  cadastrais completos (nome, e-mail, endereço), que permanecem apenas no
  sistema principal.
- Endpoint dedicado (`GET /v1/users/{id}/data` e `DELETE /v1/users/{id}/data`)
  atende às solicitações de exportação e exclusão de dados de personalização
  (RNF05), com prazos de 72 horas e 30 dias corridos, respectivamente.
- Eventos de usuários anônimos são vinculados a `sessao_id`, nunca a
  identificadores pessoais diretos, e possuem expiração automática (política de
  retenção a definir com a equipe jurídica/compliance).

### 7.3 Observabilidade

- **Métricas de negócio:** CTR, taxa de conversão, cobertura do catálogo,
  diversidade de artesãos exposta — agregadas diariamente e expostas no painel
  administrativo (RNF04).
- **Métricas técnicas:** tempo de resposta (p50/p95/p99), taxa de erro por
  endpoint, taxa de uso do fallback, tamanho da fila de eventos.
- **Alertas automáticos:** disparados quando CTR cai mais de 20% em 7 dias
  (RNF04), quando a taxa de uso do fallback ultrapassa um limiar configurável
  (indício de instabilidade do Serving), ou quando o job de treinamento falha.
- **Rastreabilidade:** todo item recomendado carrega `recommendation_id`, que é
  referenciado nos eventos subsequentes de clique/compra/feedback, permitindo
  reconstituir o funil completo de uma recomendação até a conversão.

---

## 8. Especificações técnicas (opcional nesta fase)

> As definições desta seção são propostas iniciais e podem ser revisadas conforme
> restrições da equipe de engenharia responsável pela implementação.

### 8.1 Linguagem

- **Python** para os componentes de treinamento, inferência e feature
  engineering — justificado pelo ecossistema maduro de bibliotecas de machine
  learning e pela facilidade de integração com ferramentas de dados já comuns em
  times de ML.
- **Node.js ou Python** (a definir com a equipe de engenharia) para a camada de
  API síncrona (`/v1/recommendations`, `/v1/events`), priorizando consistência
  com as demais APIs do sistema principal, caso já existam.

### 8.2 Bibliotecas (sugestão)

| Finalidade | Biblioteca sugerida | Justificativa |
|---|---|---|
| Filtragem colaborativa | `implicit` ou `LightFM` | Bibliotecas maduras para fatoração de matriz com dados implícitos (cliques, compras), adequadas ao cenário de feedback implícito predominante do marketplace. |
| Similaridade de conteúdo | `scikit-learn` | Implementação padrão de similaridade de cosseno e pré-processamento de atributos categóricos. |
| API síncrona | `FastAPI` (Python) | Tipagem de contrato via Pydantic, alinhada aos campos de entrada/saída definidos na seção 5. |
| Fila de eventos | `Kafka` ou `Amazon SQS` | Desacoplamento entre ingestão e processamento, atendendo ao requisito de resposta assíncrona (RF04/RNF01). |

### 8.3 Banco de dados (sugestão)

| Uso | Tecnologia sugerida | Justificativa |
|---|---|---|
| Feature Store (leitura rápida) | Banco chave-valor (ex.: Redis) para features pré-calculadas usadas na inferência em tempo real. | Atende ao requisito de tempo de resposta de 300 ms (p95). |
| Histórico de eventos (RF04) | Banco orientado a colunas ou data lake (ex.: BigQuery, Redshift, ou armazenamento em Parquet) | Adequado a cargas analíticas de treinamento e métricas, com grande volume de eventos. |
| Configurações do motor | Banco relacional (ex.: PostgreSQL) | Necessidade de consistência forte e validação transacional das configurações (RF09). |

### 8.4 Organização prevista das pastas (módulo)

```
recomendacao/
├── api/                  # Camada de API síncrona (endpoints REST)
├── ingestao/             # Serviço de ingestão e validação de eventos
├── feature_store/        # Acesso e atualização de features
├── motor/
│   ├── colaborativo/     # Componente de filtragem colaborativa
│   ├── conteudo/         # Componente baseado em atributos
│   └── hibrido.py        # Combinação dos scores e pós-processamento
├── fallback/             # Estratégia de popularidade
├── treinamento/          # Jobs batch de treinamento e avaliação
├── config/               # Gestão de configurações do motor
├── monitoramento/        # Métricas, alertas e auditoria
└── testes/
```

### 8.5 Localização do módulo e ponto de integração

- O módulo é implantado como **serviço desacoplado** (microsserviço), fora do
  monólito/serviço principal do marketplace, comunicando-se exclusivamente via
  API REST (seção 5) e fila de eventos assíncrona.
- O ponto de integração com o sistema principal ocorre em três frentes: (1)
  chamadas síncronas do front-end/back-end do marketplace à API de
  recomendação; (2) publicação de eventos de interação do sistema principal
  para o módulo; (3) leitura periódica de atributos de catálogo e perfil pelo
  módulo (via API do sistema principal ou replicação de dados, a definir).

### 8.6 Ambiente de execução

- Contêineres (Docker) orquestrados via Kubernetes (ou equivalente gerenciado
  pela nuvem já utilizada pelo marketplace), permitindo escalar
  horizontalmente o Serviço de Inferência conforme o volume de requisições
  (RNF02).

### 8.7 Restrições técnicas conhecidas

- O tempo de resposta de 300 ms (p95) exige que o Serving utilize features
  pré-calculadas (não cálculo de similaridade em tempo real sobre todo o
  catálogo a cada requisição).
- O retreinamento diário completo depende do volume de eventos acumulados;
  catálogos muito grandes podem exigir retreinamento incremental em vez de
  completo, a ser avaliado na fase de implementação.
- A qualidade da estratégia de cold start por conteúdo depende do
  preenchimento consistente dos atributos `categoria`, `tecnica` e `material`
  no cadastro de produtos pelos artesãos — uma limitação de qualidade de dados
  de origem, não do módulo em si.
