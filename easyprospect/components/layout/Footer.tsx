'use client';

import { motion } from 'framer-motion';
import { Sparkles, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    Produto: [
      { label: 'Recursos', href: '#recursos' },
      { label: 'Como Funciona', href: '#como-funciona' },
      { label: 'Preços', href: '#precos' },
      { label: 'API', href: '#' },
      { label: 'Status', href: '#' },
    ],
    Empresa: [
      { label: 'Sobre Nós', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Carreiras', href: '#' },
      { label: 'Contato', href: '#' },
      { label: 'Imprensa', href: '#' },
    ],
    Recursos: [
      { label: 'Documentação', href: '#' },
      { label: 'Guia de Uso', href: '#' },
      { label: 'Tutoriais', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Comunidade', href: '#' },
    ],
    Legal: [
      { label: 'Termos de Uso', href: '#' },
      { label: 'Política de Privacidade', href: '#' },
      { label: 'Cookies', href: '#' },
      { label: 'LGPD', href: '#' },
      { label: 'Segurança', href: '#' },
    ],
  };

  const socials = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4"
              >
                <Sparkles className="w-7 h-7" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold">EasyProspect</h3>
                <p className="text-gray-400">by Saboia Solutions</p>
              </div>
            </div>
            <p className="text-gray-400 mb-8 max-w-md">
              Transformando a maneira como empresas prospectam e convertem clientes.
              Tecnologia de ponta com simplicidade para resultados extraordinários.
            </p>

            {/* Newsletter */}
            <div className="mb-8">
              <h4 className="font-semibold mb-4">Receba nossas atualizações</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu melhor email"
                  className="flex-1 px-4 py-3 rounded-l-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-r-lg font-semibold hover:opacity-90 transition-opacity">
                  Inscrever
                </button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-bold text-lg mb-6">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Contact Info */}
          <div className="mb-6 md:mb-0">
            <div className="flex flex-wrap gap-6 text-gray-400">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>contato@easyprospect.com.br</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>São Paulo, Brasil</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <span className="text-gray-400 mr-4">Siga-nos:</span>
            {socials.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2">
            <p>
              © {currentYear} EasyProspect. Todos os direitos reservados.
            </p>
            <span className="hidden md:inline">•</span>
            <p className="flex items-center">
              Feito com <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> por Saboia Solutions
            </p>
            <span className="hidden md:inline">•</span>
            <p>
              Orgulhosamente brasileiro 🇧🇷
            </p>
          </div>

          {/* Badge Tech */}
          <div className="mt-6 inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <span className="text-sm">
              Desenvolvido com Next.js 14, Tailwind CSS & Framer Motion
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;