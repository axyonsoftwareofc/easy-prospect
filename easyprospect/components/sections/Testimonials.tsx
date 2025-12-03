'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Diretor Comercial',
      company: 'TechCorp',
      content: 'O EasyProspect revolucionou nossa prospecção. Em 3 meses, aumentamos as vendas em 300% e reduzimos o tempo de prospecção em 80%. A plataforma é intuitiva e os resultados são extraordinários.',
      rating: 5,
      avatarColor: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Ana Santos',
      role: 'CEO & Founder',
      company: 'StartupXYZ',
      content: 'Como startup, precisávamos de uma solução eficiente e acessível. O EasyProspect não só automatizou nossa prospecção como nos poupou 20 horas semanais de trabalho manual. Melhor investimento do ano!',
      rating: 5,
      avatarColor: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Roberto Lima',
      role: 'Head de Vendas',
      company: 'Growth Inc',
      content: 'Já testei várias plataformas de prospecção, mas nenhuma se compara ao EasyProspect. A segmentação de leads é precisa, a automação funciona perfeitamente e o suporte é excepcional.',
      rating: 5,
      avatarColor: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Mariana Costa',
      role: 'Gerente de Marketing',
      company: 'Digital Solutions',
      content: 'A integração com nosso CRM foi perfeita. Agora temos um fluxo contínuo de leads qualificados. O dashboard de analytics nos permite tomar decisões baseadas em dados reais.',
      rating: 5,
      avatarColor: 'from-orange-500 to-red-500',
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            O que nossos{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              clientes dizem
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empresas que transformaram seus resultados com o EasyProspect
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            <Quote className="w-12 h-12 text-gray-200 mb-8" />

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              "{testimonials[currentIndex].content}"
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100">
              <div className="flex items-center mb-6 md:mb-0">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${testimonials[currentIndex].avatarColor} mr-6`} />
                <div>
                  <div className="font-bold text-lg">{testimonials[currentIndex].name}</div>
                  <div className="text-gray-600">
                    {testimonials[currentIndex].role} • {testimonials[currentIndex].company}
                  </div>
                  <div className="flex mt-2">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentIndex
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Logos de empresas (opcional) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <p className="text-center text-gray-500 mb-8">Confiança de mais de 500 empresas</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {['TechCorp', 'StartupXYZ', 'Growth Inc', 'Digital Solutions', 'InovaTech', 'Future Corp'].map((company, index) => (
              <div key={index} className="text-2xl font-bold text-gray-300">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;