'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Shield, Zap, Clock } from 'lucide-react';

const CTASection = () => {
  const benefits = [
    { icon: <Clock className="w-5 h-5" />, text: '14 dias grátis' },
    { icon: <Shield className="w-5 h-5" />, text: 'Sem necessidade de cartão' },
    { icon: <Zap className="w-5 h-5" />, text: 'Configuração em 5 minutos' },
    { icon: <CheckCircle className="w-5 h-5" />, text: 'Suporte 24/7' },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />

      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Pronto para transformar sua prospecção?
          </h2>

          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
            Junte-se a mais de 500 empresas que já aumentaram suas vendas com o EasyProspect.
            Comece agora sem compromisso.
          </p>

          {/* Benefícios */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
              >
                <div className="mb-3">{benefit.icon}</div>
                <span className="font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Principal */}
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center gap-3"
            >
              <span>Começar Agora Grátis</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Garantia */}
          <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Shield className="w-8 h-8" />
              <h3 className="text-xl font-bold">Garantia de Satisfação</h3>
            </div>
            <p className="opacity-90">
              Se em 14 dias você não estiver completamente satisfeito, devolvemos 100% do seu dinheiro.
              Sem perguntas, sem complicações.
            </p>
          </div>

          {/* Rodapé do CTA */}
          <p className="mt-8 text-sm opacity-80">
            Cancele a qualquer momento • Não requer cartão de crédito • Suporte em português
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;