// app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, Building2, Factory, Package, Globe,
  Users, Truck, Store, Warehouse, ChevronDown, ChevronUp,
  Loader2, Check, X, ShoppingCart, Download, Eye,
  Mail, Phone, ExternalLink, Sparkles, LogOut, CreditCard,
  Filter, CheckSquare, Square, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, History
} from 'lucide-react';
import EmpresaModal from '@/components/dashboard/EmpresaModal';

// Constantes
const PAISES = [
  { codigo: 'BR', nome: 'Brasil' },
  { codigo: 'AR', nome: 'Argentina' },
  { codigo: 'CL', nome: 'Chile' },
  { codigo: 'US', nome: 'Estados Unidos' },
  { codigo: 'PT', nome: 'Portugal' },
  { codigo: 'CN', nome: 'China' },
];

const SETORES = [
  'Tecnologia', 'Alimentos', 'Vestuário', 'Brinquedos',
  'Saúde', 'Beleza', 'Pet', 'Construção', 'Automotivo', 'Serviços',
];

const PORTES = [
  { id: 'mei', nome: 'MEI' },
  { id: 'micro', nome: 'Micro' },
  { id: 'pequena', nome: 'Pequena' },
  { id: 'media', nome: 'Média' },
  { id: 'grande', nome: 'Grande' },
];

