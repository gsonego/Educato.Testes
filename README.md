# Educato.Testes

Repositório de testes integrados do Educato. Roda semanalmente, a cada PR para `main` e sob demanda
para validar funcionalidades importantes do sistema contra um banco de dados de testes sempre limpo.

## Seed do banco de dados

A pasta [`seed/`](./seed) contém um script Node.js que limpa e popula o banco de dados de testes
com um cenário fixo de 3 escolas:

- **Escola Alfa** (plano Pro): cursos de Educação Infantil, Ensino Fundamental 1 e Ensino Fundamental 2,
  além de modelo de avaliação conceitual.
- **Educato Beta** (plano Gratuito): cursos de Educação Infantil e Ensino Fundamental 1.
- **Educato Gama** (sem dados): caso-limite para validar que o seed não quebra com escola vazia.

Nomes de pessoas são gerados aleatoriamente (via [`@faker-js/faker`](https://fakerjs.dev/), locale
`pt_BR`, com seed fixo para reprodutibilidade). Todos os e-mails usam o domínio `example.test`
(reservado pela RFC 2606), portanto nunca são endereços reais.

As tarjetas são geradas **pela própria API de testes** (`POST /Modulos/Ano/{ano}/Tarjetas`), depois
que o cenário é populado — nunca replicando a lógica de geração no seed. Sem `API_BASE_URL`
configurada, a geração é pulada (tabelas `Tarjeta`/`TarjetaMatricula` ficam vazias).

Além da malha, o seed preenche **notas e faltas** das turmas marcadas com `preencherNotaFalta` nos
templates de curso (`CURSO_TEMPLATES` em `seed/src/config.js`), via `POST /Turmas/Notas` — hoje
aplicado à turma `7EFA` da escola Alfa. Faltas são digitadas apenas quando a escola opera com
`origemFaltas = Digitacao`, e alunos transferidos não recebem nota. Grade horária e tabelas de
anexos/relatos continuam fora do escopo deste seed.

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

- A cada **PR para `main`** que altere `seed/**` ou o próprio workflow (valida o branch antes de mesclar)
- **Sob demanda** (`workflow_dispatch`), podendo escolher qualquer branch e informar `API_BASE_URL`
- Automaticamente todo domingo às 03:00 UTC

As credenciais do banco de testes ficam armazenadas como _secrets_ do repositório:
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

Para validar um branch **antes** de abrir o PR, rode o seed sob demanda (Actions → "Seed do banco de
dados de testes" → **Run workflow**) e selecione o branch desejado. Para também gerar as tarjetas via
API, preencha o campo `API_BASE_URL` no dispatch (ou configure o secret `API_BASE_URL`, que vale para
os disparos automáticos de PR/agendamento). A API de testes precisa estar conectada ao mesmo banco
que o seed alimenta — caso contrário o login falha e o seed aponta o erro.
