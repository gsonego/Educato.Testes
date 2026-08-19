const dotenv = require('dotenv');
const { createConnection } = require('mysql');

dotenv.config();

var connection = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// connecting
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    process.exit(1);
  }

  console.log('--------------------------');
  console.log('*** Setting up database...');
  console.log('--------------------------');

  connection.query(`USE ${process.env.DB_NAME}`);

  limparTabelas(connection);

  inserirEscolas(connection);
  inserirUsuarios(connection);
  inserirCursos(connection);
  inserirModulos(connection);
  inserirFaixasDeHorarios(connection);
  inserirAnosEscolares(connection);
  inserirLocais(connection);
  inserirTurmas(connection);
  inserirDisciplinas(connection);
  inserirDeliberacoes(connection);
  inserirPeriodos(connection);
  inserirAlunos(connection);
  inserirMatriculas(connection);
  inserirTurmaDisciplinas(connection);
  inserirTarjetas(connection);
  inserirTarjetasMatriculas(connection);
  inserirGradesHorarias(connection);
  inserirAnosLetivos(connection);

  redefinirAutoIncremento(connection);

  console.log('--------------------------');
  console.log('*** Database set up!');
  console.log('--------------------------');

  connection.end();
});

function queryDb(db, sql) {
  db.query(sql, function (err, result) {
    process.stdout.write('.');

    if (err) {
      process.stdout.write('\n');
      console.log('Erro ao executar: ' + sql);
      console.error(err);
      process.exit(1);
    }
  });
}

function limparTabelas(db) {
  console.log('* Limpando tabelas...');

  queryDb(db, 'DELETE FROM AnoLetivo');
  queryDb(db, 'DELETE FROM Arquivo');
  queryDb(db, 'DELETE FROM AlbumFoto');
  queryDb(db, 'DELETE FROM RegistroPresenca');
  queryDb(db, 'DELETE FROM RegistroDiario');
  queryDb(db, 'DELETE FROM GradeHoraria');
  queryDb(db, 'DELETE FROM DeliberacaoAluno');
  queryDb(db, 'DELETE FROM TarjetaMatricula');
  queryDb(db, 'DELETE FROM Tarjeta');
  queryDb(db, 'DELETE FROM TurmaDisciplina');
  queryDb(db, 'DELETE FROM Matricula');
  queryDb(db, 'DELETE FROM Responsavel');
  queryDb(db, 'DELETE FROM NotaAnterior');
  queryDb(db, 'DELETE FROM EscolaAnterior');
  queryDb(db, 'DELETE FROM Aluno');
  queryDb(db, 'DELETE FROM Deliberacao');
  queryDb(db, 'DELETE FROM Turma');
  queryDb(db, 'DELETE FROM Periodo');
  queryDb(db, 'DELETE FROM FaixaHorario');
  queryDb(db, 'DELETE FROM Disciplina');
  queryDb(db, 'DELETE FROM Local');
  queryDb(db, 'DELETE FROM AnoEscolar');
  queryDb(db, 'DELETE FROM Modulo');
  queryDb(db, 'DELETE FROM Curso');
  queryDb(db, 'DELETE FROM DocumentoModelo');
  queryDb(db, 'DELETE FROM `@Notificacao`');
  queryDb(db, 'DELETE FROM `@MensagemContato`');
  queryDb(db, 'DELETE FROM `@RedefinirSenha`');
  queryDb(db, 'DELETE FROM `@usuario_push_token`');
  queryDb(db, 'DELETE FROM Usuario');
  queryDb(db, 'DELETE FROM Escola');
}

function inserirEscolas(db) {
  console.log('* Inserir Escolas...');

  queryDb(
    db,
    `INSERT INTO Escola
  (EscolaId, RazaoSocial, NomeFantasia, Assinatura, Cnpj, Endereco, Bairro, Cidade, Estado, Cep, Telefone1, Telefone2, Email, Site, Logotipo, Inativo)
  VALUES(1, 'Escola ** PROIBIDA **', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);`,
  );

  queryDb(
    db,
    `INSERT INTO Escola
  (EscolaId, RazaoSocial, NomeFantasia, Assinatura, Cnpj, Endereco, Bairro, Cidade, Estado, Cep, Telefone1, Telefone2, Email, Site, Logotipo, Inativo)
  VALUES(2, 'Escola 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);`,
  );
}

