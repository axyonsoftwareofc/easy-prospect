// app/api/empresas/download/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Verificar autenticação
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: 'Não autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { empresaIds, formato = 'csv' } = body;

        if (!empresaIds || !Array.isArray(empresaIds) || empresaIds.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Nenhuma empresa selecionada' },
                { status: 400 }
            );
        }

        // Buscar usuário e verificar créditos
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        const creditosNecessarios = empresaIds.length;

        if (user.creditos < creditosNecessarios) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Créditos insuficientes. Você tem ${user.creditos} créditos, mas precisa de ${creditosNecessarios}.`,
                    creditosAtuais: user.creditos,
                    creditosNecessarios,
                },
                { status: 402 }
            );
        }

        // Buscar empresas
        const empresas = await prisma.empresa.findMany({
            where: {
                id: { in: empresaIds },
                ativo: true,
            },
        });

        if (empresas.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Nenhuma empresa encontrada' },
                { status: 404 }
            );
        }

        // Descontar créditos
        await prisma.user.update({
            where: { id: user.id },
            data: {
                creditos: user.creditos - empresas.length,
            },
        });

        // Registrar download
        await prisma.download.create({
            data: {
                userId: user.id,
                filtros: JSON.stringify({ empresaIds }),
                quantidade: empresas.length,
                creditosUsados: empresas.length,
                formato,
            },
        });

        // Gerar CSV
        if (formato === 'csv') {
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
                'LinkedIn',
                'Instagram',
                'Importador',
                'Exportador',
                'Distribuidor',
                'Fabricante',
                'Varejo',
            ];

            const rows = empresas.map((empresa) => [
                empresa.nome || '',
                empresa.nomeFantasia || '',
                empresa.cnpj || '',
                empresa.email || '',
                empresa.telefone || '',
                empresa.whatsapp || '',
                empresa.site || '',
                empresa.pais || '',
                empresa.estado || '',
                empresa.cidade || '',
                empresa.endereco || '',
                empresa.setor || '',
                empresa.subsetor || '',
                empresa.porte || '',
                empresa.responsavel || '',
                empresa.cargo || '',
                empresa.linkedinEmpresa || '',
                empresa.instagram || '',
                empresa.isImportador ? 'Sim' : 'Não',
                empresa.isExportador ? 'Sim' : 'Não',
                empresa.isDistribuidor ? 'Sim' : 'Não',
                empresa.isFabricante ? 'Sim' : 'Não',
                empresa.isVarejo ? 'Sim' : 'Não',
            ]);

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

            const bom = '\uFEFF';
            const csvWithBom = bom + csvContent;

            return new NextResponse(csvWithBom, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': `attachment; filename="easyprospect-lista-${Date.now()}.csv"`,
                    'X-Creditos-Restantes': (user.creditos - empresas.length).toString(),
                },
            });
        }

        // Retornar dados JSON se não for CSV
        return NextResponse.json({
            success: true,
            message: `Download realizado com sucesso! ${empresas.length} créditos utilizados.`,
            data: empresas,
            creditosRestantes: user.creditos - empresas.length,
        });

    } catch (error) {
        console.error('Erro no download:', error);
        return NextResponse.json(
            { success: false, message: 'Erro ao processar download' },
            { status: 500 }
        );
    }
}