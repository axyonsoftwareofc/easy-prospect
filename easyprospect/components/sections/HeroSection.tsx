'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BarChart3, Users, Zap, Play, Check } from 'lucide-react';

export default function HeroSection() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Análise Preditiva',
      description: 'Identifique leads qualificados com IA',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Gestão Inteligente',
      description: 'Organize seu pipeline automaticamente',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Automação Total',
      description: 'Sequências personalizadas de contato',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '80px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Elementos de fundo */}
      <div style={{
        position: 'absolute',
        top: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: 0.6
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-200px',
        left: '-200px',
        width: '600px',
        height: '600px',
        background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: 0.4
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 10
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '9999px',
            marginBottom: '32px'
          }}
        >
          <Sparkles style={{ width: '16px', height: '16px' }} />
          <span style={{ fontSize: '14px', fontWeight: '600' }}>
            PLATAFORMA DE PROSPECÇÃO #1
          </span>
        </motion.div>

        {/* Título Principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 'bold',
            lineHeight: 1.1,
            marginBottom: '24px'
          }}>
            <span style={{ display: 'block', color: '#1f2937' }}>Transforme</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Leads em Clientes
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(20px, 2.5vw, 24px)',
            color: '#4b5563',
            maxWidth: '800px',
            lineHeight: 1.6
          }}>
            A solução completa para <span style={{ fontWeight: '600', color: '#3b82f6' }}>automatizar sua prospecção</span>,
            qualificar leads com inteligência artificial e <span style={{ fontWeight: '600', color: '#8b5cf6' }}>multiplicar suas vendas</span>.
          </p>
        </motion.div>

        {/* Botões CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '64px'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '18px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
              }}
            >
              <span>Começar Agora - 14 Dias Grátis</span>
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '16px 32px',
                backgroundColor: 'white',
                color: '#1f2937',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '18px',
                border: '2px solid #e5e7eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Play style={{ width: '20px', height: '20px' }} />
              <span>Ver Vídeo Demonstração</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '32px',
            marginBottom: '64px'
          }}
        >
          {[
            { value: '500+', label: 'Empresas' },
            { value: '98%', label: 'Satisfação' },
            { value: '3x', label: 'Mais Leads' },
            { value: '24/7', label: 'Suporte' },
          ].map((stat, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px'
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#6b7280', fontWeight: '500' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recursos */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '64px'
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -10 }}
              style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f3f4f6'
              }}
            >
              <div style={{
                display: 'inline-flex',
                padding: '16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                marginBottom: '24px'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                {feature.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                <Check style={{ width: '16px', height: '16px', color: '#10b981', marginRight: '8px' }} />
                <span style={{ fontSize: '14px' }}>Incluído em todos os planos</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}