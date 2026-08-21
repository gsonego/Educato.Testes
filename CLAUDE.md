# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este repositório

Apesar do nome `Educato.Testes`, o repositório hoje contém apenas o script de **seed** do banco de
dados de testes integrados — não há suite de testes automatizados aqui ainda. O seed limpa e
repopula o banco com um cenário fixo de 3 escolas (Alfa/Pro, Beta/Gratuito, Gama/caso-limite sem
dados) usado para validar o sistema Educato de ponta a ponta.

`.github/workflows/seed-database.yml` roda esse seed automaticamente todo domingo às 03:00 UTC e
sob demanda (`workflow_dispatch`).

## Comandos

Todos os comandos rodam a partir da pasta `seed/`:

```bash
cd seed
cp .env.example .env   # preencher com credenciais do banco de TESTES (nunca produção)
npm install
npm run seed           # executa node seed.js
```

Não há lint, formatter, build ou testes automatizados configurados neste repositório — não
inventar esses comandos.

## Arquitetura

- **`seed/seed.js`** — ponto de entrada único. Chama `limparBanco` e depois uma sequência fixa de
  funções `seedX` de `seed/src/*.js`, repassando adiante os retornos (geralmente `Map`s indexados
  por `escolaId`/`turmaId`) como argumentos das etapas seguintes (ex.: `seedTurmas` depende de
  `anosEscolaresPorEscola`, `locaisPorEscola`, etc. produzidos por etapas anteriores). Essa ordem é
  ditada pelas foreign keys do banco — novas etapas de seed precisam ser inseridas na posição certa
  dentro de `main()`.
- **`seed/src/db.js`** — wrapper fino sobre um pool `mysql2/promise`, expondo `run(sql, params)` e
  `close()`. Sempre parametrizado; nunca interpolar valores direto na query.
- **`seed/src/config.js`** — dados do cenário fixo: array `ESCOLAS` (as 3 escolas com seus
  `usuarios` aninhados), `CURSO_TEMPLATES`, `DISCIPLINAS_BASE`, pools de fotos fictícias. É este o
  arquivo a editar para mudar o que é gerado pelo seed.
- **`seed/src/enums.js`** — espelha os enums de `Educato.Domain.Enums` (repo `Educato.Api`); precisa
  ser atualizado manualmente se o domínio mudar lá.
- **`seed/src/faker.js`** — instância compartilhada do faker (`fakerPT_BR`, seed fixo `20260819`
  para runs reprodutíveis), mais `EMAIL_DOMAIN_FICTICIO` (`example.test`, reservado pela RFC 2606) e
  o slugifier `loginUnico`. Os demais módulos importam o faker daqui, não direto de
  `@faker-js/faker`.
- **`seed/src/clean.js`** — `limparBanco` desliga `FOREIGN_KEY_CHECKS`, apaga cada tabela do domínio
  na ordem definida em `TABELAS` (filhas antes das pais) e religa os checks. Ao adicionar uma nova
  tabela de domínio, atualizar essa lista.
- **Módulos de seed por entidade** (`escolas.js`, `usuarios.js`, `academico.js`, `anosLetivos.js`,
  `horarios.js`, `avaliacao.js`, `turmas.js`, `disciplinas.js`, `turmaDisciplinas.js`, `alunos.js`)
  — cada um exporta uma ou mais funções `seedX(db, ...)` seguindo o mesmo formato: laço sobre
  escolas/entidades, `console.log` de progresso em português, `INSERT` parametrizado, e retorno do
  que as etapas seguintes precisarem (normalmente um `Map` por id). Novas entidades devem seguir
  esse mesmo padrão em vez de introduzir um estilo novo.
- **Domínio em pt-BR** em todo o código — nomes de tabelas/colunas, variáveis e mensagens de log
  (convenção compartilhada com os demais repositórios do ecossistema Educato).

## Segurança

- O seed faz `DELETE` de todos os dados das tabelas do domínio antes de inserir o cenário novo —
  rodar apenas contra o banco de testes, nunca produção.
- `seed/.env` guarda credenciais reais (do banco de testes) e já está no `.gitignore` — nunca ler
  ou expor seu conteúdo.
- Secrets usados pelo workflow do GitHub Actions: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`,
  `DB_NAME`.
