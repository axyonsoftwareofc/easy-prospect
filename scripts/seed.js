// scripts/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed completo...\n');

  // =====================
  // USUÁRIO ADMIN
  // =====================
  console.log('👤 Criando usuário admin...');
  const hashedPassword = await bcrypt.hash('senha123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@easyprospect.com' },
    update: {},
    create: {
      email: 'admin@easyprospect.com',
      name: 'Administrador',
      password: hashedPassword,
      plano: 'enterprise',
      creditos: 99999,
    },
  });
  console.log('   ✅ Admin criado:', admin.email);

  // Usuário teste
  const userTeste = await prisma.user.upsert({
    where: { email: 'teste@teste.com' },
    update: {},
    create: {
      email: 'teste@teste.com',
      name: 'Usuário Teste',
      password: hashedPassword,
      plano: 'free',
      creditos: 10,
    },
  });
  console.log('   ✅ User teste criado:', userTeste.email);

  // =====================
  // PLANOS
  // =====================
  console.log('\n💳 Criando planos...');

  const planos = [
    {
      nome: 'free',
      nomeExibicao: 'Gratuito',
      preco: 0,
      creditosMensal: 10,
      setoresMax: 1,
      paisesMax: 1,
      exportPDF: false,
      exportCSV: true,
      acessoAPI: false,
      suportePrioritario: false,
    },
    {
      nome: 'starter',
      nomeExibicao: 'Starter',
      preco: 99,
      creditosMensal: 500,
      setoresMax: 3,
      paisesMax: 5,
      exportPDF: true,
      exportCSV: true,
      acessoAPI: false,
      suportePrioritario: false,
    },
    {
      nome: 'pro',
      nomeExibicao: 'Profissional',
      preco: 299,
      creditosMensal: 2000,
      setoresMax: -1,
      paisesMax: -1,
      exportPDF: true,
      exportCSV: true,
      acessoAPI: false,
      suportePrioritario: true,
    },
    {
      nome: 'enterprise',
      nomeExibicao: 'Enterprise',
      preco: 799,
      creditosMensal: -1,
      setoresMax: -1,
      paisesMax: -1,
      exportPDF: true,
      exportCSV: true,
      acessoAPI: true,
      suportePrioritario: true,
    },
  ];

  for (const plano of planos) {
    await prisma.plano.upsert({
      where: { nome: plano.nome },
      update: plano,
      create: plano,
    });
  }
  console.log('   ✅ Planos criados:', planos.length);

  // =====================
  // EMPRESAS (BANCO PRINCIPAL)
  // =====================
  console.log('\n🏢 Criando banco de empresas...');

  // Limpar empresas existentes
  await prisma.empresa.deleteMany({});

  const empresas = [
    // TECNOLOGIA - BRASIL
    {
      nome: 'TechSoft Solutions Ltda',
      nomeFantasia: 'TechSoft',
      cnpj: '12.345.678/0001-01',
      email: 'contato@techsoft.com.br',
      telefone: '(11) 3456-7890',
      whatsapp: '(11) 99876-5432',
      site: 'www.techsoft.com.br',
      continente: 'América do Sul',
      pais: 'Brasil',
      estado: 'SP',
      cidade: 'São Paulo',
      setor: 'Tecnologia',
      subsetor: 'Software',
      porte: 'media',
      isImportador: false,
      isExportador: true,
      isDistribuidor: false,
      isFabricante: false,
      isVarejo: false,
      responsavel: 'Carlos Eduardo Silva',
      cargo: 'CEO',
      linkedinEmpresa: 'linkedin.com/company/techsoft',
      qualidade: 95,
    },
    {
      nome: 'DataCloud Tecnologia SA',
      nomeFantasia: 'DataCloud',
      cnpj: '23.456.789/0001-02',
      email: 'comercial@datacloud.com.br',
      telefone: '(11) 2345-6789',
      whatsapp: '(11) 98765-4321',
      site: 'www.datacloud.com.br',
      continente: 'América do Sul',
      pais: 'Brasil',
      estado: 'SP',
      cidade: 'Campinas',
      setor: 'Tecnologia',
      subsetor: 'Cloud Computing',
      porte: 'grande',
      isImportador: true,
      isExportador: true,
      isDistribuidor: true,
      isFabricante: false,
      isVarejo: false,
      responsavel: 'Ana Paula Martins',
      cargo: 'Diretora Comercial',
      qualidade: 92,
    },
    {
      nome: 'InnovateTech LTDA',
      nomeFantasia: 'InnovateTech',
      cnpj: '34.567.890/0001-03',
      email: 'vendas@innovatetech.com.br',
      telefone: '(21) 3456-7890',
      whatsapp: '(21) 99876-5432',
      continente: 'América do Sul',
      pais: 'Brasil',
      estado: 'RJ',
      cidade: 'Rio de Janeiro',
      setor: 'Tecnologia',
      subsetor: 'Hardware',
      porte: 'pequena',
      isImportador: true,
      isExportador: false,
      isDistribuidor: true,
      isFabricante: false,
      isVarejo: true,
      responsavel: 'Roberto Santos',
      cargo: 'Sócio',
      qualidade: 88,
    },

    // ALIMENTOS - BRASIL
    {
      nome: 'Distribuidora Alimentos Brasil SA',
      nomeFantasia: 'DAB Alimentos',
      cnpj: '45.678.901/0001-04',
      email: 'comercial@dabalimentos.com.br',
      telefone: '(11) 4567-8901',
      whatsapp: '(11) 97654-3210',
      site: 'www.dabalimentos.com.br',
      continente: 'América do Sul',
      pais: 'Brasil',
      estado: 'SP',
      cidade: 'São Paulo',
      setor: 'Alimentos',
      subsetor: 'Distribuição',
      porte: 'grande',
      isImportador: true,
      isExportador: false,
      isDistribuidor: true,
      isFabricante: false,
      isVarejo: false,
      isAtacado: true,
      responsavel: 'Maria Fernanda Costa',
      cargo: 'Gerente de Compras',
      qualidade: 94,
    },
    {
      nome: 'Laticínios Serra Verde',
      nomeFantasia: 'Serra Verde',
      cnpj: '56.789.012/0001-05',
      email: 'vendas@serraverde.com.br',
      telefone: '(31) 3456-7890',
      continente: 'América do Sul',
      pais: 'Brasil',
      estado: 'MG',
      cidade: 'Belo Horizonte',
      setor: 'Alimentos',
      subsetor: 'Laticínios',
      porte: 'media',
      isImportador: false,
      isExportador: true,
      isDistribuidor: false,
      isFabricante: true,
      isVarejo: false,
      responsavel: 'José Antônio Pereira',
      cargo: 'Diretor Industrial',
      qualidade: 90,
    },

    // VESTUÁRIO - BRASIL
    {
      nome: 'Moda Fashion Confecções',
      nomeFantasia: 'Moda Fashion',
      cnpj: '67.890.123/0001-06',
      email: 'atacado@modafashion.com.br',
      telefone: '(11) 5678-9012',
      whatsapp: '(11) 96543-2109',
      site: 'www.modafashion.com.br',
      instagram: '@modafashionoficial',
      continente: 'América do Sul',
      pais: 'Brasil',
      estado: 'SP',
      cidade: 'São Paulo',
      setor: 'Vestuário',
      subsetor: 'Moda Feminina',
      porte: 'media',
      isImportador: true,
      isExportador: false,
      isDistribuidor: false,
      isFabricante: true,
      isVarejo: true,
      isAtacado: true,
      responsavel: 'Juliana Mendes',
      cargo: 'Proprietária',
      qualidade: 87,
    },
    {
      nome: 'Têxtil Brasil Industrial',
      nomeFantasia: 'TBI',
      cnpj: '78.901.234/0001-07',
      email: 'comercial@tbi.com.br',
      telefone: '(47) 3456-7890',
      continente: 'América do Sul',
      pais: 'Brasil',
      estado: 'SC',
      cidade: 'Blumenau',
      setor: 'Vestuário',
      subsetor: 'Têxtil',
      porte: 'grande',
      isImportador: false,
      isExportador: true,
      isDistribuidor: false,
      isFabricante: true,
      isVarejo: false,
      responsavel: 'Hans Mueller',
      cargo: 'CEO',
      qualidade: 96,
    },

    // BRINQUEDOS - BRASIL
    {
      nome: 'Brinquedos Feliz Ltda',
      nomeFantasia: 'Loja Feliz',
      cnpj: '89.012.345/0001-08',
      email: 'compras@lojafeliz.com.br',
      telefone: '(11) 6789-0123',
      whatsapp: '(11) 95432-1098',
      continente: 'América do Sul',
      pais: 'Brasil',
      estado: 'SP',
      cidade: 'São Paulo',
      setor: 'Brinquedos',
      subsetor: 'Varejo',
      porte: 'pequena',
      isImportador: true,
      isExportador: false,
      isDistribuidor: false,
      isFabricante: false,
      isVarejo: true,
      responsavel: 'Marcos Oliveira',
      cargo: 'Comprador',
      qualidade: 85,
    },

    // PET - BRASIL
    {
      nome: 'Pet Center Saúde Animal',
      nomeFantasia: 'Pet Center',
      cnpj: '90.123.456/0001-09',
      email: 'contato@petcenter.com.br',
      telefone: '(11) 7890-1234',
      whatsapp: '(11) 94321-0987',
      instagram: '@petcenteroficial',
      continente: 'América do Sul',
      pais: 'Brasil',
      estado: 'SP',
      cidade: 'Guarulhos',
      setor: 'Pet',
      subsetor: 'Pet Shop',
      porte: 'pequena',
      isImportador: false,
      isExportador: false,
      isDistribuidor: false,
      isFabricante: false,
      isVarejo: true,
      responsavel: 'Patrícia Lima',
      cargo: 'Gerente',
      qualidade: 82,
    },

    // TECNOLOGIA - ARGENTINA
    {
      nome: 'TechnoSoft Argentina SA',
      nomeFantasia: 'TechnoSoft',
      email: 'info@technosoft.com.ar',
      telefone: '+54 11 4567-8901',
      site: 'www.technosoft.com.ar',
      continente: 'América do Sul',
      pais: 'Argentina',
      estado: 'Buenos Aires',
      cidade: 'Buenos Aires',
      setor: 'Tecnologia',
      subsetor: 'Software',
      porte: 'media',
      isImportador: true,
      isExportador: true,
      isDistribuidor: false,
      isFabricante: false,
      isVarejo: false,
      responsavel: 'Diego Fernández',
      cargo: 'Director General',
      qualidade: 88,
    },

    // ALIMENTOS - CHILE
    {
      nome: 'Viña del Sur Exportadora',
      nomeFantasia: 'Viña del Sur',
      email: 'export@vinadelsur.cl',
      telefone: '+56 2 3456-7890',
      site: 'www.vinadelsur.cl',
      continente: 'América do Sul',
      pais: 'Chile',
      estado: 'Santiago',
      cidade: 'Santiago',
      setor: 'Alimentos',
      subsetor: 'Vinhos',
      porte: 'grande',
      isImportador: false,
      isExportador: true,
      isDistribuidor: false,
      isFabricante: true,
      isVarejo: false,
      responsavel: 'María González',
      cargo: 'Export Manager',
      qualidade: 94,
    },

    // TECNOLOGIA - EUA
    {
      nome: 'Silicon Valley Tech Inc',
      nomeFantasia: 'SV Tech',
      email: 'contact@svtech.com',
      telefone: '+1 650-123-4567',
      site: 'www.svtech.com',
      continente: 'América do Norte',
      pais: 'Estados Unidos',
      estado: 'California',
      cidade: 'San Francisco',
      setor: 'Tecnologia',
      subsetor: 'SaaS',
      porte: 'grande',
      isImportador: false,
      isExportador: true,
      isDistribuidor: false,
      isFabricante: false,
      isVarejo: false,
      responsavel: 'John Smith',
      cargo: 'VP Sales',
      linkedinContato: 'linkedin.com/in/johnsmith',
      qualidade: 97,
    },

    // VESTUÁRIO - PORTUGAL
    {
      nome: 'Têxteis Lisboa SA',
      nomeFantasia: 'Lisboa Textil',
      email: 'geral@texteislisboa.pt',
      telefone: '+351 21 345-6789',
      site: 'www.texteislisboa.pt',
      continente: 'Europa',
      pais: 'Portugal',
      cidade: 'Lisboa',
      setor: 'Vestuário',
      subsetor: 'Têxtil',
      porte: 'media',
      isImportador: true,
      isExportador: true,
      isDistribuidor: true,
      isFabricante: true,
      isVarejo: false,
      responsavel: 'António Silva',
      cargo: 'Diretor Comercial',
      qualidade: 91,
    },

    // BRINQUEDOS - CHINA
    {
      nome: 'Shenzhen Toys Manufacturing',
      nomeFantasia: 'SZ Toys',
      email: 'sales@sztoys.cn',
      telefone: '+86 755 1234-5678',
      site: 'www.sztoys.cn',
      continente: 'Ásia',
      pais: 'China',
      cidade: 'Shenzhen',
      setor: 'Brinquedos',
      subsetor: 'Fabricação',
      porte: 'grande',
      isImportador: false,
      isExportador: true,
      isDistribuidor: false,
      isFabricante: true,
      isVarejo: false,
      isAtacado: true,
      responsavel: 'Wei Chen',
      cargo: 'Export Director',
      qualidade: 86,
    },

    // Mais empresas brasileiras para ter volume
    ...gerarEmpresasBrasileiras(50),
  ];

  for (const empresa of empresas) {
    await prisma.empresa.create({
      data: empresa,
    });
  }
  console.log('   ✅ Empresas criadas:', empresas.length);

  // =====================
  // RESUMO FINAL
  // =====================
  const totalEmpresas = await prisma.empresa.count();
  const totalPorSetor = await prisma.empresa.groupBy({
    by: ['setor'],
    _count: true,
  });
  const totalPorPais = await prisma.empresa.groupBy({
    by: ['pais'],
    _count: true,
  });

  console.log('\n═══════════════════════════════════════');
  console.log('🎉 SEED CONCLUÍDO COM SUCESSO!');
  console.log('═══════════════════════════════════════');
  console.log('\n📊 ESTATÍSTICAS:');
  console.log(`   Total de empresas: ${totalEmpresas}`);
  console.log('\n   Por setor:');
  totalPorSetor.forEach(s => console.log(`   - ${s.setor}: ${s._count}`));
  console.log('\n   Por país:');
  totalPorPais.forEach(p => console.log(`   - ${p.pais}: ${p._count}`));
  console.log('\n🔐 CREDENCIAIS:');
  console.log('   Admin: admin@easyprospect.com / senha123');
  console.log('   Teste: teste@teste.com / senha123');
  console.log('');
}

