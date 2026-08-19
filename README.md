# Educato.Testes

Repositório de testes integrados do Educato. Roda semanalmente (e sob demanda) para validar
funcionalidades importantes do sistema contra um banco de dados de testes sempre limpo.

## Seed do banco de dados

A pasta [`seed/`](./seed) contém um script Node.js que limpa e popula o banco de dados de testes
com um cenário fixo de 2 escolas:

- **Escola Alfa** (plano Gratuito): cursos de Educação Infantil e Ensino Fundamental 1.
- **Colégio Beta** (plano Pro): cursos de Educação Infantil, Ensino Fundamental 1 e Ensino Fundamental 2,
  além de modelo de avaliação conceitual.

Nomes de pessoas são gerados aleatoriamente (via [`@faker-js/faker`](https://fakerjs.dev/), locale
`pt_BR`, com seed fixo para reprodutibilidade). Todos os e-mails usam o domínio `example.test`
(reservado pela RFC 2606), portanto nunca são endereços reais.

Tarjetas, grade horária e tabelas de anexos/relatos ficam fora do escopo deste seed.

### Rodando localmente

```bash
cd seed
cp .env.example .env   # preencha com as credenciais do banco de testes
npm install
npm run seed
```

⚠️ O script apaga (`DELETE`) todos os dados das tabelas do domínio antes de inserir o novo cenário.
Use apenas contra um banco de testes, nunca produção.

### Login dos usuários seed

Todos os usuários criados usam a senha `Teste@123`. Veja `seed/src/config.js` para a lista de
logins (ex.: `adm.alfa`, `professor1.beta`, `secretaria.beta`, etc.).

## Workflow no GitHub Actions

[`.github/workflows/seed-database.yml`](./.github/workflows/seed-database.yml) executa o seed:

- Sob demanda (`workflow_dispatch`)
- Automaticamente todo domingo às 03:00 UTC

As credenciais do banco de testes ficam armazenadas como _secrets_ do repositório:
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
