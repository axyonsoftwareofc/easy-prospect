// app/api/export/pdf/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parâmetros de filtro
        const continentes = searchParams.get('continentes')?.split(',').filter(Boolean);
        const paises = searchParams.get('paises')?.split(',').filter(Boolean);
        const estados = searchParams.get('estados')?.split(',').filter(Boolean);
        const setores = searchParams.get('setores')?.split(',').filter(Boolean);
        const portes = searchParams.get('portes')?.split(',').filter(Boolean);

        const isImportador = searchParams.get('isImportador') === 'true';
        const isExportador = searchParams.get('isExportador') === 'true';
        const isDistribuidor = searchParams.get('isDistribuidor') === 'true';
        const isFabricante = searchParams.get('isFabricante') === 'true';
        const isVarejo = searchParams.get('isVarejo') === 'true';
        const isAtacado = searchParams.get('isAtacado') === 'true';

        const preview = searchParams.get('preview') === 'true';
        const limite = preview ? 10 : 100;

        // Construir filtro WHERE
        const where: any = { ativo: true };

        if (continentes && continentes.length > 0) where.continente = { in: continentes };
        if (paises && paises.length > 0) where.pais = { in: paises };
        if (estados && estados.length > 0) where.estado = { in: estados };
        if (setores && setores.length > 0) where.setor = { in: setores };
        if (portes && portes.length > 0) where.porte = { in: portes };
        if (isImportador) where.isImportador = true;
        if (isExportador) where.isExportador = true;
        if (isDistribuidor) where.isDistribuidor = true;
        if (isFabricante) where.isFabricante = true;
        if (isVarejo) where.isVarejo = true;
        if (isAtacado) where.isAtacado = true;

        // Buscar empresas
        const empresas = await prisma.empresa.findMany({
            where,
            take: limite,
            orderBy: { qualidade: 'desc' },
        });

        const total = await prisma.empresa.count({ where });

        // Função para ocultar dados
        const ocultarDado = (dado: string | null, tipo: 'email' | 'telefone' | 'texto') => {
            if (!dado) return '-';
            if (!preview) return dado;

            if (tipo === 'email') {
                const [user, domain] = dado.split('@');
                return domain ? `${user.substring(0, 2)}***@${domain}` : dado;
            }
            if (tipo === 'telefone') {
                return dado.substring(0, 6) + '***-****';
            }
            return dado.substring(0, 3) + '***';
        };

        // Gerar HTML para PDF
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EasyProspect - Lista de Empresas</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-size: 10px;
      color: #333;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #3b82f6;
    }
    .header h1 {
      font-size: 24px;
      color: #3b82f6;
      margin-bottom: 5px;
    }
    .header p {
      color: #666;
      font-size: 12px;
    }
    .summary {
      background: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .summary h2 {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .summary-grid {
      display: flex;
      gap: 20px;
    }
    .summary-item {
      flex: 1;
    }
    .summary-item .label {
      color: #666;
      font-size: 10px;
    }
    .summary-item .value {
      font-size: 16px;
      font-weight: bold;
      color: #3b82f6;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #3b82f6;
      color: white;
      padding: 10px 8px;
      text-align: left;
      font-size: 9px;
      text-transform: uppercase;
    }
    td {
      padding: 8px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 9px;
    }
    tr:nth-child(even) {
      background: #f9fafb;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8px;
      font-weight: bold;
    }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-purple { background: #f3e8ff; color: #7e22ce; }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 9px;
    }
    ${preview ? `
    .preview-notice {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
      color: #92400e;
    }
    ` : ''}
  </style>
</head>
<body>
  <div class="header">
    <h1>EasyProspect</h1>
    <p>Lista de Empresas - Gerada em ${new Date().toLocaleDateString('pt-BR')}</p>
  </div>

  ${preview ? `
  <div class="preview-notice">
    <strong>⚠️ VERSÃO PREVIEW</strong> - Dados parcialmente ocultos. Adquira a lista completa para acesso total.
  </div>
  ` : ''}

  <div class="summary">
    <h2>Resumo</h2>
    <div class="summary-grid">
      <div class="summary-item">
        <div class="label">Total de Empresas</div>
        <div class="value">${total.toLocaleString()}</div>
      </div>
      <div class="summary-item">
        <div class="label">Exibindo</div>
        <div class="value">${empresas.length}</div>
      </div>
      <div class="summary-item">
        <div class="label">Filtros</div>
        <div class="value">${[
            ...(paises || []),
            ...(setores || []),
        ].join(', ') || 'Todos'}</div>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Empresa</th>
        <th>Email</th>
        <th>Telefone</th>
        <th>Cidade/Estado</th>
        <th>Setor</th>
        <th>Tipo</th>
      </tr>
    </thead>
    <tbody>
      ${empresas.map(empresa => `
        <tr>
          <td>
            <strong>${empresa.nome}</strong>
            ${empresa.responsavel ? `<br><small>${ocultarDado(empresa.responsavel, 'texto')}</small>` : ''}
          </td>
          <td>${ocultarDado(empresa.email, 'email')}</td>
          <td>${ocultarDado(empresa.telefone, 'telefone')}</td>
          <td>${empresa.cidade || '-'}, ${empresa.estado || '-'}<br><small>${empresa.pais}</small></td>
          <td><span class="badge badge-blue">${empresa.setor}</span></td>
          <td>
            ${empresa.isImportador ? '<span class="badge badge-green">IMP</span> ' : ''}
            ${empresa.isExportador ? '<span class="badge badge-purple">EXP</span> ' : ''}
            ${empresa.isDistribuidor ? '<span class="badge badge-blue">DIST</span> ' : ''}
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Documento gerado por EasyProspect - www.easyprospect.com.br</p>
    <p>© ${new Date().getFullYear()} Todos os direitos reservados</p>
  </div>
</body>
</html>
    `;

        // Por enquanto, retornar como HTML (para PDF real, precisaria de uma lib como puppeteer)
        // Vamos retornar HTML que pode ser impresso como PDF pelo navegador
        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return NextResponse.json(
            { success: false, message: 'Erro ao gerar PDF' },
            { status: 500 }
        );
    }
}