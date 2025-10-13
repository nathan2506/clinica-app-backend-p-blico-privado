Clinica App Backend - revisão rápida

Instalação

1. Instale dependências:

   npm install

2. Configure variáveis de ambiente (DB_*) no arquivo `.env`. Variáveis esperadas:

   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, PORT

Rodando migrations (psql)

Se você tem `psql` configurado, rode as migrations e seed:

```bash
# exporte as variáveis de conexão ou use seu arquivo .pgpass
psql "host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER" -f utils/sql/001_create_tables.sql
psql "host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER" -f utils/sql/002_seed_example.sql
```

Rodando localmente

  node app.js

Testes

  npm test

Notas

- O projeto usa Express e PostgreSQL (`pg`).
- Os endpoints básicos estão em `routes/`.
- Para testes leves o servidor é importado sem iniciar o listener.
