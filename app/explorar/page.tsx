// app/explorar/page.tsx

'use client';

import { useState, useEffect } from 'react';
import {
    Search, Filter, Package, MapPin, Globe, Users,
    CheckCircle, Download, Star, X, ChevronDown,
    Loader2, ShoppingCart, Eye
} from 'lucide-react';
import Link from 'next/link';
import { Lista, SEGMENTOS, REGIOES, PAISES } from '@/types';

export default function ExplorarPage() {
    const [listas, setListas] = useState<Lista[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);

    // Estados dos filtros
    const [busca, setBusca] = useState('');
    const [segmentoSelecionado, setSegmentoSelecionado] = useState('');
    const [regiaoSelecionada, setRegiaoSelecionada] = useState('');
    const [paisSelecionado, setPaisSelecionado] = useState('');
    const [ordenacao, setOrdenacao] = useState('destaque');

    // Buscar listas
    useEffect(() => {
        fetchListas();
    }, [segmentoSelecionado, regiaoSelecionada, paisSelecionado]);

    const fetchListas = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();
            if (segmentoSelecionado) params.append('segmento', segmentoSelecionado);
            if (regiaoSelecionada) params.append('regiao', regiaoSelecionada);
            if (paisSelecionado) params.append('pais', paisSelecionado);

            const response = await fetch(`/api/listas?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setListas(data.data);
            }
        } catch (error) {
            console.error('Erro ao buscar listas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar por busca local
    const listasFiltradas = listas.filter(lista => {
        if (!busca) return true;
        const termoBusca = busca.toLowerCase();
        return (
            lista.nome.toLowerCase().includes(termoBusca) ||
            lista.descricao?.toLowerCase().includes(termoBusca)
        );
    });

    // Ordenar
    const listasOrdenadas = [...listasFiltradas].sort((a, b) => {
        switch (ordenacao) {
            case 'preco-menor':
                return a.preco - b.preco;
            case 'preco-maior':
                return b.preco - a.preco;
            case 'quantidade':
                return b.quantidade - a.quantidade;
            case 'validacao':
                return b.taxaValidacao - a.taxaValidacao;
            default: // destaque
                return (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0);
        }
    });

    // Limpar filtros
    const limparFiltros = () => {
        setBusca('');
        setSegmentoSelecionado('');
        setRegiaoSelecionada('');
        setPaisSelecionado('');
    };

    const temFiltrosAtivos = busca || segmentoSelecionado || regiaoSelecionada || paisSelecionado;

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header da página */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Explorar Listas de Contatos
                    </h1>
                    <p className="text-xl opacity-90 mb-8">
                        Encontre a lista perfeita para sua prospecção
                    </p>

                    {/* Barra de busca */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, segmento ou região..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar de Filtros - Desktop */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filtros
                                </h2>
                                {temFiltrosAtivos && (
                                    <button
                                        onClick={limparFiltros}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Limpar
                                    </button>
                                )}
                            </div>

                            {/* Filtro por Segmento */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Segmento
                                </label>
                                <select
                                    value={segmentoSelecionado}
                                    onChange={(e) => setSegmentoSelecionado(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Todos os segmentos</option>
                                    {SEGMENTOS.map(seg => (
                                        <option key={seg} value={seg}>{seg}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por Região */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Região
                                </label>
                                <select
                                    value={regiaoSelecionada}
                                    onChange={(e) => setRegiaoSelecionada(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Todas as regiões</option>
                                    {REGIOES.map(reg => (
                                        <option key={reg} value={reg}>{reg}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por País */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    País
                                </label>
                                <select
                                    value={paisSelecionado}
                                    onChange={(e) => setPaisSelecionado(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Todos os países</option>
                                    {PAISES.map(pais => (
                                        <option key={pais.codigo} value={pais.nome}>{pais.nome}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Estatísticas */}
                            <div className="pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    <span className="font-bold text-gray-900">{listasOrdenadas.length}</span> listas encontradas
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Botão de filtros mobile */}
                    <button
                        onClick={() => setFiltrosAbertos(true)}
                        className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700"
                    >
                        <Filter className="w-5 h-5" />
                        Filtros
                        {temFiltrosAtivos && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                Ativos
              </span>
                        )}
                    </button>

                    {/* Modal de filtros mobile */}
                    {filtrosAbertos && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="fixed inset-0 bg-black/50" onClick={() => setFiltrosAbertos(false)} />
                            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-bold text-lg">Filtros</h2>
                                    <button onClick={() => setFiltrosAbertos(false)}>
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Filtros mobile */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Segmento</label>
                                        <select
                                            value={segmentoSelecionado}
                                            onChange={(e) => setSegmentoSelecionado(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Todos os segmentos</option>
                                            {SEGMENTOS.map(seg => (
                                                <option key={seg} value={seg}>{seg}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Região</label>
                                        <select
                                            value={regiaoSelecionada}
                                            onChange={(e) => setRegiaoSelecionada(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Todas as regiões</option>
                                            {REGIOES.map(reg => (
                                                <option key={reg} value={reg}>{reg}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                                        <select
                                            value={paisSelecionado}
                                            onChange={(e) => setPaisSelecionado(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Todos os países</option>
                                            {PAISES.map(pais => (
                                                <option key={pais.codigo} value={pais.nome}>{pais.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={limparFiltros}
                                        className="flex-1 py-3 border border-gray-300 rounded-xl font-medium"
                                    >
                                        Limpar
                                    </button>
                                    <button
                                        onClick={() => setFiltrosAbertos(false)}
                                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium"
                                    >
                                        Ver {listasOrdenadas.length} resultados
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lista de Resultados */}
                    <main className="flex-1">
                        {/* Barra de ordenação */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                <span className="font-semibold text-gray-900">{listasOrdenadas.length}</span> listas encontradas
                            </p>
                            <select
                                value={ordenacao}
                                onChange={(e) => setOrdenacao(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="destaque">Destaques primeiro</option>
                                <option value="preco-menor">Menor preço</option>
                                <option value="preco-maior">Maior preço</option>
                                <option value="quantidade">Mais contatos</option>
                                <option value="validacao">Maior validação</option>
                            </select>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : listasOrdenadas.length === 0 ? (
                            /* Empty state */
                            <div className="text-center py-20">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Nenhuma lista encontrada
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Tente ajustar os filtros para encontrar o que procura
                                </p>
                                <button
                                    onClick={limparFiltros}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        ) : (
                            /* Grid de listas */
                            <div className="grid md:grid-cols-2 gap-6">
                                {listasOrdenadas.map((lista) => {
                                    const segmentos = parseJSON(lista.segmentos);
                                    const paises = parseJSON(lista.paises);
                                    const campos = parseJSON(lista.camposInclusos);

                                    return (
                                        <div
                                            key={lista.id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            {/* Header do card */}
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        {lista.destaque && (
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full mb-2">
                                <Star className="w-3 h-3 fill-current" />
                                Destaque
                              </span>
                                                        )}
                                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                            {lista.nome}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {lista.descricao}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {segmentos.slice(0, 2).map((seg, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                                                        >
                              {seg}
                            </span>
                                                    ))}
                                                    {paises.slice(0, 2).map((pais, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full flex items-center gap-1"
                                                        >
                              <MapPin className="w-3 h-3" />
                                                            {pais}
                            </span>
                                                    ))}
                                                    {paises.length > 2 && (
                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              +{paises.length - 2}
                            </span>
                                                    )}
                                                </div>

                                                {/* Métricas */}
                                                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100">
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-gray-900">
                                                            {lista.quantidade.toLocaleString()}
                                                        </div>
                                                        <div className="text-xs text-gray-500">contatos</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-green-600">
                                                            {lista.taxaValidacao}%
                                                        </div>
                                                        <div className="text-xs text-gray-500">validados</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-gray-900">
                                                            {campos.length}
                                                        </div>
                                                        <div className="text-xs text-gray-500">campos</div>
                                                    </div>
                                                </div>

                                                {/* Campos inclusos */}
                                                <div className="mt-4">
                                                    <p className="text-xs text-gray-500 mb-2">Campos inclusos:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {campos.slice(0, 4).map((campo, i) => (
                                                            <span
                                                                key={i}
                                                                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                                                            >
                                {campo}
                              </span>
                                                        ))}
                                                        {campos.length > 4 && (
                                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                +{campos.length - 4}
                              </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer do card */}
                                            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                                                <div>
                                                    {lista.precoDesconto ? (
                                                        <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-gray-900">
                                {formatarPreco(lista.precoDesconto)}
                              </span>
                                                            <span className="text-sm text-gray-400 line-through">
                                {formatarPreco(lista.preco)}
                              </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-2xl font-bold text-gray-900">
                              {formatarPreco(lista.preco)}
                            </span>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/explorar/${lista.id}`}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Detalhes
                                                    </Link>
                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                                        <ShoppingCart className="w-4 h-4" />
                                                        Comprar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}