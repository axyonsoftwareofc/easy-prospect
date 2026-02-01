// app/admin/page.tsx

'use client';

import { useState, useEffect } from 'react';
import {
    Package, ShoppingCart, Users, DollarSign,
    TrendingUp, ArrowUpRight, ArrowDownRight,
    Eye, Download
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalListas: number;
    totalVendas: number;
    receitaTotal: number;
    clientesAtivos: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalListas: 0,
        totalVendas: 0,
        receitaTotal: 0,
        clientesAtivos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Buscar listas
            const listasRes = await fetch('/api/listas');
            const listasData = await listasRes.json();

            setStats({
                totalListas: listasData.count || 0,
                totalVendas: 127, // Mock por enquanto
                receitaTotal: 45890, // Mock
                clientesAtivos: 89, // Mock
            });
        } catch (error) {
            console.error('Erro ao buscar stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const cards = [
        {
            title: 'Total de Listas',
            value: stats.totalListas,
            icon: Package,
            color: 'blue',
            change: '+12%',
            positive: true,
        },
        {
            title: 'Vendas do Mês',
            value: stats.totalVendas,
            icon: ShoppingCart,
            color: 'green',
            change: '+8%',
            positive: true,
        },
        {
            title: 'Receita Total',
            value: formatarMoeda(stats.receitaTotal),
            icon: DollarSign,
            color: 'purple',
            change: '+23%',
            positive: true,
        },
        {
            title: 'Clientes Ativos',
            value: stats.clientesAtivos,
            icon: Users,
            color: 'orange',
            change: '+5%',
            positive: true,
        },
    ];

    const cores: Record<string, string> = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
    };

    const coresBg: Record<string, string> = {
        blue: 'bg-blue-50',
        green: 'bg-green-50',
        purple: 'bg-purple-50',
        orange: 'bg-orange-50',
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Visão geral do seu negócio</p>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${coresBg[card.color]}`}>
                                <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                            </div>
                            <div className={`flex items-center text-sm font-medium ${
                                card.positive ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {card.positive ? (
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 mr-1" />
                                )}
                                {card.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            <p className="text-sm text-gray-500">{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ações rápidas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Link
                    href="/admin/listas/nova"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                    <Package className="w-8 h-8 mb-3" />
                    <h3 className="font-bold text-lg mb-1">Nova Lista</h3>
                    <p className="text-blue-100 text-sm">
                        Faça upload de uma nova lista de contatos
                    </p>
                </Link>

                <Link
                    href="/admin/listas"
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                    <Eye className="w-8 h-8 mb-3 text-gray-600" />
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Ver Listas</h3>
                    <p className="text-gray-500 text-sm">
                        Gerencie suas listas de contatos
                    </p>
                </Link>

                <Link
                    href="/admin/vendas"
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all"
                >
                    <TrendingUp className="w-8 h-8 mb-3 text-gray-600" />
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Ver Vendas</h3>
                    <p className="text-gray-500 text-sm">
                        Acompanhe todas as vendas realizadas
                    </p>
                </Link>
            </div>

            {/* Vendas recentes (mock) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Vendas Recentes</h2>
                    <Link href="/admin/vendas" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Ver todas
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cliente</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Lista</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Valor</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Data</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[
                            { cliente: 'João Silva', lista: 'Alimentos - Brasil', valor: 299, status: 'pago', data: '15/01/2025' },
                            { cliente: 'Maria Santos', lista: 'Brinquedos - LATAM', valor: 199, status: 'pago', data: '14/01/2025' },
                            { cliente: 'Carlos Lima', lista: 'Pet Shops - Brasil', valor: 399, status: 'pendente', data: '14/01/2025' },
                            { cliente: 'Ana Costa', lista: 'Tecnologia - Brasil', valor: 399, status: 'pago', data: '13/01/2025' },
                        ].map((venda, i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-900">{venda.cliente}</td>
                                <td className="py-3 px-4 text-gray-600">{venda.lista}</td>
                                <td className="py-3 px-4 font-medium text-gray-900">
                                    {formatarMoeda(venda.valor)}
                                </td>
                                <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        venda.status === 'pago'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {venda.status === 'pago' ? 'Pago' : 'Pendente'}
                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-500">{venda.data}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}