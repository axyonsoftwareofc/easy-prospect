'use client';

import { motion } from 'framer-motion';
import { Search, Mail, MessageSquare, Users, BarChart, Zap } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    { icon: <Search />, title: 'Busca Inteligente', desc: 'Encontre leads ideais com filtros avançados' },
    { icon: <Mail />, title: 'Email em Massa', desc: 'Campanhas personalizadas automatizadas' },
    { icon: <MessageSquare />, title: 'WhatsApp Pro', desc: 'Envio em massa com templates' },
    { icon: <Users />, title: 'CRM Integrado', desc: 'Gerencie todos os contatos' },
    { icon: <BarChart />, title: 'Analytics', desc: 'Relatórios detalhados de performance' },
    { icon: <Zap />, title: 'Automação', desc: 'Workflows inteligentes' },
  ];

  return (
    <section id="recursos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Tudo que você precisa para </span>
            <span className="bg-gradient-primary bg-clip-text text-transparent">vender mais</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Recursos poderosos em uma plataforma intuitiva
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-primary text-white mb-6">
                {feat.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
              <p className="text-gray-600">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;