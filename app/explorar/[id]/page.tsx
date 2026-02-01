// app/explorar/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Download, ShoppingCart, CheckCircle, MapPin,
    Users, Mail, Phone, Globe, FileText, Star, Shield,
    Clock, Loader2, MessageCircle, Building2, Instagram,
    Linkedin, DollarSign, AlertCircle
} from 'lucide-react';
import { Lista, CAMPOS_DISPONIVEIS } from '@/types';

export default function DetalhesListaPage() {
    const params = useParams();
    const router = useRouter();
    const [lista, setLista] = useState<Lista | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLista();
    }, [params.id]);

    const fetchLista = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/listas/${params.id}`);
            const data = await response.json();

            if (data.success) {
                setLista(data.data);
            } else {
                setError(data.message || 'Lista não encontrada');
            }
        } catch (err) {
            setError('Erro ao carregar lista');
        } finally {
            setLoading(false);
        }
    };

    // Parse JSON fields
    const parseJSON = (jsonString: string): string[] => {
        try {
            return JSON.parse(jsonString);
        } catch {
            return [];
        }
    };

    // Formatar preço
    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco);
    };

    // Ícone do campo
    const getIconeCampo = (campoId: string) => {
        const icones: Record<string, React.ReactNode> = {
            email: <Mail className="w-5 h-5" />,
            telefone: <Phone className="w-5 h-5" />,
            whatsapp: <MessageCircle className="w-5 h-5" />,
            cnpj: <FileText className="w-5 h-5" />,
            responsavel: <Users className="w-5 h-5" />,
            endereco: <MapPin className="w-5 h-5" />,
            site: <Globe className="w-5 h-5" />,
            linkedin: <Linkedin className="w-5 h-5" />,
            instagram: <Instagram className="w-5 h-5" />,
            faturamento: <DollarSign className="w-5 h-5" />,
            funcionarios: <Building2 className="w-5 h-5" />,
        };
        return icones[campoId] || <FileText className="w-5 h-5" />;
    };

    // Nome do campo
    const getNomeCampo = (campoId: string) => {
        const campo = CAMPOS_DISPONIVEIS.find(c => c.id === campoId);
        return campo?.nome || campoId;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !lista) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Lista não encontrada</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        href="/explorar"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                        Voltar para Explorar
                    </Link>
                </div>
            </div>
        );
    }

    const segmentos = parseJSON(lista.segmentos);
    const regioes = parseJSON(lista.regioes);
    const paises = parseJSON(lista.paises);
    const campos = parseJSON(lista.camposInclusos);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link
                        href="/explorar"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Explorar
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Conteúdo principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {lista.destaque && (
                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-4">
                  <Star className="w-4 h-4 fill-current" />
                  Lista em Destaque
                </span>
                            )}

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {lista.nome}
                            </h1>

                            <p className="text-lg text-gray-600 mb-6">
                                {lista.descricao}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {segmentos.map((seg, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                    >
                    {seg}
                  </span>
                                ))}
                                {paises.map((pais, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center gap-1"
                                    >
                    <MapPin className="w-3 h-3" />
                                        {pais}
                  </span>
                                ))}
                            </div>
                        </div>

                        {/* Estatísticas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {lista.quantidade.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">Contatos</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                <div className="text-3xl font-bold text-green-600">
                                    {lista.taxaValidacao}%
                                </div>
                                <div className="text-sm text-gray-500">Validados</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                <div className="text-3xl font-bold text-blue-600">
                                    {campos.length}
                                </div>
                                <div className="text-sm text-gray-500">Campos</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                <div className="text-3xl font-bold text-purple-600">
                                    {paises.length}
                                </div>
                                <div className="text-sm text-gray-500">Países</div>
                            </div>
                        </div>

                        {/* Campos inclusos */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Campos Inclusos
                            </h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                {campos.map((campo, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            {getIconeCampo(campo)}
                                        </div>
                                        <span className="font-medium text-gray-900">
                      {getNomeCampo(campo)}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cobertura geográfica */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Cobertura Geográfica
                            </h2>

                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Regiões</h3>
                                <div className="flex flex-wrap gap-2">
                                    {regioes.map((regiao, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                                        >
                      {regiao}
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Países</h3>
                                <div className="flex flex-wrap gap-2">
                                    {paises.map((pais, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-1"
                                        >
                      <MapPin className="w-3 h-3" />
                                            {pais}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Garantias */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Garantias
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Dados Validados</h3>
                                        <p className="text-sm text-gray-600">
                                            {lista.taxaValidacao}% dos emails foram verificados
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Dados Atualizados</h3>
                                        <p className="text-sm text-gray-600">
                                            Última atualização: {new Date(lista.updatedAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <Download className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Download Imediato</h3>
                                        <p className="text-sm text-gray-600">
                                            Receba em Excel/CSV após o pagamento
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Garantia de 7 dias</h3>
                                        <p className="text-sm text-gray-600">
                                            Devolução se não estiver satisfeito
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Card de compra */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            {/* Preço */}
                            <div className="mb-6">
                                {lista.precoDesconto ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatarPreco(lista.precoDesconto)}
                      </span>
                                            <span className="text-lg text-gray-400 line-through">
                        {formatarPreco(lista.preco)}
                      </span>
                                        </div>
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                      Economia de {formatarPreco(lista.preco - lista.precoDesconto)}
                    </span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-bold text-gray-900">
                    {formatarPreco(lista.preco)}
                  </span>
                                )}
                                <p className="text-sm text-gray-500 mt-2">
                                    {(lista.preco / lista.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por contato
                                </p>
                            </div>

                            {/* Resumo */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Contatos</span>
                                    <span className="font-medium">{lista.quantidade.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Taxa de validação</span>
                                    <span className="font-medium text-green-600">{lista.taxaValidacao}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Campos</span>
                                    <span className="font-medium">{campos.length} campos</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Formato</span>
                                    <span className="font-medium">Excel / CSV</span>
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="space-y-3">
                                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Comprar Agora
                                </button>

                                {lista.amostraUrl && (
                                    <button className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                        <Download className="w-5 h-5" />
                                        Baixar Amostra Grátis
                                    </button>
                                )}
                            </div>

                            {/* Segurança */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Shield className="w-4 h-4" />
                                    <span>Pagamento 100% seguro</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}