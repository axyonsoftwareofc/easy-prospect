// types/index.ts

// =====================
// EMPRESA (BANCO PRINCIPAL)
// =====================

export interface Empresa {
    id: string;

    // Dados básicos
    nome: string;
    nomeFantasia: string | null;
    cnpj: string | null;
    email: string | null;
    emailSecundario: string | null;
    telefone: string | null;
    telefone2: string | null;
    whatsapp: string | null;
    site: string | null;

    // Localização
    continente: string | null;
    pais: string;
    estado: string | null;
    cidade: string | null;
    endereco: string | null;
    cep: string | null;

    // Classificação
    setor: string;
    subsetor: string | null;
    porte: string | null;
    faturamento: string | null;
    funcionarios: string | null;

    // Tipo de negócio
    tipoNegocio: string | null;
    isImportador: boolean;
    isExportador: boolean;
    isDistribuidor: boolean;
    isFabricante: boolean;
    isVarejo: boolean;
    isAtacado: boolean;

    // Contatos
    responsavel: string | null;
    cargo: string | null;
    linkedinEmpresa: string | null;
    linkedinContato: string | null;
    instagram: string | null;
    facebook: string | null;

    // Metadados
    fonte: string | null;
    qualidade: number;
    verificadoEm: string | null;
    ativo: boolean;

    createdAt: string;
    updatedAt: string;
}

// =====================
// LISTA (MODELO ANTIGO - MANTER COMPATIBILIDADE)
// =====================

export interface Lista {
    id: string;
    nome: string;
    descricao: string | null;
    segmentos: string;
    regioes: string;
    paises: string;
    quantidade: number;
    preco: number;
    precoDesconto: number | null;
    camposInclusos: string;
    taxaValidacao: number;
    arquivoUrl: string | null;
    amostraUrl: string | null;
    imagemUrl: string | null;
    destaque: boolean;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
}

// Lista parseada
export interface ListaParsed extends Omit<Lista, 'segmentos' | 'regioes' | 'paises' | 'camposInclusos'> {
    segmentos: string[];
    regioes: string[];
    paises: string[];
    camposInclusos: string[];
}

// Filtros de busca para listas
export interface FiltrosLista {
    segmento?: string;
    regiao?: string;
    pais?: string;
    precoMin?: number;
    precoMax?: number;
    busca?: string;
}

// =====================
// FILTROS DE BUSCA (EMPRESAS)
// =====================

export interface FiltrosBusca {
    continentes?: string[];
    paises?: string[];
    estados?: string[];
    cidades?: string[];
    setores?: string[];
    subsetores?: string[];
    portes?: string[];
    tiposNegocio?: string[];
    isImportador?: boolean;
    isExportador?: boolean;
    isDistribuidor?: boolean;
    isFabricante?: boolean;
    isVarejo?: boolean;
    isAtacado?: boolean;
    qualidadeMinima?: number;
    atualizadoApos?: string;
    busca?: string;
    pagina?: number;
    limite?: number;
}

// =====================
// RESULTADO DA BUSCA
// =====================

export interface ResultadoBusca {
    empresas: Empresa[];
    total: number;
    pagina: number;
    totalPaginas: number;
    precoPorContato: number;
    precoTotal: number;
    creditosNecessarios: number;
}

// =====================
// PLANOS
// =====================

export interface Plano {
    id: string;
    nome: string;
    nomeExibicao: string;
    preco: number;
    creditosMensal: number;
    setoresMax: number;
    paisesMax: number;
    exportPDF: boolean;
    exportCSV: boolean;
    acessoAPI: boolean;
    suportePrioritario: boolean;
}

// =====================
// COMPANY (MODELO ANTIGO - MANTER COMPATIBILIDADE)
// =====================

