// app/construtor/page.tsx

'use client';

import { useState, useEffect } from 'react';
import {
    Search, MapPin, Building2, Factory, Filter,
    FileSpreadsheet, FileText, Eye, ChevronDown, ChevronUp,
    Loader2, Package, Globe, Users, ShoppingCart, Truck,
    Store, Warehouse, X, Sparkles
} from 'lucide-react';
import Link from 'next/link';

// Definir tipos localmente para evitar problemas de importação
const CONTINENTES = [
    'América do Sul',
    'América do Norte',
    'América Central',
    'Europa',
    'Ásia',
    'África',
    'Oceania',
];

const PAISES_POR_CONTINENTE: Record<string, { codigo: string; nome: string }[]> = {
    'América do Sul': [
        { codigo: 'BR', nome: 'Brasil' },
        { codigo: 'AR', nome: 'Argentina' },
        { codigo: 'CL', nome: 'Chile' },
        { codigo: 'CO', nome: 'Colômbia' },
        { codigo: 'PE', nome: 'Peru' },
        { codigo: 'UY', nome: 'Uruguai' },
        { codigo: 'PY', nome: 'Paraguai' },
    ],
    'América do Norte': [
        { codigo: 'US', nome: 'Estados Unidos' },
        { codigo: 'CA', nome: 'Canadá' },
        { codigo: 'MX', nome: 'México' },
    ],
    'América Central': [
        { codigo: 'PA', nome: 'Panamá' },
        { codigo: 'CR', nome: 'Costa Rica' },
    ],
    'Europa': [
        { codigo: 'PT', nome: 'Portugal' },
        { codigo: 'ES', nome: 'Espanha' },
        { codigo: 'FR', nome: 'França' },
        { codigo: 'DE', nome: 'Alemanha' },
        { codigo: 'IT', nome: 'Itália' },
        { codigo: 'UK', nome: 'Reino Unido' },
    ],
    'Ásia': [
        { codigo: 'CN', nome: 'China' },
        { codigo: 'JP', nome: 'Japão' },
        { codigo: 'KR', nome: 'Coreia do Sul' },
    ],
    'África': [
        { codigo: 'ZA', nome: 'África do Sul' },
        { codigo: 'EG', nome: 'Egito' },
    ],
    'Oceania': [
        { codigo: 'AU', nome: 'Austrália' },
        { codigo: 'NZ', nome: 'Nova Zelândia' },
    ],
};

const SETORES = [
    { id: 'tecnologia', nome: 'Tecnologia' },
    { id: 'alimentos', nome: 'Alimentos & Bebidas' },
    { id: 'vestuario', nome: 'Vestuário & Moda' },
    { id: 'brinquedos', nome: 'Brinquedos' },
    { id: 'saude', nome: 'Saúde & Farmácia' },
    { id: 'beleza', nome: 'Beleza & Cosméticos' },
    { id: 'pet', nome: 'Pet Shop & Veterinária' },
    { id: 'construcao', nome: 'Construção & Materiais' },
    { id: 'automotivo', nome: 'Automotivo' },
    { id: 'eletronicos', nome: 'Eletrônicos' },
    { id: 'educacao', nome: 'Educação' },
    { id: 'servicos', nome: 'Serviços' },
    { id: 'industria', nome: 'Indústria' },
    { id: 'varejo', nome: 'Varejo Geral' },
];

const PORTES = [
    { id: 'mei', nome: 'MEI' },
    { id: 'micro', nome: 'Microempresa' },
    { id: 'pequena', nome: 'Pequena' },
    { id: 'media', nome: 'Média' },
    { id: 'grande', nome: 'Grande' },
];

const ESTADOS_BRASIL = [
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'DF', nome: 'Distrito Federal' },
];

