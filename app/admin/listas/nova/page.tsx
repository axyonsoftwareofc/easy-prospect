// app/admin/listas/nova/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Upload, X, FileSpreadsheet, Loader2,
    CheckCircle, AlertCircle, Package
} from 'lucide-react';
import { SEGMENTOS, REGIOES, PAISES, CAMPOS_DISPONIVEIS } from '@/types';

export default function NovaListaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadingArquivo, setUploadingArquivo] = useState(false);
    const [uploadingAmostra, setUploadingAmostra] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    // Estado do formulário
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        segmentos: [] as string[],
        regioes: [] as string[],
        paises: [] as string[],
        quantidade: '',
        preco: '',
        precoDesconto: '',
        camposInclusos: ['email', 'telefone'] as string[],
        taxaValidacao: '95',
        arquivoUrl: '',
        amostraUrl: '',
        destaque: false,
        ativo: true,
    });

    // Arquivos
    const [arquivoNome, setArquivoNome] = useState('');
    const [amostraNome, setAmostraNome] = useState('');

    // Handle checkbox arrays
    const handleArrayChange = (field: 'segmentos' | 'regioes' | 'paises' | 'camposInclusos', value: string) => {
        setFormData(prev => {
            const array = prev[field];
            if (array.includes(value)) {
                return { ...prev, [field]: array.filter(v => v !== value) };
            } else {
                return { ...prev, [field]: [...array, value] };
            }
        });
    };

    // Upload de arquivo
    const handleUpload = async (file: File, tipo: 'listas' | 'amostras') => {
        const setUploading = tipo === 'listas' ? setUploadingArquivo : setUploadingAmostra;
        const setNome = tipo === 'listas' ? setArquivoNome : setAmostraNome;
        const urlField = tipo === 'listas' ? 'arquivoUrl' : 'amostraUrl';

        try {
            setUploading(true);
            setErro('');

            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('tipo', tipo);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({ ...prev, [urlField]: data.data.url }));
                setNome(file.name);
            } else {
                setErro(data.message || 'Erro ao fazer upload');
            }
        } catch (error) {
            console.error('Erro no upload:', error);
            setErro('Erro ao fazer upload do arquivo');
        } finally {
            setUploading(false);
        }
    };

    // Remover arquivo
    const removerArquivo = (tipo: 'listas' | 'amostras') => {
        if (tipo === 'listas') {
            setFormData(prev => ({ ...prev, arquivoUrl: '' }));
            setArquivoNome('');
        } else {
            setFormData(prev => ({ ...prev, amostraUrl: '' }));
            setAmostraNome('');
        }
    };

    // Submeter formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        try {
            // Validações
            if (!formData.nome) {
                setErro('Nome é obrigatório');
                return;
            }
            if (formData.segmentos.length === 0) {
                setErro('Selecione pelo menos um segmento');
                return;
            }
            if (!formData.quantidade || !formData.preco) {
                setErro('Quantidade e preço são obrigatórios');
                return;
            }

            const response = await fetch('/api/listas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: formData.nome,
                    descricao: formData.descricao,
                    segmentos: formData.segmentos,
                    regioes: formData.regioes,
                    paises: formData.paises,
                    quantidade: parseInt(formData.quantidade),
                    preco: parseFloat(formData.preco),
                    precoDesconto: formData.precoDesconto ? parseFloat(formData.precoDesconto) : null,
                    camposInclusos: formData.camposInclusos,
                    taxaValidacao: parseFloat(formData.taxaValidacao),
                    arquivoUrl: formData.arquivoUrl,
                    amostraUrl: formData.amostraUrl,
                    destaque: formData.destaque,
                    ativo: formData.ativo,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSucesso('Lista criada com sucesso!');
                setTimeout(() => {
                    router.push('/admin/listas');
                }, 1500);
            } else {
                setErro(data.message || 'Erro ao criar lista');
            }
        } catch (error) {
            console.error('Erro ao criar lista:', error);
            setErro('Erro ao criar lista');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/admin/listas"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Listas
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Nova Lista de Contatos</h1>
                <p className="text-gray-600">Preencha os dados e faça upload do arquivo Excel</p>
            </div>

            {/* Mensagens */}
            {erro && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{erro}</span>
                </div>
            )}

            {sucesso && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{sucesso}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações básicas */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome da Lista *
                            </label>
                            <input
                                type="text"
                                value={formData.nome}
                                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: Distribuidores de Alimentos - Brasil"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                value={formData.descricao}
                                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Descreva o conteúdo da lista..."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantidade de Contatos *
                                </label>
                                <input
                                    type="number"
                                    value={formData.quantidade}
                                    onChange={(e) => setFormData(prev => ({ ...prev, quantidade: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: 2500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Taxa de Validação (%)
                                </label>
                                <input
                                    type="number"
                                    value={formData.taxaValidacao}
                                    onChange={(e) => setFormData(prev => ({ ...prev, taxaValidacao: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Segmentos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Segmentos *</h2>
                    <div className="flex flex-wrap gap-2">
                        {SEGMENTOS.map((seg) => (
                            <button
                                key={seg}
                                type="button"
                                onClick={() => handleArrayChange('segmentos', seg)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    formData.segmentos.includes(seg)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {seg}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Regiões e Países */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Cobertura Geográfica</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Regiões</label>
                        <div className="flex flex-wrap gap-2">
                            {REGIOES.map((reg) => (
                                <button
                                    key={reg}
                                    type="button"
                                    onClick={() => handleArrayChange('regioes', reg)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                        formData.regioes.includes(reg)
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {reg}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Países</label>
                        <div className="flex flex-wrap gap-2">
                            {PAISES.map((pais) => (
                                <button
                                    key={pais.codigo}
                                    type="button"
                                    onClick={() => handleArrayChange('paises', pais.nome)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                        formData.paises.includes(pais.nome)
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {pais.nome}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Campos inclusos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Campos Inclusos</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {CAMPOS_DISPONIVEIS.map((campo) => (
                            <label
                                key={campo.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                    formData.camposInclusos.includes(campo.id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.camposInclusos.includes(campo.id)}
                                    onChange={() => handleArrayChange('camposInclusos', campo.id)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    formData.camposInclusos.includes(campo.id)
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'border-gray-300'
                                }`}>
                                    {formData.camposInclusos.includes(campo.id) && (
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{campo.nome}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Preços */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Preço</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preço Original (R$) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.preco}
                                onChange={(e) => setFormData(prev => ({ ...prev, preco: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="299.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preço com Desconto (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.precoDesconto}
                                onChange={(e) => setFormData(prev => ({ ...prev, precoDesconto: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="249.00 (opcional)"
                            />
                        </div>
                    </div>
                </div>

                {/* Upload de Arquivos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Arquivos</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Arquivo principal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Arquivo da Lista (Excel/CSV)
                            </label>
                            {formData.arquivoUrl ? (
                                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-green-800 truncate">{arquivoNome}</p>
                                        <p className="text-sm text-green-600">Upload concluído</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removerArquivo('listas')}
                                        className="p-1 text-green-600 hover:text-red-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    {uploadingArquivo ? (
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Clique para fazer upload</span>
                                            <span className="text-xs text-gray-400">.xlsx, .xls, .csv (máx. 10MB)</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUpload(file, 'listas');
                                        }}
                                        className="hidden"
                                        disabled={uploadingArquivo}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Amostra grátis */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amostra Grátis (opcional)
                            </label>
                            {formData.amostraUrl ? (
                                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-green-800 truncate">{amostraNome}</p>
                                        <p className="text-sm text-green-600">Upload concluído</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removerArquivo('amostras')}
                                        className="p-1 text-green-600 hover:text-red-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    {uploadingAmostra ? (
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Clique para fazer upload</span>
                                            <span className="text-xs text-gray-400">Primeiras 10-20 linhas</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUpload(file, 'amostras');
                                        }}
                                        className="hidden"
                                        disabled={uploadingAmostra}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* Opções */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Opções</h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.destaque}
                                onChange={(e) => setFormData(prev => ({ ...prev, destaque: e.target.checked }))}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Destacar esta lista na página inicial</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.ativo}
                                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Lista ativa (visível para clientes)</span>
                        </label>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/admin/listas"
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Criando...
                            </>
                        ) : (
                            <>
                                <Package className="w-5 h-5" />
                                Criar Lista
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}