'use client';

import { motion } from 'framer-motion';

export default function SimpleHero() {
  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '100px',
      backgroundColor: '#f9fafb',
      padding: '40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Teste 1: Cores sólidas */}
        <div style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>
            Teste de Cor Sólida (Azul)
          </h1>
          <p>Se isso aparecer azul, o Tailwind básico funciona.</p>
        </div>

        {/* Teste 2: Gradiente inline */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>
            Teste de Gradiente Inline
          </h1>
          <p>Se isso aparecer com gradiente, o problema é no Tailwind.</p>
        </div>

        {/* Teste 3: Texto com gradiente */}
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          Transforme Leads em Clientes
        </h1>

        {/* Teste 4: Botão com Tailwind classes */}
        <button className="px-8 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors">
          Botão com Tailwind (se azul, funciona)
        </button>

        {/* Teste 5: Botão inline style */}
        <button style={{
          marginLeft: '20px',
          padding: '16px 32px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: 'white',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '18px',
          border: 'none',
          cursor: 'pointer'
        }}>
          Botão com Style Inline
        </button>

      </div>
    </div>
  );
}