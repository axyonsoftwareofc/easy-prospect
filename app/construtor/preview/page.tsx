// app/construtor/preview/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Download, FileSpreadsheet, FileText, Eye,
    EyeOff, Mail, Phone, Globe, MapPin, Building2, Lock,
    Loader2, ShoppingCart, AlertCircle, CheckCircle, Sparkles
} from 'lucide-react';
import { Empresa } from '@/types';

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [precoTotal, setPrecoTotal] = useState(0);
    const [precoPorContato, setPrecoPorContato] = useState(0);

    // Campos a exibir
    const [camposVisiveis, setCamposVisiveis] = useState({
        nome: true,
        email: true,
        telefone: true,
        whatsapp: true,
        cidade: true,
        estado: true,
        setor: true,
        responsavel: true,
    });

    useEffect(() => {
        fetchPreview();
    }, [searchParams]);

    const fetchPreview = async () => {
        try {
            setLoading(true);

            // Construir query string a partir dos params
            const params = new URLSearchParams(searchParams.toString());
            params.set('limite', '10'); // Apenas 10 para preview
            params.set('pagina', '1');

            const response = await fetch(`/api/empresas?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setEmpresas(data.data);
                setTotal(data.total);
                setPrecoTotal(data.precoTotal);
                setPrecoPorContato(data.precoPorContato);
            }
        } catch (error) {
            console.error('Erro ao buscar preview:', error);
        } finally {
            setLoading(false);
        }
    };

    // Formatar moeda
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    // Ocultar parte do dado (para preview)
    const ocultarDado = (dado: string | null, tipo: 'email' | 'telefone' | 'texto') => {
        if (!dado) return '-';

        if (tipo === 'email') {
            const [user, domain] = dado.split('@');
            if (!domain) return dado;
            return `${user.substring(0, 2)}***@${domain}`;
        }

        if (tipo === 'telefone') {
            return dado.substring(0, 6) + '***-****';
        }

        return dado.substring(0, 3) + '***';
    };

    // Descrição dos filtros ativos
    const getDescricaoFiltros = () => {
        const filtros: string[] = [];

        const continentes = searchParams.get('continentes');
        const paises = searchParams.get('paises');
        const estados = searchParams.get('estados');
        const setores = searchParams.get('setores');

        if (continentes) filtros.push(`Continentes: ${continentes}`);
        if (paises) filtros.push(`Países: ${paises}`);
        if (estados) filtros.push(`Estados: ${estados}`);
        if (setores) filtros.push(`Setores: ${setores}`);

        if (searchParams.get('isImportador') === 'true') filtros.push('Importadores');
        if (searchParams.get('isExportador') === 'true') filtros.push('Exportadores');
        if (searchParams.get('isDistribuidor') === 'true') filtros.push('Distribuidores');
        if (searchParams.get('isFabricante') === 'true') filtros.push('Fabricantes');
        if (searchParams.get('isVarejo') === 'true') filtros.push('Varejo');

        return filtros;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Carregando preview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <Link
                        href={`/construtor?${searchParams.toString()}`}
                        className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Construtor
                    </Link>

                    <div className="flex items-center gap-3 mb-2">
                        <Eye className="w-8 h-8" />
                        <h1 className="text-3xl font-bold">Preview da Lista</h1>
                    </div>
                    <p className="text-blue-100">
                        Visualizando 10 de {total.toLocaleString()} empresas encontradas
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filtros aplicados */}
                {getDescricaoFiltros().length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Filtros aplicados:</h3>
                        <div className="flex flex-wrap gap-2">
                            {getDescricaoFiltros().map((filtro, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                >
                  {filtro}
                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Tabela de Preview */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">
                                    Amostra de {empresas.length} empresas
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-amber-600">
                                    <Lock className="w-4 h-4" />
                                    <span>Dados parcialmente ocultos</span>
                                </div>
                            </div>

                            {empresas.length === 0 ? (
                                <div className="p-12 text-center">
                                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Nenhuma empresa encontrada com esses filtros</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Empresa
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Contato
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Localização
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Setor
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Tipo
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        {empresas.map((empresa, index) => (
                                            <tr key={empresa.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {empresa.nome}
                                                        </p>
                                                        {empresa.nomeFantasia && (
                                                            <p className="text-sm text-gray-500">
                                                                {empresa.nomeFantasia}
                                                            </p>
                                                        )}
                                                        {empresa.responsavel && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {ocultarDado(empresa.responsavel, 'texto')}
                                                                {empresa.cargo && ` - ${empresa.cargo}`}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="space-y-1">
                                                        {empresa.email && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Mail className="w-3 h-3 text-gray-400" />
                                                                <span className="text-gray-600">
                                    {ocultarDado(empresa.email, 'email')}
                                  </span>
                                                            </div>
                                                        )}
                                                        {empresa.telefone && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Phone className="w-3 h-3 text-gray-400" />
                                                                <span className="text-gray-600">
                                    {ocultarDado(empresa.telefone, 'telefone')}
                                  </span>
                                                            </div>
                                                        )}
                                                        {empresa.site && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Globe className="w-3 h-3 text-gray-400" />
                                                                <span className="text-gray-600">
                                    {ocultarDado(empresa.site, 'texto')}
                                  </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm text-gray-900">
                                                                {empresa.cidade || '-'}{empresa.estado ? `, ${empresa.estado}` : ''}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {empresa.pais}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                            <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              {empresa.setor}
                            </span>
                                                    {empresa.subsetor && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {empresa.subsetor}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {empresa.isImportador && (
                                                            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                                  Imp
                                </span>
                                                        )}
                                                        {empresa.isExportador && (
                                                            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                                  Exp
                                </span>
                                                        )}
                                                        {empresa.isDistribuidor && (
                                                            <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
                                  Dist
                                </span>
                                                        )}
                                                        {empresa.isFabricante && (
                                                            <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-xs">
                                  Fab
                                </span>
                                                        )}
                                                        {empresa.isVarejo && (
                                                            <span className="px-1.5 py-0.5 bg-cyan-50 text-cyan-700 rounded text-xs">
                                  Var
                                </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Aviso de dados ocultos */}
                            <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
                                <div className="flex items-start gap-3">
                                    <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-800">
                                            Dados parcialmente ocultos
                                        </p>
                                        <p className="text-sm text-amber-700">
                                            Compre a lista completa para acessar todos os dados de contato das {total.toLocaleString()} empresas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Resumo da compra */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                            <h3 className="font-bold text-gray-900 mb-4">Resumo da Lista</h3>

                            {/* Estatísticas */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total de empresas</span>
                                    <span className="font-bold text-gray-900">{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Preço por contato</span>
                                    <span className="font-medium">{formatarMoeda(precoPorContato)}</span>
                                </div>
                            </div>

                            {/* Preço total */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-900 font-medium">Total</span>
                                    <span className="text-2xl font-bold text-blue-600">
                    {formatarMoeda(precoTotal)}
                  </span>
                                </div>
                            </div>

                            {/* Campos inclusos */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Dados inclusos:</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        'Nome', 'Email', 'Telefone', 'WhatsApp',
                                        'Endereço', 'CNPJ', 'Responsável', 'Site'
                                    ].map((campo) => (
                                        <div key={campo} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            {campo}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="space-y-3">
                                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Comprar Lista Completa
                                </button>

                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href={`/api/export/csv?${searchParams.toString()}`}
                                        className="py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        CSV
                                    </Link>
                                    <Link
                                        href={`/api/export/pdf?${searchParams.toString()}`}
                                        className="py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        PDF
                                    </Link>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">
                                            Plano Gratuito
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            Você tem 10 créditos disponíveis.
                                            <Link href="/#precos" className="underline ml-1">
                                                Fazer upgrade
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}