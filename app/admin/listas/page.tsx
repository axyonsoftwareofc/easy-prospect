// app/admin/listas/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus, Search, Edit, Trash2, Eye, Download,
    MoreVertical, Star, StarOff, Loader2, Package
} from 'lucide-react';
import { Lista } from '@/types';

export default function AdminListasPage() {
    const [listas, setListas] = useState<Lista[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [menuAberto, setMenuAberto] = useState<string | null>(null);

    useEffect(() => {
        fetchListas();
    }, []);

    const fetchListas = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/listas');
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

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta lista?')) return;

        try {
            const response = await fetch(`/api/listas/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setListas(listas.filter(l => l.id !== id));
            }
        } catch (error) {
            console.error('Erro ao excluir lista:', error);
        }
    };

    const toggleDestaque = async (lista: Lista) => {
        try {
            const response = await fetch(`/api/listas/${lista.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destaque: !lista.destaque }),
            });
            const data = await response.json();
            if (data.success) {
                setListas(listas.map(l =>
                    l.id === lista.id ? { ...l, destaque: !l.destaque } : l
                ));
            }
        } catch (error) {
            console.error('Erro ao atualizar destaque:', error);
        }
    };

    const parseJSON = (jsonString: string): string[] => {
        try {
            return JSON.parse(jsonString);
        } catch {
            return [];
        }
    };

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco);
    };

    const listasFiltradas = listas.filter(lista => {
        if (!busca) return true;
        return lista.nome.toLowerCase().includes(busca.toLowerCase());
    });

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Listas de Contatos</h1>
                    <p className="text-gray-600">Gerencie suas listas disponíveis para venda</p>
                </div>
                <Link
                    href="/admin/listas/nova"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nova Lista
                </Link>
            </div>

            {/* Busca */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar lista..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Lista */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : listasFiltradas.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhuma lista encontrada
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Comece criando sua primeira lista de contatos
                    </p>
                    <Link
                        href="/admin/listas/nova"
                        className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5" />
                        Criar Lista
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Lista</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Segmentos</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Contatos</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Preço</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {listasFiltradas.map((lista) => {
                                const segmentos = parseJSON(lista.segmentos);

                                return (
                                    <tr key={lista.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {lista.destaque && (
                                                    <Star className="w-5 h-5 text-amber-500 fill-current flex-shrink-0" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">{lista.nome}</p>
                                                    <p className="text-sm text-gray-500 line-clamp-1">
                                                        {lista.descricao}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-1">
                                                {segmentos.slice(0, 2).map((seg, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                                                    >
                              {seg}
                            </span>
                                                ))}
                                                {segmentos.length > 2 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{segmentos.length - 2}
                            </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">
                          {lista.quantidade.toLocaleString()}
                        </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                          <span className="font-medium text-gray-900">
                            {formatarPreco(lista.precoDesconto || lista.preco)}
                          </span>
                                                {lista.precoDesconto && (
                                                    <span className="ml-2 text-sm text-gray-400 line-through">
                              {formatarPreco(lista.preco)}
                            </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            lista.ativo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}>
                          {lista.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/explorar/${lista.id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/listas/${lista.id}/editar`}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => toggleDestaque(lista)}
                                                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title={lista.destaque ? 'Remover destaque' : 'Destacar'}
                                                >
                                                    {lista.destaque ? (
                                                        <StarOff className="w-4 h-4" />
                                                    ) : (
                                                        <Star className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lista.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}