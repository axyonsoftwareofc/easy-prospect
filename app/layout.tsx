// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'EasyProspect - Transforme Leads em Clientes Fiéis',
    description: 'A plataforma completa de prospecção que automatiza seu funil de vendas.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" className="scroll-smooth">
        <body className={`${inter.className} bg-white text-gray-900`}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}