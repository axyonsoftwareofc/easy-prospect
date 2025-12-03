'use client';

import { useState } from 'react';
import { Search, Users, Handshake, TrendingUp, Filter, Plus, Mail, Phone, Check } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'empresas' | 'matches' | 'analytics'>('empresas');

  // Dados de exemplo
  const empresas = [
    { id: 1, nome: 'Artesanato Nordeste', tipo: 'fornecedor', segmento: 'artesanato', contato: '(11) 99999-9999', status: 'ativo' },
    { id: 2, nome: 'Supermercado ABC', tipo: 'comprador', segmento: 'alimentos', contato: 'contato@superabc.com', status: 'ativo' },
    { id: 3, nome: 'Cerâmica Arteira', tipo: 'fornecedor', segmento: 'cerâmica', contato: '(21) 88888-8888', status: 'contatado' },
    { id: 4, nome: 'Lojinha de Presentes', tipo: 'comprador', segmento: 'presentes', contato: 'vendas@lojinha.com', status: 'inativo' },
  ];

  const matches = [
    { id: 1, fornecedor: 'Artesanato Nordeste', comprador: 'Lojinha de Presentes', status: 'negociando', valor: 'R$ 5.000' },
    { id: 2, fornecedor: 'Cerâmica Arteira', comprador: 'Supermercado ABC', status: 'fechado', valor: 'R$ 12.000' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard EasyProspect</h1>
        <p className="text-gray-600">Gerencie seus matches e empresas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Empresas</p>
              <p className="text-2xl font-bold">42</p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Matches Ativos</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <Handshake className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Vendas Fechadas</p>
              <p className="text-2xl font-bold">R$ 89.500</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Taxa de Conversão</p>
              <p className="text-2xl font-bold">68%</p>
            </div>
            <Filter className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('empresas')}
            className={`pb-2 px-4 font-medium ${activeTab === 'empresas' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            Empresas
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`pb-2 px-4 font-medium ${activeTab === 'matches' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-2 px-4 font-medium ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'empresas' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar empresas..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
              <Plus className="w-5 h-5" />
              Nova Empresa
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">Tipo</th>
                  <th className="p-4 text-left">Segmento</th>
                  <th className="p-4 text-left">Contato</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{empresa.nome}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        empresa.tipo === 'fornecedor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {empresa.tipo}
                      </span>
                    </td>
                    <td className="p-4">{empresa.segmento}</td>
                    <td className="p-4">{empresa.contato}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        empresa.status === 'ativo'
                          ? 'bg-green-100 text-green-800'
                          : empresa.status === 'contatado'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {empresa.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="grid md:grid-cols-2 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Match #{match.id}</h3>
                  <p className="text-gray-600">Potencial de {match.valor}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  match.status === 'fechado'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {match.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Fornecedor</p>
                  <p className="font-medium">{match.fornecedor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comprador</p>
                  <p className="font-medium">{match.comprador}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
                    Detalhes
                  </button>
                  <button className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium">
                    Acompanhar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold text-lg mb-6">Dashboard Analytics</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Gráficos e métricas detalhadas aparecerão aqui
          </div>
        </div>
      )}
    </div>
  );
}