function inserirUsuarios(db) {
  console.log('* Inserir usuarios...');

  queryDb(
    db,
    `INSERT INTO Usuario 
  (UsuarioId, Nome, Login, Senha, Email, Foto, FotoAvatar, Perfil, Cargo, EscolaId, Inativo)
  VALUES(1, 'Usuario ** PROIBIDO **', NULL, '20496f511797779f37c20bbac70eeaac', 'usuario1@teste.com', NULL, NULL, 2, NULL, 1, 0);`,
  );

  queryDb(
    db,
    `INSERT INTO Usuario 
  (UsuarioId, Nome, Login, Senha, Email, Foto, FotoAvatar, Perfil, Cargo, EscolaId, Inativo)
  VALUES(2, 'Usuario Adm Escola 2', NULL, '20496f511797779f37c20bbac70eeaac', 'adm@teste.com', NULL, NULL, 2, NULL, 2, 0);`,
  );

  queryDb(
    db,
    `INSERT INTO Usuario 
  (UsuarioId, Nome, Login, Senha, Email, Foto, FotoAvatar, Perfil, Cargo, EscolaId, Inativo)
  VALUES(3, 'Usuario Inativo Escola 2', NULL, '20496f511797779f37c20bbac70eeaac', 'inativo@teste.com', NULL, NULL, 0, NULL, 2, 1);`,
  );

  queryDb(
    db,
    `INSERT INTO Usuario 
  (UsuarioId, Nome, Login, Senha, Email, Foto, FotoAvatar, Perfil, Cargo, EscolaId, Inativo)
  VALUES(4, 'Diretor Escola 2', NULL, '20496f511797779f37c20bbac70eeaac', 'diretor@teste.com', NULL, NULL, 3, NULL, 2, 0);`,
  );

  queryDb(
    db,
    `INSERT INTO Usuario 
  (UsuarioId, Nome, Login, Senha, Email, Foto, FotoAvatar, Perfil, Cargo, EscolaId, Inativo)
  VALUES(5, 'Coordenador Escola 2', NULL, '20496f511797779f37c20bbac70eeaac', 'coord@teste.com', NULL, NULL, 4, NULL, 2, 0);`,
  );

  queryDb(
    db,
    `INSERT INTO Usuario 
  (UsuarioId, Nome, Login, Senha, Email, Foto, FotoAvatar, Perfil, Cargo, EscolaId, Inativo)
  VALUES(6, 'Professor 1 Escola 2', NULL, '20496f511797779f37c20bbac70eeaac', 'prof1@teste.com', NULL, NULL, 5, NULL, 2, 0);`,
  );

  queryDb(
    db,
    `INSERT INTO Usuario 
  (UsuarioId, Nome, Login, Senha, Email, Foto, FotoAvatar, Perfil, Cargo, EscolaId, Inativo)
  VALUES(7, 'Professor 2 Escola 2', NULL, '20496f511797779f37c20bbac70eeaac', 'prof2@teste.com', NULL, NULL, 5, NULL, 2, 0);`,
  );

  queryDb(
    db,
    `INSERT INTO Usuario 
  (UsuarioId, Nome, Login, Senha, Email, Foto, FotoAvatar, Perfil, Cargo, EscolaId, Inativo)
  VALUES(8, 'Secretaria Escola 2', NULL, '20496f511797779f37c20bbac70eeaac', 'sec@teste.com', NULL, NULL, 6, NULL, 2, 0);`,
  );
}

function inserirCursos(db) {
  console.log('* Inserir cursos...');

  queryDb(
    db,
    `INSERT INTO Curso (Id, EscolaId, Sigla, Titulo, TipoAvaliacao, Inativo) VALUES
      ('b4ebcf56-970a-4a78-b8f0-af018a6d1c48', 1, 'EF', 'Curso ** PROIBIDO **', 2, 0),
      ('88a20b37-8ebf-4be0-849a-df04e4a79533', 2, 'EF', 'Ensino Fundamental Escola 2', 2, 0);`,
  );
}

