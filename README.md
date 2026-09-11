## Instalando

```bash
npm install
```

## Rodando

Use o seguinte comando para subir o website e o mock api juntos

```bash
npm run dev:full
```

## API

Essa aplicação usa json-server para subir uma API localmente para testes usando os seguintes endpoints:

http://localhost:3001/artesaos
http://localhost:3001/customers
http://localhost:3001/products

Toda vez que o mock api sobe, é usado uma copia de base-db.json para não poluir a base de dados falsa. Para alteração persistente dos dados mockados, altere base-db.json