export interface Company {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    industry: string | null;
    size: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

// =====================
// CONSTANTES - CONTINENTES
// =====================

export const CONTINENTES = [
    'América do Sul',
    'América do Norte',
    'América Central',
    'Europa',
    'Ásia',
    'África',
    'Oceania',
] as const;

// Alias para compatibilidade
export const REGIOES = CONTINENTES;

// =====================
// CONSTANTES - PAÍSES
// =====================

export const PAISES_POR_CONTINENTE = {
    'América do Sul': [
        { codigo: 'BR', nome: 'Brasil' },
        { codigo: 'AR', nome: 'Argentina' },
        { codigo: 'CL', nome: 'Chile' },
        { codigo: 'CO', nome: 'Colômbia' },
        { codigo: 'PE', nome: 'Peru' },
        { codigo: 'UY', nome: 'Uruguai' },
        { codigo: 'PY', nome: 'Paraguai' },
        { codigo: 'BO', nome: 'Bolívia' },
        { codigo: 'EC', nome: 'Equador' },
        { codigo: 'VE', nome: 'Venezuela' },
    ],
    'América do Norte': [
        { codigo: 'US', nome: 'Estados Unidos' },
        { codigo: 'CA', nome: 'Canadá' },
        { codigo: 'MX', nome: 'México' },
    ],
    'América Central': [
        { codigo: 'PA', nome: 'Panamá' },
        { codigo: 'CR', nome: 'Costa Rica' },
        { codigo: 'GT', nome: 'Guatemala' },
    ],
    'Europa': [
        { codigo: 'PT', nome: 'Portugal' },
        { codigo: 'ES', nome: 'Espanha' },
        { codigo: 'FR', nome: 'França' },
        { codigo: 'DE', nome: 'Alemanha' },
        { codigo: 'IT', nome: 'Itália' },
        { codigo: 'UK', nome: 'Reino Unido' },
        { codigo: 'NL', nome: 'Holanda' },
        { codigo: 'BE', nome: 'Bélgica' },
    ],
    'Ásia': [
        { codigo: 'CN', nome: 'China' },
        { codigo: 'JP', nome: 'Japão' },
        { codigo: 'KR', nome: 'Coreia do Sul' },
        { codigo: 'IN', nome: 'Índia' },
        { codigo: 'AE', nome: 'Emirados Árabes' },
    ],
    'África': [
        { codigo: 'ZA', nome: 'África do Sul' },
        { codigo: 'EG', nome: 'Egito' },
        { codigo: 'NG', nome: 'Nigéria' },
    ],
    'Oceania': [
        { codigo: 'AU', nome: 'Austrália' },
        { codigo: 'NZ', nome: 'Nova Zelândia' },
    ],
} as const;

// Lista simples de países (para compatibilidade)
export const PAISES = Object.values(PAISES_POR_CONTINENTE).flat();

// =====================
// CONSTANTES - SETORES
// =====================

export const SETORES = [
    { id: 'tecnologia', nome: 'Tecnologia', icone: 'laptop' },
    { id: 'alimentos', nome: 'Alimentos & Bebidas', icone: 'utensils' },
    { id: 'vestuario', nome: 'Vestuário & Moda', icone: 'shirt' },
    { id: 'brinquedos', nome: 'Brinquedos', icone: 'gamepad' },
    { id: 'saude', nome: 'Saúde & Farmácia', icone: 'heart-pulse' },
    { id: 'beleza', nome: 'Beleza & Cosméticos', icone: 'sparkles' },
    { id: 'pet', nome: 'Pet Shop & Veterinária', icone: 'dog' },
    { id: 'construcao', nome: 'Construção & Materiais', icone: 'hard-hat' },
    { id: 'automotivo', nome: 'Automotivo', icone: 'car' },
    { id: 'moveis', nome: 'Móveis & Decoração', icone: 'sofa' },
    { id: 'eletronicos', nome: 'Eletrônicos', icone: 'smartphone' },
    { id: 'educacao', nome: 'Educação', icone: 'graduation-cap' },
    { id: 'financeiro', nome: 'Financeiro & Seguros', icone: 'landmark' },
    { id: 'agro', nome: 'Agronegócio', icone: 'wheat' },
    { id: 'servicos', nome: 'Serviços', icone: 'briefcase' },
    { id: 'industria', nome: 'Indústria', icone: 'factory' },
    { id: 'varejo', nome: 'Varejo Geral', icone: 'store' },
    { id: 'outro', nome: 'Outro', icone: 'circle' },
] as const;

// Alias para compatibilidade (lista simples de strings)
export const SEGMENTOS = [
    'Tecnologia',
    'Alimentos',
    'Bebidas',
    'Brinquedos',
    'Vestuário',
    'Saúde',
    'Educação',
    'Financeiro',
    'Indústria',
    'Serviços',
    'Agricultura',
    'Construção',
    'Automotivo',
    'Beleza',
    'Pet',
    'Varejo',
    'Outro'
] as const;

// =====================
// CONSTANTES - PORTES
// =====================

export const PORTES = [
    { id: 'mei', nome: 'MEI', descricao: 'Microempreendedor Individual' },
    { id: 'micro', nome: 'Microempresa', descricao: 'Até 9 funcionários' },
    { id: 'pequena', nome: 'Pequena', descricao: '10-49 funcionários' },
    { id: 'media', nome: 'Média', descricao: '50-249 funcionários' },
    { id: 'grande', nome: 'Grande', descricao: '250+ funcionários' },
] as const;

// =====================
// CONSTANTES - TIPOS DE NEGÓCIO
// =====================

export const TIPOS_NEGOCIO = [
    { id: 'fabricante', nome: 'Fabricante/Indústria', campo: 'isFabricante' },
    { id: 'importador', nome: 'Importador', campo: 'isImportador' },
    { id: 'exportador', nome: 'Exportador', campo: 'isExportador' },
    { id: 'distribuidor', nome: 'Distribuidor/Atacado', campo: 'isDistribuidor' },
    { id: 'varejo', nome: 'Varejo/Loja', campo: 'isVarejo' },
    { id: 'atacado', nome: 'Atacado', campo: 'isAtacado' },
] as const;

// =====================
// CONSTANTES - ESTADOS BRASIL
// =====================

export const ESTADOS_BRASIL = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' },
] as const;