function inserirModulos(db) {
  console.log('* Inserindo modulos...');

  const ano = new Date().getFullYear();

  queryDb(
    db,
    `INSERT INTO Modulo (Id, EscolaId, Ano, Sigla, Titulo, DataInicio, DataTermino, ConceitoFinal) VALUES
       ('68f28bc6-63e9-477e-87c7-982d315564d2', 1, ${ano - 1}, '1o Bim E1', 'Móodulo ** PROIBIDO **', '${ano - 1}-02-01', '${ano - 1}-03-02', 0),
       ('f4ab3b08-4e14-4d1c-8c9d-162c7b1b742e', 2, ${ano}    , '1o Bim E2', '1o Bimestre Escola 2'  , '${ano}-02-01'    , '${ano}-03-02'    , 0);`,
  );
}

function inserirFaixasDeHorarios(db) {
  console.log('* Inserindo Faixas de Horarios...');

  queryDb(
    db,
    `INSERT INTO FaixaHorario  (Id, EscolaId, Titulo, DiasAula, Inativo) VALUES
    ('cb5711f5-1da7-4a76-a4e1-24d780ff2fd0', 1, 'Faixa Horario ** PROIBIDO **', 62, 0), 
    ('d88c111f-ede9-4ced-8fd7-3ef2d6d0996e', 2, 'Faixa Horario Escola 2', 62, 0); `,
  );
}

function inserirAnosEscolares(db) {
  console.log('* Inserindo Anos Escolares...');

  queryDb(
    db,
    `INSERT INTO AnoEscolar  (Id, Sigla, Titulo, AulasSemanais, CursoId) VALUES
      ('838d3fbc-e582-4a09-8c80-b33c6290543c', 'AEE1', 'Ano escolar ** PROIBIDO **', 0, 'b4ebcf56-970a-4a78-b8f0-af018a6d1c48'), 
      ('d9a135aa-b9bb-4e64-835c-b5dc4b2fcc7c', 'AEE2', 'Ano escolar escola 2', 0, '88a20b37-8ebf-4be0-849a-df04e4a79533');`,
  );
}

function inserirLocais(db) {
  console.log('* Inserindo Locais...');

  queryDb(
    db,
    `INSERT INTO Local (Id, EscolaId, Nome, Inativo) VALUES
      ('7ff661a5-f576-4c01-8327-2cbf49dad489', 1, 'Local ** PROIBIDO **', 0), 
      ('fba498eb-408e-42e9-8006-3d9f9362e59f', 2, 'Local 1 - Escola 2', 0);`,
  );
}

function inserirTurmas(db) {
  console.log('* Inserindo Turmas...');

  const ano = new Date().getFullYear();

  queryDb(
    db,
    `INSERT INTO Turma
    (TurmaId, EscolaId, Ano, Sigla, AnoEscolarId, Turno, Sala, LocalPadraoId, FaixaHorarioId, Vagas, Cor) VALUES
      (1, 1, ${ano - 1}, 'T***', '838d3fbc-e582-4a09-8c80-b33c6290543c', 1, NULL, '7ff661a5-f576-4c01-8327-2cbf49dad489', 'cb5711f5-1da7-4a76-a4e1-24d780ff2fd0', NULL, NULL), 
      (2, 2, ${ano}    , 'T1E2', 'd9a135aa-b9bb-4e64-835c-b5dc4b2fcc7c', 1, NULL, 'fba498eb-408e-42e9-8006-3d9f9362e59f', 'd88c111f-ede9-4ced-8fd7-3ef2d6d0996e', NULL, NULL);`,
  );
}

function inserirDisciplinas(db) {
  console.log('* Inserindo Disciplinas...');

  queryDb(
    db,
    `INSERT INTO Disciplina (Id, EscolaId, Sigla, Titulo, Cor, Inativo) VALUES
      ('3c45bcc2-fbfc-44c5-a80f-99448298d9be', 1, 'DE1', 'Disciplina ** PROIBIDO **', '#FFFF00', 0), 
      ('0ca4c712-ce85-45cf-a60e-2dc54c825305', 2, 'POR', 'Português', '#FF0000', 0), 
      ('ad295361-b1f2-48d9-92a9-aabea6c255e5', 2, 'MAT', 'Matemática', '#00FF00', 0), 
      ('1ccc66f3-4a71-4bf4-9c86-7e52e0746cd1', 2, 'CIE', 'Ciências', '#0000FF', 0),
      ('daeba648-e10e-428c-a318-51e42037b858', 2, 'HIS', 'História', '#FFFF00', 0);`,
  );
}

