'use client';

import { useState, useEffect } from 'react';
import { X, Building2, Mail, Phone, Globe, Users, FileText, Loader2 } from 'lucide-react';

// Interface para dados do formulário (sempre strings para inputs)
interface CompanyFormData {
  name: string;
  email: string;
  phone: string;
  industry: string;
  size: string;
  description: string;
}

// Interface para empresa vinda do banco (pode ter nulls)
interface Company {
  id?: string;
  name: string;
  email: string | null;
  phone: string | null;
  industry: string | null;
  size: string | null;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
  onSuccess: () => void;
}

const industryOptions = [
  'Tecnologia',
  'Alimentos',
  'Varejo',
  'Construção',
  'Saúde',
  'Educação',
  'Financeiro',
  'Indústria',
  'Serviços',
  'Agricultura',
  'Outro'
];

const sizeOptions = [
  { value: 'small', label: 'Pequena (1-10 funcionários)' },
  { value: 'medium', label: 'Média (11-50 funcionários)' },
  { value: 'large', label: 'Grande (50+ funcionários)' }
];

export default function CompanyModal({ isOpen, onClose, company, onSuccess }: CompanyModalProps) {
  // Estado do formulário usa strings (nunca null)
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    email: '',
    phone: '',
    industry: '',
    size: 'medium',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditMode = !!company?.id;

  // Preenche o formulário quando editar (converte null para string vazia)
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name ?? '',
        email: company.email ?? '',
        phone: company.phone ?? '',
        industry: company.industry ?? '',
        size: company.size ?? 'medium',
        description: company.description ?? ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        industry: '',
        size: 'medium',
        description: ''
      });
    }
    setErrors({});
  }, [company]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = isEditMode
          ? `/api/companies/${company!.id}`
          : '/api/companies';

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        if (data.message?.includes('email') || data.message?.includes('duplicado')) {
          setErrors({ email: data.message });
        } else {
          alert(`Erro: ${data.message || 'Erro desconhecido'}`);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      alert('Erro ao salvar empresa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditMode ? 'Editar Empresa' : 'Nova Empresa'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isEditMode ? 'Atualize os dados da empresa' : 'Preencha os dados para cadastrar'}
                  </p>
                </div>
              </div>
              <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Nome da Empresa *
                    </div>
                  </label>
                  <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Tech Solutions LTDA"
                  />
                  {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email *
                      </div>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="contato@empresa.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </div>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Segmento
                      </div>
                    </label>
                    <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione um segmento</option>
                      {industryOptions.map(industry => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Tamanho
                      </div>
                    </label>
                    <select
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {sizeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Descrição
                    </div>
                  </label>
                  <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Descreva brevemente a empresa..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={loading}
                >
                  Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                  ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        {isEditMode ? 'Atualizar Empresa' : 'Cadastrar Empresa'}
                      </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}