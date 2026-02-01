// app/api/export/csv/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parâmetros de filtro (mesmos da API de empresas)
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

        // Preview mode (apenas 10 registros com dados ocultos)
        const preview = searchParams.get('preview') === 'true';
        const limite = preview ? 10 : 1000; // Limite máximo por segurança

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
            select: {
                nome: true,
                nomeFantasia: true,
                cnpj: true,
                email: true,
                telefone: true,
                whatsapp: true,
                site: true,
                pais: true,
                estado: true,
                cidade: true,
                endereco: true,
                setor: true,
                subsetor: true,
                porte: true,
                responsavel: true,
                cargo: true,
                isImportador: true,
                isExportador: true,
                isDistribuidor: true,
                isFabricante: true,
                isVarejo: true,
            },
        });

        // Função para ocultar dados no preview
        const ocultarDado = (dado: string | null, tipo: 'email' | 'telefone' | 'texto') => {
            if (!dado) return '';
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

        // Gerar CSV
        const headers = [
            'Nome',
            'Nome Fantasia',
            'CNPJ',
            'Email',
            'Telefone',
            'WhatsApp',
            'Site',
            'País',
            'Estado',
            'Cidade',
            'Endereço',
            'Setor',
            'Subsetor',
            'Porte',
            'Responsável',
            'Cargo',
            'Importador',
            'Exportador',
            'Distribuidor',
            'Fabricante',
            'Varejo',
        ];

        const rows = empresas.map((empresa) => [
            empresa.nome || '',
            empresa.nomeFantasia || '',
            preview ? ocultarDado(empresa.cnpj, 'texto') : (empresa.cnpj || ''),
            ocultarDado(empresa.email, 'email'),
            ocultarDado(empresa.telefone, 'telefone'),
            ocultarDado(empresa.whatsapp, 'telefone'),
            preview ? ocultarDado(empresa.site, 'texto') : (empresa.site || ''),
            empresa.pais || '',
            empresa.estado || '',
            empresa.cidade || '',
            preview ? '' : (empresa.endereco || ''),
            empresa.setor || '',
            empresa.subsetor || '',
            empresa.porte || '',
            preview ? ocultarDado(empresa.responsavel, 'texto') : (empresa.responsavel || ''),
            empresa.cargo || '',
            empresa.isImportador ? 'Sim' : 'Não',
            empresa.isExportador ? 'Sim' : 'Não',
            empresa.isDistribuidor ? 'Sim' : 'Não',
            empresa.isFabricante ? 'Sim' : 'Não',
            empresa.isVarejo ? 'Sim' : 'Não',
        ]);

        // Escapar campos para CSV
        const escapeCsvField = (field: string) => {
            if (field.includes(',') || field.includes('"') || field.includes('\n')) {
                return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
        };

        const csvContent = [
            headers.map(escapeCsvField).join(','),
            ...rows.map(row => row.map(escapeCsvField).join(','))
        ].join('\n');

        // Adicionar BOM para Excel reconhecer UTF-8
        const bom = '\uFEFF';
        const csvWithBom = bom + csvContent;

        // Retornar arquivo CSV
        const filename = preview
            ? `easyprospect-preview-${Date.now()}.csv`
            : `easyprospect-lista-${Date.now()}.csv`;

        return new NextResponse(csvWithBom, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Erro ao gerar CSV:', error);
        return NextResponse.json(
            { success: false, message: 'Erro ao gerar CSV' },
            { status: 500 }
        );
    }
}