function inserirDeliberacoes(db) {
  console.log('* Inserindo Deliberacoes...');

  queryDb(
    db,
    `INSERT INTO Deliberacao (Id, EscolaId, Codigo, Descricao, Grupo) VALUES
      ('61fddbb0-d254-4009-9641-f3d61985e755', 1, 'D1E1', 'Deliberacao ** PROIBIDO **', 0), 
      ('5e258efa-d55b-4c58-a2f9-23712aa57492', 2, 'D1E2', 'Deliberacao 1 Escola 2', 0);`,
  );
}

function inserirPeriodos(db) {
  console.log('* Inserindo Periodos...');

  queryDb(
    db,
    `INSERT INTO Periodo (Id, Titulo, FaixaHorarioId, Inicio, Termino, Tipo) VALUES
      ('c9e0abcf-3321-4ca2-83ef-36b8c915cbab', '** PROIBIDO **', 'cb5711f5-1da7-4a76-a4e1-24d780ff2fd0', '00:00', '00:00', 1),
      ('55bfb8b5-1bd1-4144-826f-ec01a307dc02', '1a Aula', 'd88c111f-ede9-4ced-8fd7-3ef2d6d0996e', '07:00', '07:45', 1),
      (UUID(), '2a Aula', 'd88c111f-ede9-4ced-8fd7-3ef2d6d0996e', '07:45', '08:30', 1),
      (UUID(), '3a Aula', 'd88c111f-ede9-4ced-8fd7-3ef2d6d0996e', '08:30', '09:15', 1),
      (UUID(), 'Intervalo', 'd88c111f-ede9-4ced-8fd7-3ef2d6d0996e', '09:15', '09:35', 2),
      (UUID(), '4a Aula', 'd88c111f-ede9-4ced-8fd7-3ef2d6d0996e', '09:35', '10:20', 1),
      (UUID(), '5a Aula', 'd88c111f-ede9-4ced-8fd7-3ef2d6d0996e', '10:20', '11:05', 1),
      (UUID(), '6a Aula', 'd88c111f-ede9-4ced-8fd7-3ef2d6d0996e', '11:05', '11:50', 1),
      (UUID(), '7a Aula', 'd88c111f-ede9-4ced-8fd7-3ef2d6d0996e', '11:50', '12:35', 1);`,
  );
}

function inserirAlunos(db) {
  console.log('* Inserindo Alunos...');

  queryDb(
    db,
    `INSERT INTO Aluno (AlunoId, EscolaId, RA, Nome, DataNascimento, Sexo, Inativo) VALUES
      (1, 1, '666666', 'Aluno ** PROIBIDO **', '2001-01-01', 1, 0), 
      (2, 2, '001002', 'Aluno 1 Escola 2', '2002-01-01', 1, 0), 
      (3, 2, '002002', 'Aluno 2 Escola 2', '2002-02-02', 2, 0), 
      (4, 2, '003002', 'Aluno 3 Escola 2', '2002-03-03', 1, 0), 
      (5, 2, '004002', 'Aluno 4 Escola 2', '2002-04-04', 2, 0), 
      (6, 2, '005002', 'Aluno 5 Escola 2', '2002-05-05', 0, 0);`,
  );
}

function inserirMatriculas(db) {
  console.log('* Inserindo Matriculas...');

  const ano = new Date().getFullYear();

  queryDb(
    db,
    `INSERT INTO Matricula
    (Id, TurmaId, AlunoId, Numero, DataMatricula, Situacao, DataSituacao) VALUES
      ('8a2bf2e5-2cf0-4a07-8837-7d0cf8cb1911', 1, 1, 1, '${ano - 1}-01-01', 1, '${ano - 1}-01-01'), 
      ('0904d669-d65f-482a-b9ac-37205cb724c5', 2, 2, 1, '${ano}-02-01', 1, '${ano}-02-01'), 
      ('a8805ada-e01b-4922-b162-4604d67e644d', 2, 3, 3, '${ano}-02-01', 1, '${ano}-02-01');`,
  );
}