// =====================
// CONSTANTES - CAMPOS DISPONÍVEIS
// =====================

export const CAMPOS_DISPONIVEIS = [
    { id: 'email', nome: 'Email', icone: 'mail' },
    { id: 'telefone', nome: 'Telefone', icone: 'phone' },
    { id: 'whatsapp', nome: 'WhatsApp', icone: 'message-circle' },
    { id: 'cnpj', nome: 'CNPJ', icone: 'file-text' },
    { id: 'responsavel', nome: 'Nome do Responsável', icone: 'user' },
    { id: 'endereco', nome: 'Endereço', icone: 'map-pin' },
    { id: 'site', nome: 'Website', icone: 'globe' },
    { id: 'linkedin', nome: 'LinkedIn', icone: 'linkedin' },
    { id: 'instagram', nome: 'Instagram', icone: 'instagram' },
    { id: 'faturamento', nome: 'Faturamento Estimado', icone: 'dollar-sign' },
    { id: 'funcionarios', nome: 'Nº de Funcionários', icone: 'users' },
] as const;

// =====================
// CONSTANTES - PREÇOS
// =====================

export const PRECOS_POR_REGIAO = {
    'Brasil': 0.08,
    'América do Sul': 0.10,
    'América Latina': 0.12,
    'América do Norte': 0.15,
    'Europa': 0.15,
    'Ásia': 0.18,
    'Global': 0.20,
} as const;

// =====================
// CONSTANTES - PLANOS
// =====================

export const PLANOS_CONFIG = {
    free: {
        nome: 'Gratuito',
        preco: 0,
        creditosMensal: 10,
        setoresMax: 1,
        paisesMax: 1,
        exportPDF: false,
        exportCSV: true,
    },
    starter: {
        nome: 'Starter',
        preco: 99,
        creditosMensal: 500,
        setoresMax: 3,
        paisesMax: 5,
        exportPDF: true,
        exportCSV: true,
    },
    pro: {
        nome: 'Profissional',
        preco: 299,
        creditosMensal: 2000,
        setoresMax: -1,
        paisesMax: -1,
        exportPDF: true,
        exportCSV: true,
    },
    enterprise: {
        nome: 'Enterprise',
        preco: 799,
        creditosMensal: -1,
        setoresMax: -1,
        paisesMax: -1,
        exportPDF: true,
        exportCSV: true,
        acessoAPI: true,
    },
} as const;

// =====================
// CAMPOS PARA EXPORTAÇÃO
// =====================

export const CAMPOS_EXPORTACAO = [
    { id: 'nome', nome: 'Nome da Empresa', obrigatorio: true },
    { id: 'email', nome: 'Email', obrigatorio: true },
    { id: 'telefone', nome: 'Telefone', obrigatorio: false },
    { id: 'whatsapp', nome: 'WhatsApp', obrigatorio: false },
    { id: 'cnpj', nome: 'CNPJ', obrigatorio: false },
    { id: 'responsavel', nome: 'Responsável', obrigatorio: false },
    { id: 'cargo', nome: 'Cargo', obrigatorio: false },
    { id: 'endereco', nome: 'Endereço Completo', obrigatorio: false },
    { id: 'cidade', nome: 'Cidade', obrigatorio: false },
    { id: 'estado', nome: 'Estado', obrigatorio: false },
    { id: 'site', nome: 'Website', obrigatorio: false },
    { id: 'linkedin', nome: 'LinkedIn', obrigatorio: false },
    { id: 'instagram', nome: 'Instagram', obrigatorio: false },
    { id: 'setor', nome: 'Setor', obrigatorio: false },
    { id: 'porte', nome: 'Porte', obrigatorio: false },
] as const;