interface Stats {
    total: number;
    porSetor: { nome: string; count: number }[];
    porPais: { nome: string; count: number }[];
    porContinente: { nome: string; count: number }[];
    porEstado: { nome: string; count: number }[];
    porPorte: { nome: string; count: number }[];
    tiposNegocio: {
        importadores: number;
        exportadores: number;
        distribuidores: number;
        fabricantes: number;
        varejo: number;
        atacado: number;
    };
}

interface Resultado {
    total: number;
    precoPorContato: number;
    precoTotal: number;
    creditosNecessarios: number;
}

export default function ConstrutorPage() {
    const [continentesSelecionados, setContinentesSelecionados] = useState<string[]>([]);
    const [paisesSelecionados, setPaisesSelecionados] = useState<string[]>([]);
    const [estadosSelecionados, setEstadosSelecionados] = useState<string[]>([]);
    const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>([]);
    const [portesSelecionados, setPortesSelecionados] = useState<string[]>([]);

    const [isImportador, setIsImportador] = useState(false);
    const [isExportador, setIsExportador] = useState(false);
    const [isDistribuidor, setIsDistribuidor] = useState(false);
    const [isFabricante, setIsFabricante] = useState(false);
    const [isVarejo, setIsVarejo] = useState(false);
    const [isAtacado, setIsAtacado] = useState(false);

    const [busca, setBusca] = useState('');
    const [stats, setStats] = useState<Stats | null>(null);
    const [resultado, setResultado] = useState<Resultado | null>(null);
    const [loading, setLoading] = useState(true);
    const [buscando, setBuscando] = useState(false);

    const [secaoLocalizacao, setSecaoLocalizacao] = useState(true);
    const [secaoSetor, setSecaoSetor] = useState(true);
    const [secaoTipoNegocio, setSecaoTipoNegocio] = useState(false);
    const [secaoPorte, setSecaoPorte] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            buscarResultado();
        }, 300);
        return () => clearTimeout(timer);
    }, [
        continentesSelecionados, paisesSelecionados, estadosSelecionados,
        setoresSelecionados, portesSelecionados,
        isImportador, isExportador, isDistribuidor, isFabricante, isVarejo, isAtacado,
        busca
    ]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/empresas/stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Erro ao buscar stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const buscarResultado = async () => {
        setBuscando(true);
        try {
            const params = new URLSearchParams();
            params.append('apenasContar', 'true');

            if (continentesSelecionados.length > 0) params.append('continentes', continentesSelecionados.join(','));
            if (paisesSelecionados.length > 0) params.append('paises', paisesSelecionados.join(','));
            if (estadosSelecionados.length > 0) params.append('estados', estadosSelecionados.join(','));
            if (setoresSelecionados.length > 0) params.append('setores', setoresSelecionados.join(','));
            if (portesSelecionados.length > 0) params.append('portes', portesSelecionados.join(','));
            if (isImportador) params.append('isImportador', 'true');
            if (isExportador) params.append('isExportador', 'true');
            if (isDistribuidor) params.append('isDistribuidor', 'true');
            if (isFabricante) params.append('isFabricante', 'true');
            if (isVarejo) params.append('isVarejo', 'true');
            if (isAtacado) params.append('isAtacado', 'true');
            if (busca) params.append('busca', busca);

            const response = await fetch(`/api/empresas?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setResultado({
                    total: data.total,
                    precoPorContato: data.precoPorContato,
                    precoTotal: data.precoTotal,
                    creditosNecessarios: data.creditosNecessarios,
                });
            }
        } catch (error) {
            console.error('Erro ao buscar:', error);
        } finally {
            setBuscando(false);
        }
    };

    const toggleArray = (array: string[], setArray: (arr: string[]) => void, value: string) => {
        if (array.includes(value)) {
            setArray(array.filter(v => v !== value));
        } else {
            setArray([...array, value]);
        }
    };

    const limparFiltros = () => {
        setContinentesSelecionados([]);
        setPaisesSelecionados([]);
        setEstadosSelecionados([]);
        setSetoresSelecionados([]);
        setPortesSelecionados([]);
        setIsImportador(false);
        setIsExportador(false);
        setIsDistribuidor(false);
        setIsFabricante(false);
        setIsVarejo(false);
        setIsAtacado(false);
        setBusca('');
    };

    const temFiltrosAtivos =
        continentesSelecionados.length > 0 ||
        paisesSelecionados.length > 0 ||
        estadosSelecionados.length > 0 ||
        setoresSelecionados.length > 0 ||
        portesSelecionados.length > 0 ||
        isImportador || isExportador || isDistribuidor ||
        isFabricante || isVarejo || isAtacado ||
        busca.length > 0;

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const paisesDisponiveis = continentesSelecionados.length > 0
        ? continentesSelecionados.flatMap(c => PAISES_POR_CONTINENTE[c] || [])
        : Object.values(PAISES_POR_CONTINENTE).flat();

    const buildQueryString = () => {
        const params = new URLSearchParams();
        if (continentesSelecionados.length > 0) params.append('continentes', continentesSelecionados.join(','));
        if (paisesSelecionados.length > 0) params.append('paises', paisesSelecionados.join(','));
        if (estadosSelecionados.length > 0) params.append('estados', estadosSelecionados.join(','));
        if (setoresSelecionados.length > 0) params.append('setores', setoresSelecionados.join(','));
        if (portesSelecionados.length > 0) params.append('portes', portesSelecionados.join(','));
        if (isImportador) params.append('isImportador', 'true');
        if (isExportador) params.append('isExportador', 'true');
        if (isDistribuidor) params.append('isDistribuidor', 'true');
        if (isFabricante) params.append('isFabricante', 'true');
        if (isVarejo) params.append('isVarejo', 'true');
        if (isAtacado) params.append('isAtacado', 'true');
        if (busca) params.append('busca', busca);
        return params.toString();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8" />
                        <h1 className="text-3xl font-bold">Construtor de Lista</h1>
                    </div>
                    <p className="text-blue-100 text-lg">
                        Monte sua lista personalizada com os filtros abaixo
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filtros */}
                    <div className="lg:w-2/3 space-y-4">
                        {/* Busca */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nome, cidade..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Localização */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setSecaoLocalizacao(!secaoLocalizacao)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    <span className="font-semibold text-gray-900">Localização</span>
                                </div>
                                {secaoLocalizacao ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            {secaoLocalizacao && (
                                <div className="px-6 pb-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Continente</label>
                                        <div className="flex flex-wrap gap-2">
                                            {CONTINENTES.map((cont) => (
                                                <button
                                                    key={cont}
                                                    onClick={() => toggleArray(continentesSelecionados, setContinentesSelecionados, cont)}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                                        continentesSelecionados.includes(cont)
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {cont}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                                            {paisesDisponiveis.map((pais) => (
                                                <button
                                                    key={pais.codigo}
                                                    onClick={() => toggleArray(paisesSelecionados, setPaisesSelecionados, pais.nome)}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                                        paisesSelecionados.includes(pais.nome)
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {pais.nome}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {paisesSelecionados.includes('Brasil') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Estado (Brasil)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {ESTADOS_BRASIL.map((estado) => (
                                                    <button
                                                        key={estado.sigla}
                                                        onClick={() => toggleArray(estadosSelecionados, setEstadosSelecionados, estado.sigla)}
                                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                                            estadosSelecionados.includes(estado.sigla)
                                                                ? 'bg-purple-500 text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {estado.sigla}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Setor */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setSecaoSetor(!secaoSetor)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-5 h-5 text-purple-600" />
                                    <span className="font-semibold text-gray-900">Setor de Atuação</span>
                                </div>
                                {secaoSetor ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            {secaoSetor && (
                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {SETORES.map((setor) => (
                                            <button
                                                key={setor.id}
                                                onClick={() => toggleArray(setoresSelecionados, setSetoresSelecionados, setor.nome)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                                                    setoresSelecionados.includes(setor.nome)
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {setor.nome}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tipo de Negócio */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setSecaoTipoNegocio(!secaoTipoNegocio)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Factory className="w-5 h-5 text-orange-600" />
                                    <span className="font-semibold text-gray-900">Tipo de Negócio</span>
                                </div>
                                {secaoTipoNegocio ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            {secaoTipoNegocio && (
                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {[
                                            { label: 'Importador', checked: isImportador, set: setIsImportador, icon: Globe },
                                            { label: 'Exportador', checked: isExportador, set: setIsExportador, icon: Truck },
                                            { label: 'Distribuidor', checked: isDistribuidor, set: setIsDistribuidor, icon: Warehouse },
                                            { label: 'Fabricante', checked: isFabricante, set: setIsFabricante, icon: Factory },
                                            { label: 'Varejo', checked: isVarejo, set: setIsVarejo, icon: Store },
                                            { label: 'Atacado', checked: isAtacado, set: setIsAtacado, icon: Package },
                                        ].map((item) => (
                                            <label
                                                key={item.label}
                                                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                                    item.checked ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={item.checked}
                                                    onChange={(e) => item.set(e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <item.icon className="w-5 h-5 text-orange-600" />
                                                <span className="font-medium text-gray-900">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Porte */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setSecaoPorte(!secaoPorte)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-green-600" />
                                    <span className="font-semibold text-gray-900">Porte da Empresa</span>
                                </div>
                                {secaoPorte ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            {secaoPorte && (
                                <div className="px-6 pb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {PORTES.map((porte) => (
                                            <button
                                                key={porte.id}
                                                onClick={() => toggleArray(portesSelecionados, setPortesSelecionados, porte.id)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    portesSelecionados.includes(porte.id)
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {porte.nome}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resultado */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Resultado da Busca</h2>

                            {buscando ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                </div>
                            ) : resultado ? (
                                <>
                                    <div className="text-center py-6 border-b border-gray-200">
                                        <div className="text-5xl font-bold text-gray-900 mb-2">
                                            {resultado.total.toLocaleString()}
                                        </div>
                                        <div className="text-gray-500">empresas encontradas</div>
                                    </div>

                                    <div className="py-6 border-b border-gray-200">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Preço por contato</span>
                                            <span className="font-medium">{formatarMoeda(resultado.precoPorContato)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-100">
                                            <span className="text-gray-900">Total</span>
                                            <span className="text-blue-600">{formatarMoeda(resultado.precoTotal)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 space-y-3">
                                        <Link
                                            href={`/construtor/preview?${buildQueryString()}`}
                                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-5 h-5" />
                                            Ver Prévia (10 empresas)
                                        </Link>

                                        <button
                                            disabled={resultado.total === 0}
                                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            Comprar Lista
                                        </button>

                                        <div className="flex gap-2">
                                            <a
                                                href={resultado.total > 0 ? `/api/export/csv?preview=true&${buildQueryString()}` : '#'}
                                                download
                                                className={`flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 ${
                                                    resultado.total === 0 ? 'opacity-50 pointer-events-none' : ''
                                                }`}
                                            >
                                                <FileSpreadsheet className="w-4 h-4" />
                                                CSV
                                            </a>
                                            <a
                                                href={resultado.total > 0 ? `/api/export/pdf?preview=true&${buildQueryString()}` : '#'}
                                                target="_blank"
                                                className={`flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 ${
                                                    resultado.total === 0 ? 'opacity-50 pointer-events-none' : ''
                                                }`}
                                            >
                                                <FileText className="w-4 h-4" />
                                                PDF
                                            </a>
                                        </div>
                                    </div>

                                    {temFiltrosAtivos && (
                                        <button
                                            onClick={limparFiltros}
                                            className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Limpar todos os filtros
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>Use os filtros para encontrar empresas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}