const ESTADOS_BRASIL = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF'];

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estados de filtros
  const [paisesSelecionados, setPaisesSelecionados] = useState<string[]>([]);
  const [estadosSelecionados, setEstadosSelecionados] = useState<string[]>([]);
  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>([]);
  const [portesSelecionados, setPortesSelecionados] = useState<string[]>([]);
  const [isImportador, setIsImportador] = useState(false);
  const [isExportador, setIsExportador] = useState(false);
  const [isDistribuidor, setIsDistribuidor] = useState(false);
  const [isFabricante, setIsFabricante] = useState(false);
  const [isVarejo, setIsVarejo] = useState(false);
  const [busca, setBusca] = useState('');

  // Estados de dados
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Estados de seleção
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());
  const [empresaModal, setEmpresaModal] = useState<Empresa | null>(null);

  // Estados de créditos
  const [creditos, setCreditos] = useState(0);
  const [carregandoCreditos, setCarregandoCreditos] = useState(true);

  // Estados de download
  const [downloading, setDownloading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Estados de UI
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const [secaoPais, setSecaoPais] = useState(true);
  const [secaoEstado, setSecaoEstado] = useState(false);
  const [secaoSetor, setSecaoSetor] = useState(true);
  const [secaoTipo, setSecaoTipo] = useState(false);
  const [secaoPorte, setSecaoPorte] = useState(false);

  const precoPorContato = 1; // 1 crédito = 1 contato

  // Redirecionar se não autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Buscar créditos
  useEffect(() => {
    if (status === 'authenticated') {
      buscarCreditos();
    }
  }, [status]);

  // Buscar empresas quando filtros mudam
  useEffect(() => {
    if (status === 'authenticated') {
      const timer = setTimeout(() => {
        buscarEmpresas();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [
    paisesSelecionados, estadosSelecionados, setoresSelecionados,
    portesSelecionados, isImportador, isExportador, isDistribuidor,
    isFabricante, isVarejo, busca, pagina, status
  ]);

  const buscarCreditos = async () => {
    try {
      setCarregandoCreditos(true);
      const response = await fetch('/api/user/creditos');
      const data = await response.json();
      if (data.success) {
        setCreditos(data.data.creditos);
      }
    } catch (error) {
      console.error('Erro ao buscar créditos:', error);
    } finally {
      setCarregandoCreditos(false);
    }
  };

  const buscarEmpresas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('pagina', pagina.toString());
      params.append('limite', '20');

      if (paisesSelecionados.length > 0) params.append('paises', paisesSelecionados.join(','));
      if (estadosSelecionados.length > 0) params.append('estados', estadosSelecionados.join(','));
      if (setoresSelecionados.length > 0) params.append('setores', setoresSelecionados.join(','));
      if (portesSelecionados.length > 0) params.append('portes', portesSelecionados.join(','));
      if (isImportador) params.append('isImportador', 'true');
      if (isExportador) params.append('isExportador', 'true');
      if (isDistribuidor) params.append('isDistribuidor', 'true');
      if (isFabricante) params.append('isFabricante', 'true');
      if (isVarejo) params.append('isVarejo', 'true');
      if (busca) params.append('busca', busca);

      const response = await fetch(`/api/empresas?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setEmpresas(data.data || []);
        setTotal(data.total || 0);
        setTotalPaginas(data.totalPaginas || 1);
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Download da lista
  const handleDownload = async () => {
    if (selecionadas.size === 0) {
      setMensagem({ tipo: 'error', texto: 'Selecione pelo menos uma empresa' });
      return;
    }

    if (selecionadas.size > creditos) {
      setMensagem({
        tipo: 'error',
        texto: `Créditos insuficientes. Você tem ${creditos} créditos, mas selecionou ${selecionadas.size} empresas.`
      });
      return;
    }

    setDownloading(true);
    setMensagem(null);

    try {
      const response = await fetch('/api/empresas/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaIds: Array.from(selecionadas),
          formato: 'csv',
        }),
      });

      if (response.ok) {
        // Download do CSV
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `easyprospect-lista-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Atualizar créditos
        const creditosRestantes = response.headers.get('X-Creditos-Restantes');
        if (creditosRestantes) {
          setCreditos(parseInt(creditosRestantes));
        } else {
          buscarCreditos();
        }

        // Limpar seleção
        setSelecionadas(new Set());
        setMensagem({
          tipo: 'success',
          texto: `Download realizado! ${selecionadas.size} créditos utilizados.`
        });
      } else {
        const data = await response.json();
        setMensagem({ tipo: 'error', texto: data.message || 'Erro ao fazer download' });
      }
    } catch (error) {
      console.error('Erro no download:', error);
      setMensagem({ tipo: 'error', texto: 'Erro ao processar download' });
    } finally {
      setDownloading(false);
    }
  };

  // Toggle arrays
  const toggleArray = (array: string[], setArray: (arr: string[]) => void, value: string) => {
    if (array.includes(value)) {
      setArray(array.filter(v => v !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const toggleSelecionada = (id: string) => {
    const novas = new Set(selecionadas);
    if (novas.has(id)) {
      novas.delete(id);
    } else {
      novas.add(id);
    }
    setSelecionadas(novas);
  };

  const selecionarTodas = () => {
    const novas = new Set(selecionadas);
    empresas.forEach(e => novas.add(e.id));
    setSelecionadas(novas);
  };

  const desselecionarTodas = () => {
    setSelecionadas(new Set());
  };

  const limparFiltros = () => {
    setPaisesSelecionados([]);
    setEstadosSelecionados([]);
    setSetoresSelecionados([]);
    setPortesSelecionados([]);
    setIsImportador(false);
    setIsExportador(false);
    setIsDistribuidor(false);
    setIsFabricante(false);
    setIsVarejo(false);
    setBusca('');
    setPagina(1);
  };

  const ocultarEmail = (email: string | null) => {
    if (!email) return '-';
    const [user, domain] = email.split('@');
    return `${user.substring(0, 3)}***@${domain}`;
  };

  const ocultarTelefone = (tel: string | null) => {
    if (!tel) return '-';
    return tel.substring(0, 8) + '****';
  };

  const temFiltrosAtivos = paisesSelecionados.length > 0 || estadosSelecionados.length > 0 ||
      setoresSelecionados.length > 0 || portesSelecionados.length > 0 ||
      isImportador || isExportador || isDistribuidor || isFabricante || isVarejo || busca;

  if (status === 'loading') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );
  }

  if (!session) return null;

  const totalSelecionadas = selecionadas.size;
  const creditosSuficientes = creditos >= totalSelecionadas;

  return (
      <div className="min-h-screen bg-gray-100">
        {/* Mensagem de feedback */}
        {mensagem && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
                mensagem.tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {mensagem.tipo === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
              ) : (
                  <AlertCircle className="w-5 h-5" />
              )}
              <span>{mensagem.texto}</span>
              <button onClick={() => setMensagem(null)} className="ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
        )}

        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                  onClick={() => setSidebarAberta(!sidebarAberta)}
                  className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Filter className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl hidden sm:block">EasyProspect</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Créditos */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                {carregandoCreditos ? '...' : `${creditos} créditos`}
              </span>
              </div>

              {/* Usuário */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium">{session.user?.name}</div>
                  <div className="text-xs text-gray-500">{session.user?.email}</div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out overflow-y-auto
          ${sidebarAberta ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          pt-16 lg:pt-0
        `}>
            {sidebarAberta && (
                <div className="fixed inset-0 bg-black/50 lg:hidden z-[-1]" onClick={() => setSidebarAberta(false)} />
            )}

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </h2>
                {temFiltrosAtivos && (
                    <button onClick={limparFiltros} className="text-sm text-blue-600 hover:text-blue-800">
                      Limpar
                    </button>
                )}
              </div>

              {/* Busca */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                      type="text"
                      placeholder="Buscar empresa..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filtro País */}
              <div className="border-b border-gray-200 pb-3 mb-3">
                <button
                    onClick={() => setSecaoPais(!secaoPais)}
                    className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700"
                >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  País
                  {paisesSelecionados.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {paisesSelecionados.length}
                    </span>
                  )}
                </span>
                  {secaoPais ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {secaoPais && (
                    <div className="mt-2 space-y-1">
                      {PAISES.map((pais) => (
                          <label key={pais.codigo} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                                type="checkbox"
                                checked={paisesSelecionados.includes(pais.nome)}
                                onChange={() => toggleArray(paisesSelecionados, setPaisesSelecionados, pais.nome)}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">{pais.nome}</span>
                          </label>
                      ))}
                    </div>
                )}
              </div>

              {/* Filtro Estado */}
              {paisesSelecionados.includes('Brasil') && (
                  <div className="border-b border-gray-200 pb-3 mb-3">
                    <button
                        onClick={() => setSecaoEstado(!secaoEstado)}
                        className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700"
                    >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Estado
                  </span>
                      {secaoEstado ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {secaoEstado && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {ESTADOS_BRASIL.map((estado) => (
                              <button
                                  key={estado}
                                  onClick={() => toggleArray(estadosSelecionados, setEstadosSelecionados, estado)}
                                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                      estadosSelecionados.includes(estado)
                                          ? 'bg-purple-500 text-white'
                                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                              >
                                {estado}
                              </button>
                          ))}
                        </div>
                    )}
                  </div>
              )}

              {/* Filtro Setor */}
              <div className="border-b border-gray-200 pb-3 mb-3">
                <button
                    onClick={() => setSecaoSetor(!secaoSetor)}
                    className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700"
                >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Setor
                </span>
                  {secaoSetor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {secaoSetor && (
                    <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                      {SETORES.map((setor) => (
                          <label key={setor} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                                type="checkbox"
                                checked={setoresSelecionados.includes(setor)}
                                onChange={() => toggleArray(setoresSelecionados, setSetoresSelecionados, setor)}
                                className="w-4 h-4 text-green-600 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">{setor}</span>
                          </label>
                      ))}
                    </div>
                )}
              </div>

              {/* Filtro Tipo */}
              <div className="border-b border-gray-200 pb-3 mb-3">
                <button
                    onClick={() => setSecaoTipo(!secaoTipo)}
                    className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700"
                >
                <span className="flex items-center gap-2">
                  <Factory className="w-4 h-4" />
                  Tipo
                </span>
                  {secaoTipo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {secaoTipo && (
                    <div className="mt-2 space-y-1">
                      {[
                        { label: 'Importador', checked: isImportador, set: setIsImportador },
                        { label: 'Exportador', checked: isExportador, set: setIsExportador },
                        { label: 'Distribuidor', checked: isDistribuidor, set: setIsDistribuidor },
                        { label: 'Fabricante', checked: isFabricante, set: setIsFabricante },
                        { label: 'Varejo', checked: isVarejo, set: setIsVarejo },
                      ].map((item) => (
                          <label key={item.label} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={(e) => item.set(e.target.checked)}
                                className="w-4 h-4 text-orange-600 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">{item.label}</span>
                          </label>
                      ))}
                    </div>
                )}
              </div>

              {/* Filtro Porte */}
              <div className="pb-3">
                <button
                    onClick={() => setSecaoPorte(!secaoPorte)}
                    className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700"
                >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Porte
                </span>
                  {secaoPorte ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {secaoPorte && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {PORTES.map((porte) => (
                          <button
                              key={porte.id}
                              onClick={() => toggleArray(portesSelecionados, setPortesSelecionados, porte.id)}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                  portesSelecionados.includes(porte.id)
                                      ? 'bg-yellow-500 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {porte.nome}
                          </button>
                      ))}
                    </div>
                )}
              </div>
            </div>
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1 p-4 lg:p-6 pb-32">
            {/* Barra de ações */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {loading ? 'Buscando...' : `${total.toLocaleString()} empresas encontradas`}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {totalSelecionadas > 0
                        ? `${totalSelecionadas} selecionadas • ${totalSelecionadas} créditos`
                        : 'Selecione empresas para adicionar à sua lista'
                    }
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {empresas.length > 0 && (
                      <>
                        <button
                            onClick={selecionarTodas}
                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                        >
                          <CheckSquare className="w-4 h-4" />
                          Selecionar página
                        </button>
                        {totalSelecionadas > 0 && (
                            <button
                                onClick={desselecionarTodas}
                                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1"
                            >
                              <X className="w-4 h-4" />
                              Limpar
                            </button>
                        )}
                      </>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de Empresas */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : empresas.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma empresa encontrada</h3>
                  <p className="text-gray-500 mb-6">Tente ajustar os filtros</p>
                  <button onClick={limparFiltros} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Limpar filtros
                  </button>
                </div>
            ) : (
                <div className="space-y-3">
                  {empresas.map((empresa) => (
                      <div
                          key={empresa.id}
                          className={`bg-white rounded-xl shadow-sm border-2 transition-colors ${
                              selecionadas.has(empresa.id)
                                  ? 'border-blue-500 bg-blue-50/30'
                                  : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-4">
                            <button
                                onClick={() => toggleSelecionada(empresa.id)}
                                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    selecionadas.has(empresa.id)
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'border-gray-300 hover:border-blue-500'
                                }`}
                            >
                              {selecionadas.has(empresa.id) && <Check className="w-3 h-3" />}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{empresa.nome}</h3>
                                  {empresa.nomeFantasia && (
                                      <p className="text-sm text-gray-500">{empresa.nomeFantasia}</p>
                                  )}
                                </div>
                                <button
                                    onClick={() => setEmpresaModal(empresa)}
                                    className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  Detalhes
                                </button>
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {empresa.cidade}, {empresa.estado} - {empresa.pais}
                          </span>
                                <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                                  {empresa.setor}
                          </span>
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Mail className="w-3 h-3" />
                            {ocultarEmail(empresa.email)}
                          </span>
                                {empresa.telefone && (
                                    <span className="flex items-center gap-1 text-gray-500">
                              <Phone className="w-3 h-3" />
                                      {ocultarTelefone(empresa.telefone)}
                            </span>
                                )}
                              </div>

                              <div className="mt-2 flex flex-wrap gap-1">
                                {empresa.isImportador && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Importador</span>}
                                {empresa.isExportador && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Exportador</span>}
                                {empresa.isDistribuidor && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">Distribuidor</span>}
                                {empresa.isFabricante && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Fabricante</span>}
                                {empresa.isVarejo && <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs">Varejo</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}

                  {/* Paginação */}
                  {totalPaginas > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                            onClick={() => setPagina(p => Math.max(1, p - 1))}
                            disabled={pagina === 1}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="px-4 py-2 text-sm text-gray-600">
                    Página {pagina} de {totalPaginas}
                  </span>
                        <button
                            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                            disabled={pagina === totalPaginas}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                  )}
                </div>
            )}
          </main>

          {/* Carrinho Flutuante */}
          {totalSelecionadas > 0 && (
              <div className="fixed bottom-4 right-4 left-4 lg:left-auto lg:w-96 z-50">
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      Sua Lista
                    </h3>
                    <button onClick={desselecionarTodas} className="text-sm text-gray-500 hover:text-gray-700">
                      Limpar
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{totalSelecionadas}</div>
                      <div className="text-sm text-gray-500">empresas</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${creditosSuficientes ? 'text-blue-600' : 'text-red-600'}`}>
                        {totalSelecionadas} créditos
                      </div>
                      <div className="text-sm text-gray-500">
                        Você tem: {creditos}
                      </div>
                    </div>
                  </div>

                  {!creditosSuficientes && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Créditos insuficientes
                      </div>
                  )}

                  <button
                      onClick={handleDownload}
                      disabled={downloading || !creditosSuficientes}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {downloading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Baixando...
                        </>
                    ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Baixar Lista (CSV)
                        </>
                    )}
                  </button>
                </div>
              </div>
          )}
        </div>

        {/* Modal */}
        {empresaModal && (
            <EmpresaModal
                empresa={empresaModal}
                onClose={() => setEmpresaModal(null)}
                onSelect={() => {
                  toggleSelecionada(empresaModal.id);
                  setEmpresaModal(null);
                }}
                isSelected={selecionadas.has(empresaModal.id)}
            />
        )}
      </div>
  );
}