function inserirTurmaDisciplinas(db) {
  console.log('* Inserindo TurmaDisciplinas...');

  queryDb(
    db,
    `INSERT INTO TurmaDisciplina (Id, TurmaId, DisciplinaId, ProfessorId, AulasSemanais) VALUES
      ('851e27b2-e060-4dfa-ad85-cd4eb562518a', 1, '3c45bcc2-fbfc-44c5-a80f-99448298d9be', 1, 5), 
      ('c3d8825b-5957-4522-88b0-b1fc2a994558', 2, '0ca4c712-ce85-45cf-a60e-2dc54c825305', 6, 5), 
      ('22b63a69-c317-4962-af8b-dbee98b4f552', 2, 'ad295361-b1f2-48d9-92a9-aabea6c255e5', 6, 5), 
      ('fafbdca6-8096-4604-ac63-139e43180395', 2, '1ccc66f3-4a71-4bf4-9c86-7e52e0746cd1', 7, 5), 
      ('7e22e549-098d-4840-8a85-e82fc72d38de', 2, 'daeba648-e10e-428c-a318-51e42037b858', 7, 5);  `,
  );
}

function inserirTarjetas(db) {
  console.log('* Inserindo Tarjetas...');

  queryDb(
    db,
    `INSERT INTO Tarjeta (Id, ModuloId, TurmaDisciplinaId, AulasPrevistas, AulasDadas) VALUES
      ('cbad144c-8a0a-4278-8045-0a415d3a5089', '68f28bc6-63e9-477e-87c7-982d315564d2', '851e27b2-e060-4dfa-ad85-cd4eb562518a', 0, 0),
      ('5f1096b4-b7e5-4d6b-a20f-07dc1e9bd683', 'f4ab3b08-4e14-4d1c-8c9d-162c7b1b742e', 'c3d8825b-5957-4522-88b0-b1fc2a994558', 0, 0),
      ('415df0d9-ffb3-4d9b-bfd3-4006512135e4', 'f4ab3b08-4e14-4d1c-8c9d-162c7b1b742e', '22b63a69-c317-4962-af8b-dbee98b4f552', 0, 0), 
      ('8ee57f69-bd49-4258-bf69-3753925d71c1', 'f4ab3b08-4e14-4d1c-8c9d-162c7b1b742e', 'fafbdca6-8096-4604-ac63-139e43180395', 0, 0),
      ('dc70239d-7c19-4be9-95e5-be3866376433', 'f4ab3b08-4e14-4d1c-8c9d-162c7b1b742e', '7e22e549-098d-4840-8a85-e82fc72d38de', 0, 0);`,
  );
}

function inserirTarjetasMatriculas(db) {
  console.log('* Inserindo TarjetasMatriculas...');

  queryDb(
    db,
    `INSERT INTO TarjetaMatricula (Id, TarjetaId, MatriculaId, Conceito, Faltas, FaltasCompensadas, NotaAjustada, FaltaAjustada) VALUES
      ('73c0c9cb-aacb-485d-8e0d-21099cfc58c1', 'cbad144c-8a0a-4278-8045-0a415d3a5089', '8a2bf2e5-2cf0-4a07-8837-7d0cf8cb1911', NULL, NULL, NULL, 0, 0), 
      ('1ab26f16-655c-4f20-8868-5f5d9a167332', '5f1096b4-b7e5-4d6b-a20f-07dc1e9bd683', '0904d669-d65f-482a-b9ac-37205cb724c5', NULL, NULL, NULL, 0, 0),
      ('7f0d078b-af40-4f59-81ff-a23583601f1c', '5f1096b4-b7e5-4d6b-a20f-07dc1e9bd683', 'a8805ada-e01b-4922-b162-4604d67e644d', NULL, NULL, NULL, 0, 0),
      ('c8fa4fa5-0acb-4631-85cb-8d72e06a9341', '415df0d9-ffb3-4d9b-bfd3-4006512135e4', '0904d669-d65f-482a-b9ac-37205cb724c5', NULL, NULL, NULL, 0, 0), 
      ('95a91406-ec4f-42bf-b379-c5cf3bcad8d8', '415df0d9-ffb3-4d9b-bfd3-4006512135e4', 'a8805ada-e01b-4922-b162-4604d67e644d', NULL, NULL, NULL, 0, 0), 
      ('334e0eb7-766d-4b65-b14e-0bd4dd66a95e', '8ee57f69-bd49-4258-bf69-3753925d71c1', '0904d669-d65f-482a-b9ac-37205cb724c5', NULL, NULL, NULL, 0, 0), 
      ('839dc0bd-dc5b-4b02-b7d2-57c3954b48e1', '8ee57f69-bd49-4258-bf69-3753925d71c1', 'a8805ada-e01b-4922-b162-4604d67e644d', NULL, NULL, NULL, 0, 0), 
      ('9728c6b5-6af4-4d7d-b88a-1973897509ef', 'dc70239d-7c19-4be9-95e5-be3866376433', '0904d669-d65f-482a-b9ac-37205cb724c5', NULL, NULL, NULL, 0, 0), 
      ('e6809246-c069-4038-9f21-8b8bf6746cb5', 'dc70239d-7c19-4be9-95e5-be3866376433', 'a8805ada-e01b-4922-b162-4604d67e644d', NULL, NULL, NULL, 0, 0);`,
  );
}

