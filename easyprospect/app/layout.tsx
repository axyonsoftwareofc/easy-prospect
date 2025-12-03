import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// DESCOMENTE AGORA:
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EasyProspect - Transforme Leads em Clientes Fiéis',
  description: 'A plataforma completa de prospecção que automatiza seu funil de vendas, qualifica leads com inteligência artificial e aumenta suas conversões.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-gray-900`}>
        {/* DESCOMENTE: */}
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}