// components/dashboard/EmpresaModal.tsx

'use client';

import {
    X, Building2, Mail, Phone, Globe, MapPin, Users,
    Factory, Truck, Store, Warehouse, Package, ExternalLink,
    Check, Plus, Linkedin, Instagram, Star
} from 'lucide-react';

interface Empresa {
    id: string;
    nome: string;
    nomeFantasia: string | null;
    email: string | null;
    telefone: string | null;
    whatsapp: string | null;
    site: string | null;
    continente: string | null;
    pais: string;
    estado: string | null;
    cidade: string | null;
    setor: string;
    subsetor: string | null;
    porte: string | null;
    isImportador: boolean;
    isExportador: boolean;
    isDistribuidor: boolean;
    isFabricante: boolean;
    isVarejo: boolean;
    responsavel: string | null;
    cargo: string | null;
    qualidade: number;
}

interface EmpresaModalProps {
    empresa: Empresa;
    onClose: () => void;
    onSelect: () => void;
    isSelected: boolean;
}

export default function EmpresaModal({ empresa, onClose, onSelect, isSelected }: EmpresaModalProps) {
    // Ocultar dados
    const ocultarEmail = (email: string | null) => {
        if (!email) return '-';
        const [user, domain] = email.split('@');
        return `${user.substring(0, 3)}***@${domain}`;
    };

    const ocultarTelefone = (tel: string | null) => {
        if (!tel) return '-';
        return tel.substring(0, 8) + '****';
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-gray-200">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                                {empresa.nome.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{empresa.nome}</h2>
                                {empresa.nomeFantasia && (
                                    <p className="text-gray-500">{empresa.nomeFantasia}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                    {empresa.setor}
                  </span>
                                    {empresa.porte && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {empresa.porte}
                    </span>
                                    )}
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-medium">{empresa.qualidade}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6 space-y-6">
                        {/* Localização */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Localização
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium text-gray-900">
                                    {empresa.cidade}, {empresa.estado}
                                </p>
                                <p className="text-gray-600">{empresa.pais}</p>
                                {empresa.continente && (
                                    <p className="text-sm text-gray-500">{empresa.continente}</p>
                                )}
                            </div>
                        </div>

                        {/* Contato (parcialmente oculto) */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Contato
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700">{ocultarEmail(empresa.email)}</span>
                                </div>
                                {empresa.telefone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-700">{ocultarTelefone(empresa.telefone)}</span>
                                    </div>
                                )}
                                {empresa.whatsapp && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-700">{ocultarTelefone(empresa.whatsapp)}</span>
                                    </div>
                                )}
                                {empresa.site && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-700">*****.com.br</span>
                                    </div>
                                )}
                                {empresa.responsavel && (
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-700">
                      {empresa.responsavel.substring(0, 5)}***
                                            {empresa.cargo && ` - ${empresa.cargo}`}
                    </span>
                                    </div>
                                )}
                            </div>

                            <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                                🔒 Dados completos disponíveis após a compra
                            </p>
                        </div>

                        {/* Tipo de Negócio */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                <Factory className="w-4 h-4" />
                                Tipo de Negócio
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {empresa.isImportador && (
                                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Importador
                  </span>
                                )}
                                {empresa.isExportador && (
                                    <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Exportador
                  </span>
                                )}
                                {empresa.isDistribuidor && (
                                    <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Warehouse className="w-4 h-4" />
                    Distribuidor
                  </span>
                                )}
                                {empresa.isFabricante && (
                                    <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Factory className="w-4 h-4" />
                    Fabricante
                  </span>
                                )}
                                {empresa.isVarejo && (
                                    <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Store className="w-4 h-4" />
                    Varejo
                  </span>
                                )}
                                {!empresa.isImportador && !empresa.isExportador && !empresa.isDistribuidor && !empresa.isFabricante && !empresa.isVarejo && (
                                    <span className="text-gray-500">Não especificado</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                        <div className="text-sm text-gray-500">
                            1 crédito = R$ 0,10
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={onSelect}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                                    isSelected
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isSelected ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Selecionada
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Adicionar à Lista
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}