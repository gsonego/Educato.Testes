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

const FOTOS_MENINOS = [
  '53725b3b-9ac4-4725-ba1f-19ea6bc4e958.jpg',
  'afed38a7-e370-43e3-af97-2ef46b2bdd2b.jpg',
  '8ac58833-f4fa-4ca3-bb17-4e6addce824d.jpg',
  'd9df27db-ed53-4a99-a25d-614343d0f39f.jpg',
  'c1cb549a-fe57-4039-9938-b6c1d99e61ec.jpg',
  'dc66f615-6dc7-4f4e-acf8-1103f0bc10d9.jpg',
  'b44efb77-ab32-4e45-9f89-92f83a5f1f5d.jpg',
  '3ba189ec-ed80-4694-92ed-154b64341eb7.jpg',
  '00188405-0090-43de-ba83-16bf3a50e506.jpg',
  'ddfd773d-02c5-4fc3-9740-3960f66e6754.jpg',
  'b3eee644-8133-4bcc-a1f9-6c23274f20bb.jpg',
  'c21ff025-b0e4-4e3c-973e-09c73338a61e.jpg',
  '143605dc-3981-432a-8bb9-a32ce8b43889.jpg',
  '3f8b8ee6-ff1f-42c0-8d00-25bf7ed58bcb.jpg',
  'e07851a3-5d1f-4b06-915b-6fb4bb14622b.jpg',
  '5ad2cb75-15f8-4097-8e4c-4dbdee6c1899.jpg',
  '0c788e87-c901-4187-b16b-1b7d82a12c06.jpg',
  '08882c94-9038-48c5-8eba-4925987bad15.jpg',
  '2be89c90-0229-403f-a30f-51292f7c7e11.jpg',
  'ad6603a6-9977-476f-a74d-45ce05468c1d.jpg',
];

const FOTOS_MENINAS = [
  'f92a2b75-0193-4c07-a671-9af9a6de6d19.jpg',
  '70ffbb37-8f67-4407-b8e5-c25c107bfa07.jpg',
  '7faa6c06-b0dc-4a83-91c8-1ca1b12af91c.jpg',
  'cd83d9e9-148c-42b4-8a00-2a2b49596cf6.jpg',
  '0f21fcd7-4130-4183-8f0f-9331062906b5.jpg',
  'fbcda02a-52c1-4890-8092-685d068e61e1.jpg',
  '39775430-d4ce-4bc4-a866-3fd02eac558a.jpg',
  'bf57d5bb-6304-4ce7-a9ff-d896b1323fcd.jpg',
  '0a14d2e0-1513-4347-8147-cdf2f67b9707.jpg',
  '0f754803-8413-46ab-8364-badfc66ec1e7.jpg',
  'a969fd65-948b-4f83-8e76-75026304e8f6.jpg',
  '295d4abb-99f1-48f3-9c9e-369b46ed0016.jpg',
  '5593b41e-5922-4512-b122-172daaee1efa.jpg',
  '24a409a9-60ac-46ba-aca2-32d4e9843d9e.jpg',
  'f478892e-19d3-4723-a50a-8279e6101a39.jpg',
  '3487c959-f6a2-4265-806b-635feb374c3b.jpg',
  'c4a821a7-121f-44bb-b85f-74e00f460744.jpg',
  'b6ba7e62-3ab2-454e-9154-1a683a8686bb.jpg',
  '647e33f5-7c4c-4a4c-887a-843b717888b4.jpg',
  '10fce9b7-6a85-42e6-aa1a-ce0ce5e4c17d.jpg',
  '56e79ed2-fd08-4634-9057-0af8bc785f56.jpg',
  'dbe3f0b9-e3de-4cdd-9d39-47517e2a030e.jpg',
];

const ESCOLAS = [
  {
    escolaId: 1,
    plano: PlanoEscola.Pro,
    razaoSocial: 'Colégio Educato Alfa',
    nomeFantasia: 'Educato Alfa',
    cnpj: '56.411.752/0001-08',
    email: 'contato.alfa@example.test',
    cursos: ['EI', 'EF1', 'EF2'],
    numDisciplinas: 10,
    numDeliberacoes: 20,
    qtdeAnosLetivos: 4,
    comModeloAvaliacao: true,
    usuarios: [
      {
        perfil: Perfil.Administracao,
        cargo: 'Administrador',
        login: 'adm.alfa',
        email: 'adm.alfa@example.test',
      },
      {
        perfil: Perfil.Secretaria,
        cargo: 'Secretaria',
        login: 'inativo.alfa',
        email: 'inativo.alfa@example.test',
        inativo: true,
      },
      {
        perfil: Perfil.Direcao,
        cargo: 'Diretor',
        login: 'diretor.alfa',
        email: 'diretor.alfa@example.test',
      },
      {
        perfil: Perfil.Coordenacao,
        cargo: 'Coordenador Pedagógico',
        login: 'coordenador.alfa',
        email: 'coordenador.alfa@example.test',
      },
      {
        perfil: Perfil.Professor,
        cargo: 'Professor',
        login: 'professor1.alfa',
        email: 'professor1.alfa@example.test',
      },
      {
        perfil: Perfil.Professor,
        cargo: 'Professor',
        login: 'professor2.alfa',
        email: 'professor2.alfa@example.test',
      },
      {
        perfil: Perfil.Professor,
        cargo: 'Professor',
        login: 'professor3.alfa',
        email: 'professor3.alfa@example.test',
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
    plano: PlanoEscola.Gratuito,
    razaoSocial: 'Colégio Educato Beta',
    nomeFantasia: 'Educato Beta',
    cnpj: '24.344.925/0001-18',
    email: 'contato.beta@example.test',
    cursos: ['EI', 'EF1'],
    numDisciplinas: 5,
    numDeliberacoes: 10,
    qtdeAnosLetivos: 2,
    comModeloAvaliacao: false,
    usuarios: [
      {
        perfil: Perfil.AdministracaoGeral,
        cargo: 'Administrador Geral',
        login: 'adm.beta',
        email: 'adm.beta@example.test',
      },
      {
        perfil: Perfil.Professor,
        cargo: 'Professor',
        login: 'professor1.beta',
        email: 'professor1.beta@example.test',
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
    cnpj: '50.176.895/0001-98',
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
  FOTOS_MENINAS,
  FOTOS_MENINOS,
};
