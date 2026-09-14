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
http://localhost:3001/products<br>
http://localhost:3001/admins<br>

O arquivo base-db.json é a base que é copiada para o BD local. Para resetar a DB local, execute:

```bash
npm run produzirDB
```
