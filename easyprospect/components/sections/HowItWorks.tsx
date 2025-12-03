'use client';

import { motion } from 'framer-motion';
import { Target, Filter, Send, Users, TrendingUp, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: <Target className="w-8 h-8" />,
      title: 'Defina seu público-alvo',
      description: 'Selecione empresas por segmento, tamanho, localização e outros critérios.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      icon: <Filter className="w-8 h-8" />,
      title: 'Filtre e qualifique leads',
      description: 'Nossa IA classifica automaticamente os leads mais promissores para você.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '03',
      icon: <Send className="w-8 h-8" />,
      title: 'Automatize os contatos',
      description: 'Envie emails e mensagens com sequências personalizadas e agendamento.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      number: '04',
      icon: <Users className="w-8 h-8" />,
      title: 'Gerencie relacionamentos',
      description: 'Acompanhe todas as interações e negociações no CRM integrado.',
      color: 'from-orange-500 to-red-500',
    },
    {
      number: '05',
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Analise e otimize',
      description: 'Dashboard com métricas de conversão, ROI e sugestões de melhoria.',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Como funciona em{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              5 passos simples
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            De lead a cliente em um fluxo contínuo e automatizado
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Linha de conexão */}
          <div className="hidden lg:block absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transform -translate-y-1/2" />

          <div className="grid lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Número do passo */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-gray-50 flex items-center justify-center text-2xl font-bold text-gray-700 z-10">
                  {step.number}
                </div>

                {/* Card */}
                <div className="pt-10 pb-8 px-6 bg-white rounded-2xl shadow-lg border border-gray-100 text-center h-full">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${step.color} mb-6`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm mb-6">{step.description}</p>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Passo {step.number.slice(1)} de 5</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: '85%', label: 'Redução de tempo' },
            { value: '3x', label: 'Mais conversões' },
            { value: '40h', label: 'Economia mensal' },
            { value: '99%', label: 'Satisfação' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;