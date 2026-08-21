// Espelha os enums de Educato.Domain.Enums (Educato.Api) - manter em sincronia se o domínio mudar.

const PlanoEscola = { Gratuito: 0, Pro: 1 };

const Perfil = {
  Indefinido: 0,
  AdministracaoGeral: 1,
  Administracao: 2,
  Direcao: 3,
  Coordenacao: 4,
  Professor: 5,
  Secretaria: 6,
};

const Sexo = { NaoInformado: 0, Masculino: 1, Feminino: 2 };

const Turno = {
  Indefinido: 0,
  Matutino: 1,
  Vespertino: 2,
  Noturno: 3,
  Integral: 4,
};

const SituacaoMatricula = {
  NaoInformado: 0,
  Ativo: 1,
  Transferido: 2,
  Promovido: 3,
  Retido: 4,
  RetidoFrequencia: 5,
  Reclassificado: 6,
  Desistente: 7,
};

const SituacaoAnoLetivo = { Planejado: 0, Ativo: 1, Encerrado: 2 };

const Parentesco = { Pai: 1, Mae: 2, Avo: 4, Tia: 6 };

const TipoAvaliacao = { Indefinido: 0, Semestral: 1, Anual: 2 };

const FormaAvaliacao = { Indefinido: 0, Nota: 1, Conceito: 2 };

const TipoPeriodo = { Aula: 1, Intervalo: 2 };

const ModoControlePresenca = {
  NaoInformado: 0,
  PresencaDiaria: 1,
  PresencaPorAula: 2,
};

const EmissaoHistorico = { Nao: 0, Sim: 1, Opcional: 2 };

const DiaSemana = {
  Domingo: 1,
  Segunda: 2,
  Terca: 4,
  Quarta: 8,
  Quinta: 16,
  Sexta: 32,
  Sabado: 64,
};

// Bitmask Segunda a Sexta (2+4+8+16+32)
const DIAS_UTEIS =
  DiaSemana.Segunda |
  DiaSemana.Terca |
  DiaSemana.Quarta |
  DiaSemana.Quinta |
  DiaSemana.Sexta;

module.exports = {
  PlanoEscola,
  Perfil,
  Sexo,
  Turno,
  SituacaoMatricula,
  SituacaoAnoLetivo,
  Parentesco,
  TipoAvaliacao,
  FormaAvaliacao,
  TipoPeriodo,
  ModoControlePresenca,
  EmissaoHistorico,
  DiaSemana,
  DIAS_UTEIS,
};