function inserirGradesHorarias(db) {
  console.log('* Inserindo Grades Horarias...');

  queryDb(
    db,
    `INSERT INTO GradeHoraria (Id, AulaId, PeriodoId, DiaSemana) VALUES
      ('91f20ee4-f3e9-4f0d-88d6-ee581292ca00', '851e27b2-e060-4dfa-ad85-cd4eb562518a', 'c9e0abcf-3321-4ca2-83ef-36b8c915cbab', 2), 
      ('231dcce6-f5fa-44dc-a5b1-8138bf3a5d94', 'c3d8825b-5957-4522-88b0-b1fc2a994558','55bfb8b5-1bd1-4144-826f-ec01a307dc02', 2);`,
  );
}

function inserirAnosLetivos(db) {
  console.log('* Inserindo Anos Letivos...');

  queryDb(
    db,
    `
      INSERT INTO AnoLetivo (Id, EscolaId, Ano, Situacao, DataHoraSituacao) VALUES 
      (UUID(), 1, 2024, 2, NOW()),
      (UUID(), 1, 2025, 1, NOW()),
      (UUID(), 1, 2026, 0, NOW()),
      (UUID(), 2, 2024, 2, NOW()),
      (UUID(), 2, 2025, 1, NOW()),
      (UUID(), 2, 2026, 0, NOW());
    `,
  );
}

function redefinirAutoIncremento(db) {
  console.log('* Redefinindo Auto Incremento...');

  queryDb(db, `ALTER TABLE GradeHoraria AUTO_INCREMENT = 2;`);
  queryDb(db, `ALTER TABLE TarjetaMatricula AUTO_INCREMENT = 9;`);
  queryDb(db, `ALTER TABLE Tarjeta AUTO_INCREMENT = 5;`);
  queryDb(db, `ALTER TABLE TurmaDisciplina AUTO_INCREMENT = 5;`);
  queryDb(db, `ALTER TABLE Matricula AUTO_INCREMENT = 3;`);
  queryDb(db, `ALTER TABLE Aluno AUTO_INCREMENT = 6;`);
  queryDb(db, `ALTER TABLE Deliberacao AUTO_INCREMENT = 2;`);
  queryDb(db, `ALTER TABLE Local AUTO_INCREMENT = 2;`);
  queryDb(db, `ALTER TABLE Periodo AUTO_INCREMENT = 8;`);
  queryDb(db, `ALTER TABLE FaixaHorario AUTO_INCREMENT = 2;`);
  queryDb(db, `ALTER TABLE Disciplina AUTO_INCREMENT = 5;`);
  queryDb(db, `ALTER TABLE Turma AUTO_INCREMENT = 2;`);
  queryDb(db, `ALTER TABLE AnoEscolar AUTO_INCREMENT = 2;`);
  queryDb(db, `ALTER TABLE Modulo AUTO_INCREMENT = 2;`);
  queryDb(db, `ALTER TABLE Curso  AUTO_INCREMENT = 2;`);
  queryDb(db, `ALTER TABLE Usuario AUTO_INCREMENT = 5;`);
  queryDb(db, `ALTER TABLE Escola AUTO_INCREMENT = 2;`);
}
