const {
  EmissaoHistorico,
  FormaAvaliacao,
  ModoControlePresenca,
  Perfil,
  PlanoEscola,
} = require('./enums');

const ANO_LETIVO_ATUAL = new Date().getFullYear();

// Modelos de curso reutilizados pelas duas escolas (siglas/anos escolares seguem a estrutura pedida).
const CURSO_TEMPLATES = {
  EI: {
    sigla: 'EI',
    titulo: 'Educação Infantil',
    modoControlePresenca: ModoControlePresenca.PresencaDiaria,
    emissaoHistorico: EmissaoHistorico.Nao,
    anos: [
      {
        sigla: 'BER',
        titulo: 'Berçário',
        formaAvaliacao: FormaAvaliacao.Conceito,
      },
      {
        sigla: 'MAT1',
        titulo: 'Maternal 1',
        formaAvaliacao: FormaAvaliacao.Conceito,
      },
      {
        sigla: 'MAT2',
        titulo: 'Maternal 2',
        formaAvaliacao: FormaAvaliacao.Conceito,
      },
      {
        sigla: 'PRE1',
        titulo: 'Pré 1',
        formaAvaliacao: FormaAvaliacao.Conceito,
      },
      {
        sigla: 'PRE2',
        titulo: 'Pré 2',
        formaAvaliacao: FormaAvaliacao.Conceito,
      },
    ],
  },
  EF1: {
    sigla: 'EF1',
    titulo: 'Ensino Fundamental 1',
    anos: [
      { sigla: '1EF', titulo: '1º Ano', aulasSemanais: 25 },
      { sigla: '2EF', titulo: '2º Ano', aulasSemanais: 25 },
      { sigla: '3EF', titulo: '3º Ano', aulasSemanais: 25 },
      { sigla: '4EF', titulo: '4º Ano', aulasSemanais: 25 },
      { sigla: '5EF', titulo: '5º Ano', aulasSemanais: 25 },
    ],
  },
  EF2: {
    sigla: 'EF2',
    titulo: 'Ensino Fundamental 2',
    anos: [
      { sigla: '6EF', titulo: '6º Ano', aulasSemanais: 30 },
      { sigla: '7EF', titulo: '7º Ano', aulasSemanais: 30 },
      { sigla: '8EF', titulo: '8º Ano', aulasSemanais: 30 },
      { sigla: '9EF', titulo: '9º Ano', aulasSemanais: 30 },
    ],
  },
};

// Até 10 disciplinas; escolas com menos usam os primeiros N itens desta lista.
const DISCIPLINAS_BASE = [
  { sigla: 'POR', titulo: 'Língua Portuguesa', cor: '#EF4444' },
  { sigla: 'MAT', titulo: 'Matemática', cor: '#3B82F6' },
  { sigla: 'CIE', titulo: 'Ciências', cor: '#22C55E' },
  { sigla: 'HIS', titulo: 'História', cor: '#F59E0B' },
  { sigla: 'GEO', titulo: 'Geografia', cor: '#A855F7' },
  { sigla: 'ART', titulo: 'Artes', cor: '#EC4899' },
  { sigla: 'ING', titulo: 'Inglês', cor: '#06B6D4' },
  { sigla: 'EDF', titulo: 'Educação Física', cor: '#84CC16' },
  { sigla: 'ENR', titulo: 'Ensino Religioso', cor: '#F97316' },
  { sigla: 'FIL', titulo: 'Filosofia', cor: '#64748B' },
];

const ESCOLAS = [
  {
    escolaId: 1,
    plano: PlanoEscola.Gratuito,
    razaoSocial: 'Colégio Educato Alfa',
    nomeFantasia: 'Educato Alfa',
    cidade: 'Curitiba',
    estado: 'PR',
    cnpj: '11.111.111/0001-11',
    email: 'contato.alfa@example.test',
    cursos: ['EI', 'EF1'],
    numDisciplinas: 5,
    numDeliberacoes: 10,
    qtdeAnosLetivos: 4,
    comModeloAvaliacao: false,
    usuarios: [
      {
        perfil: Perfil.AdministracaoGeral,
        cargo: 'Administrador Geral',
        login: 'adm.alfa',
        email: 'adm.alfa@example.test',
      },
      {
        perfil: Perfil.Professor,
        cargo: 'Professor',
        login: 'professor1.alfa',
        email: 'professor1.alfa@example.test',
      },
      {
        perfil: Perfil.Secretaria,
        cargo: 'Secretaria',
        login: 'secretaria.alfa',
        email: 'secretaria.alfa@example.test',
      },
    ],
  },
  {
    escolaId: 2,
    plano: PlanoEscola.Pro,
    razaoSocial: 'Colégio Educato Beta',
    nomeFantasia: 'Educato Beta',
    cidade: 'São Paulo',
    estado: 'SP',
    cnpj: '22.222.222/0001-22',
    email: 'contato.beta@example.test',
    cursos: ['EI', 'EF1', 'EF2'],
    numDisciplinas: 10,
    numDeliberacoes: 20,
    qtdeAnosLetivos: 2,
    comModeloAvaliacao: true,
    usuarios: [
      {
        perfil: Perfil.Administracao,
        cargo: 'Administrador',
        login: 'adm.beta',
        email: 'adm.beta@example.test',
      },
      {
        perfil: Perfil.Secretaria,
        cargo: 'Secretaria',
        login: 'inativo.beta',
        email: 'inativo.beta@example.test',
        inativo: true,
      },
      {
        perfil: Perfil.Direcao,
        cargo: 'Diretor',
        login: 'diretor.beta',
        email: 'diretor.beta@example.test',
      },
      {
        perfil: Perfil.Coordenacao,
        cargo: 'Coordenador Pedagógico',
        login: 'coordenador.beta',
        email: 'coordenador.beta@example.test',
      },
      {
        perfil: Perfil.Professor,
        cargo: 'Professor',
        login: 'professor1.beta',
        email: 'professor1.beta@example.test',
      },
      {
        perfil: Perfil.Professor,
        cargo: 'Professor',
        login: 'professor2.beta',
        email: 'professor2.beta@example.test',
      },
      {
        perfil: Perfil.Professor,
        cargo: 'Professor',
        login: 'professor3.beta',
        email: 'professor3.beta@example.test',
      },
      {
        perfil: Perfil.Secretaria,
        cargo: 'Secretaria',
        login: 'secretaria.beta',
        email: 'secretaria.beta@example.test',
      },
    ],
  },
  {
    escolaId: 3,
    plano: PlanoEscola.Gratuito,
    razaoSocial: 'Colégio Educato Gama',
    nomeFantasia: 'Educato Gama',
    cidade: 'Maringá',
    estado: 'PR',
    cnpj: '33.333.333/0003-33',
    email: 'contato.gama@example.test',
    cursos: [],
    numDisciplinas: 0,
    numDeliberacoes: 0,
    qtdeAnosLetivos: 0,
    comModeloAvaliacao: false,
    usuarios: [
      {
        perfil: Perfil.AdministracaoGeral,
        cargo: 'Administrador Geral',
        login: 'adm.gama',
        email: 'adm.gama@example.test',
      },
    ],
  },
];

module.exports = {
  ESCOLAS,
  CURSO_TEMPLATES,
  DISCIPLINAS_BASE,
  ANO_LETIVO_ATUAL,
};
