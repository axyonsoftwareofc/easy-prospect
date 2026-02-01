// app/construtor/layout.tsx

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function ConstrutorLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl">EasyProspect</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/construtor" className="text-blue-600 font-medium">
                                Construtor
                            </Link>
                            <Link href="/explorar" className="text-gray-600 hover:text-gray-900 font-medium">
                                Listas Prontas
                            </Link>
                            <Link href="/#precos" className="text-gray-600 hover:text-gray-900 font-medium">
                                Preços
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                                Entrar
                            </Link>
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90"
                            >
                                Começar Grátis
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {children}
        </div>
    );
}