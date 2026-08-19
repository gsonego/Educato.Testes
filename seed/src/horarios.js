const { faker } = require('./faker');
const { DIAS_UTEIS, TipoPeriodo } = require('./enums');

async function seedFaixasHorarias(db, escolas) {
  console.log('* Inserindo faixas de horário...');

  const faixasPorEscola = new Map();

  for (const escola of escolas) {
    const titulos =
      escola.escolaId === 1 ? ['Turno Único'] : ['Matutino', 'Vespertino'];
    const criadas = [];

    for (const titulo of titulos) {
      const id = faker.string.uuid();

      await db.run(
        `INSERT INTO FaixaHorario (Id, EscolaId, Titulo, DiasAula, Inativo) VALUES (?, ?, ?, ?, 0)`,
        [id, escola.escolaId, titulo, DIAS_UTEIS],
      );

      criadas.push({ id, titulo, escolaId: escola.escolaId });
    }

    faixasPorEscola.set(escola.escolaId, criadas);
  }

  return faixasPorEscola;
}

// 6 aulas + 1 intervalo, cobrindo um turno padrão.
const GRADE_PERIODOS = [
  {
    titulo: '1a Aula',
    inicio: '07:00',
    termino: '07:50',
    tipo: TipoPeriodo.Aula,
  },
  {
    titulo: '2a Aula',
    inicio: '07:50',
    termino: '08:40',
    tipo: TipoPeriodo.Aula,
  },
  {
    titulo: '3a Aula',
    inicio: '08:40',
    termino: '09:30',
    tipo: TipoPeriodo.Aula,
  },
  {
    titulo: 'Intervalo',
    inicio: '09:30',
    termino: '09:50',
    tipo: TipoPeriodo.Intervalo,
  },
  {
    titulo: '4a Aula',
    inicio: '09:50',
    termino: '10:40',
    tipo: TipoPeriodo.Aula,
  },
  {
    titulo: '5a Aula',
    inicio: '10:40',
    termino: '11:30',
    tipo: TipoPeriodo.Aula,
  },
  {
    titulo: '6a Aula',
    inicio: '11:30',
    termino: '12:20',
    tipo: TipoPeriodo.Aula,
  },
];

async function seedPeriodos(db, faixasPorEscola) {
  console.log('* Inserindo períodos...');

  const periodosPorFaixa = new Map();

  for (const [, faixas] of faixasPorEscola) {
    for (const faixa of faixas) {
      const criados = [];

      for (const periodo of GRADE_PERIODOS) {
        const id = faker.string.uuid();

        await db.run(
          `INSERT INTO Periodo (Id, Titulo, FaixaHorarioId, Inicio, Termino, Tipo)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            id,
            periodo.titulo,
            faixa.id,
            periodo.inicio,
            periodo.termino,
            periodo.tipo,
          ],
        );

        criados.push({ id, ...periodo, faixaHorarioId: faixa.id });
      }

      periodosPorFaixa.set(faixa.id, criados);
    }
  }

  return periodosPorFaixa;
}

// 1 local por ano escolar, já que cada ano escolar vira exatamente 1 turma.
async function seedLocais(db, escolas, anosEscolaresPorEscola) {
  console.log('* Inserindo locais...');

  const locaisPorEscola = new Map();

  for (const escola of escolas) {
    const anosEscolares = anosEscolaresPorEscola.get(escola.escolaId) ?? [];
    const criados = [];

    for (let i = 0; i < anosEscolares.length; i++) {
      const id = faker.string.uuid();
      const nome = `Sala ${String(i + 1).padStart(2, '0')}`;

      await db.run(
        `INSERT INTO Local (Id, EscolaId, Nome, Inativo) VALUES (?, ?, ?, 0)`,
        [id, escola.escolaId, nome],
      );

      criados.push({ id, nome, escolaId: escola.escolaId });
    }

    locaisPorEscola.set(escola.escolaId, criados);
  }

  return locaisPorEscola;
}

module.exports = { seedFaixasHorarias, seedPeriodos, seedLocais };
