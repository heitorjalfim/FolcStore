## Instalando

```bash
npm install
npm run produzirDB
```

## Rodando

Use o seguinte comando para subir o website e o mock api juntos

```bash
npm run dev:full
```

## API

Essa aplicação usa json-server para subir uma API localmente para testes usando os seguintes endpoints:

http://localhost:3001/artesaos<br>
http://localhost:3001/customers<br>
http://localhost:3001/products

base-db.json é a base de dados mockados, o comando "npm run produzirDB" cria local-db.json que sera usado pra API local. Para resetar local-db.json, execute:

```bash
npm run produzirDB
```
