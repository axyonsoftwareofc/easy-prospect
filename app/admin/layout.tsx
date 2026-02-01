// app/admin/layout.tsx

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
    Sparkles, LayoutDashboard, Package, Users,
    ShoppingCart, Settings, LogOut, Menu, X,
    FileSpreadsheet, BarChart3
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sidebarAberta, setSidebarAberta] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const menuItems = [
        { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/listas', icon: Package, label: 'Listas' },
        { href: '/admin/listas/nova', icon: FileSpreadsheet, label: 'Nova Lista' },
        { href: '/admin/vendas', icon: ShoppingCart, label: 'Vendas' },
        { href: '/admin/clientes', icon: Users, label: 'Clientes' },
        { href: '/admin/relatorios', icon: BarChart3, label: 'Relatórios' },
        { href: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-gray-900 pt-5 pb-4 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0 px-4 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">EasyProspect</h1>
                            <p className="text-gray-400 text-xs">Painel Admin</p>
                        </div>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 px-2 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Usuário */}
                    <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
                        <div className="flex items-center w-full">
                            <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-gray-300" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-white truncate">
                                    {session.user?.name || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {session.user?.email}
                                </p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                title="Sair"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Header Mobile */}
            <div className="lg:hidden bg-gray-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-2">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold">EasyProspect</span>
                </div>
                <button onClick={() => setSidebarAberta(!sidebarAberta)}>
                    {sidebarAberta ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Mobile */}
            {sidebarAberta && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarAberta(false)} />
                    <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 p-4">
                        <nav className="space-y-1 mt-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarAberta(false)}
                                    className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Conteúdo */}
            <div className="lg:pl-64">
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}