// Função para gerar empresas brasileiras aleatórias
function gerarEmpresasBrasileiras(quantidade) {
  const setores = ['Tecnologia', 'Alimentos', 'Vestuário', 'Brinquedos', 'Pet', 'Saúde', 'Beleza', 'Construção'];
  const estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO'];
  const cidades = {
    'SP': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Osasco'],
    'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis'],
    'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem'],
    'RS': ['Porto Alegre', 'Caxias do Sul', 'Canoas'],
    'PR': ['Curitiba', 'Londrina', 'Maringá'],
    'SC': ['Florianópolis', 'Joinville', 'Blumenau'],
    'BA': ['Salvador', 'Feira de Santana'],
    'PE': ['Recife', 'Olinda'],
    'CE': ['Fortaleza', 'Juazeiro do Norte'],
    'GO': ['Goiânia', 'Anápolis'],
  };
  const portes = ['mei', 'micro', 'pequena', 'media', 'grande'];
  const nomes = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Prime', 'Plus', 'Max',
    'Ultra', 'Mega', 'Super', 'Top', 'Master', 'Expert', 'Pro', 'Premium'
  ];
  const sufixos = ['Solutions', 'Tech', 'Brasil', 'Group', 'Services', 'Corp', 'Company', 'Industrial'];

  const empresas = [];

  for (let i = 0; i < quantidade; i++) {
    const estado = estados[Math.floor(Math.random() * estados.length)];
    const cidadesEstado = cidades[estado];
    const setor = setores[Math.floor(Math.random() * setores.length)];
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const sufixo = sufixos[Math.floor(Math.random() * sufixos.length)];

    empresas.push({
      nome: `${nome} ${sufixo} ${setor} Ltda`,
      nomeFantasia: `${nome} ${setor}`,
      email: `contato@${nome.toLowerCase()}${setor.toLowerCase()}.com.br`,
      telefone: `(${Math.floor(Math.random() * 90) + 10}) ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      continente: 'América do Sul',
      pais: 'Brasil',
      estado: estado,
      cidade: cidadesEstado[Math.floor(Math.random() * cidadesEstado.length)],
      setor: setor,
      porte: portes[Math.floor(Math.random() * portes.length)],
      isImportador: Math.random() > 0.7,
      isExportador: Math.random() > 0.8,
      isDistribuidor: Math.random() > 0.6,
      isFabricante: Math.random() > 0.7,
      isVarejo: Math.random() > 0.5,
      qualidade: Math.floor(Math.random() * 20) + 75,
    });
  }

  return empresas;
}

main()
    .catch((e) => {
      console.error('❌ Erro:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });