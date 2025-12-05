'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Search, Users, TrendingUp, Filter, Plus, Mail, Phone, Check, LogOut,
  Building2, MailIcon, PhoneIcon, Globe, UsersIcon, ArrowUpRight, Edit,
  X, FileText, Loader2
} from 'lucide-react';
import CompanyModal from '@/components/dashboard/CompanyModal';

// Interface para as empresas (deve bater com o modelo Prisma)
interface Company {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  industry: string | null;
  size: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'empresas' | 'matches' | 'analytics'>('empresas');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeMatches: 0,
    closedDeals: 0,
    conversionRate: 0
  });

  // Estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Redireciona se não autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Busca empresas da API
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCompanies();
    }
  }, [status]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/companies');
      const data = await response.json();

      if (data.success) {
        setCompanies(data.data);
        updateStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (companiesData: Company[]) => {
    const total = companiesData.length;
    const activeMatches = Math.floor(total * 0.4);
    const closedDeals = Math.floor(total * 0.2);
    const conversionRate = total > 0 ? Math.floor((closedDeals / total) * 100) : 0;

    setStats({
      totalCompanies: total,
      activeMatches,
      closedDeals,
      conversionRate
    });
  };

  const handleOpenModal = (company?: Company) => {
    setSelectedCompany(company || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const handleModalSuccess = () => {
    fetchCompanies(); // Recarrega a lista
  };

  const handleContact = (company: Company, method: 'email' | 'phone') => {
    if (method === 'email' && company.email) {
      window.location.href = `mailto:${company.email}`;
    } else if (method === 'phone' && company.phone) {
      window.location.href = `tel:${company.phone}`;
    } else {
      alert(`Informação de ${method} não disponível`);
    }
  };

  // Filtra empresas pelo termo de busca
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Dados de exemplo para matches
  const matches = [
    { id: 1, fornecedor: 'Artesanato Nordeste', comprador: 'Lojinha de Presentes', status: 'negociando', valor: 'R$ 5.000' },
    { id: 2, fornecedor: 'Cerâmica Arteira', comprador: 'Supermercado ABC', status: 'fechado', valor: 'R$ 12.000' },
  ];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header com info do usuário */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard EasyProspect</h1>
          <p className="text-gray-600">
            Bem-vindo, <span className="font-semibold">{session.user?.name || session.user?.email || 'Usuário'}</span>!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="font-medium">{session.user?.name || 'Administrador'}</div>
            <div className="text-sm text-gray-500">{session.user?.email}</div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Empresas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
              <p className="text-xs text-gray-500 mt-1">Total cadastrado</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Matches Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeMatches}</p>
              <p className="text-xs text-gray-500 mt-1">Em negociação</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Vendas Fechadas</p>
              <p className="text-2xl font-bold text-gray-900">R$ {stats.closedDeals * 5000}</p>
              <p className="text-xs text-gray-500 mt-1">Valor estimado</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Sucesso em matches</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b">
          <button
            onClick={() => setActiveTab('empresas')}
            className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'empresas' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Empresas
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {companies.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'matches' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              Matches
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </div>
          </button>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'empresas' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou segmento..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Nova Empresa
            </button>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="p-10 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {companies.length === 0 ? 'Nenhuma empresa cadastrada' : 'Nenhum resultado encontrado'}
              </h3>
              <p className="text-gray-500 mb-6">
                {companies.length === 0
                  ? 'Clique em "Nova Empresa" para começar!'
                  : 'Tente buscar por outros termos.'}
              </p>
              {companies.length === 0 && (
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Criar Primeira Empresa
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Empresa</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Contato</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Segmento</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Tamanho</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Cadastrado em</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{company.description || 'Sem descrição'}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MailIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{company.email}</span>
                          </div>
                          {company.phone && (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{company.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {company.industry || 'Não especificado'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          company.size === 'large' ? 'bg-purple-100 text-purple-800' :
                          company.size === 'medium' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {company.size === 'large' ? 'Grande' :
                           company.size === 'medium' ? 'Média' :
                           company.size === 'small' ? 'Pequena' : 'Não especificado'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleContact(company, 'email')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Enviar email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          {company.phone && (
                            <button
                              onClick={() => handleContact(company, 'phone')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Ligar"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenModal(company)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Editar empresa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="grid md:grid-cols-2 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Match #{match.id}</h3>
                  <p className="text-gray-600">Potencial de {match.valor}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  match.status === 'fechado'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {match.status === 'fechado' ? 'Fechado' : 'Em negociação'}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Fornecedor</p>
                  <p className="font-medium text-gray-900">{match.fornecedor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comprador</p>
                  <p className="font-medium text-gray-900">{match.comprador}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <button className="flex-1 py-2.5 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Detalhes
                  </button>
                  <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                    Acompanhar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-xl text-gray-900 mb-6">Dashboard Analytics</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Empresas por Segmento</h4>
              <div className="h-48 flex items-center justify-center text-blue-400">
                <div className="text-center">
                  <Globe className="w-12 h-12 mx-auto mb-3" />
                  <p>Gráfico de segmentos aparecerá aqui</p>
                </div>
              </div>
            </div>
            <div className="p-5 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-3">Crescimento Mensal</h4>
              <div className="h-48 flex items-center justify-center text-green-400">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                  <p>Gráfico de crescimento aparecerá aqui</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer com status */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Dashboard conectado ao banco de dados real • {companies.length} empresas carregadas • Última atualização: agora</p>
      </div>

      {/* Modal para criar/editar empresas */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        company={selectedCompany}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}