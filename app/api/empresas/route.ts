// app/api/empresas/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parâmetros de filtro
        const busca = searchParams.get('busca');
        const continentes = searchParams.get('continentes')?.split(',').filter(Boolean);
        const paises = searchParams.get('paises')?.split(',').filter(Boolean);
        const estados = searchParams.get('estados')?.split(',').filter(Boolean);
        const setores = searchParams.get('setores')?.split(',').filter(Boolean);
        const portes = searchParams.get('portes')?.split(',').filter(Boolean);

        // Tipos de negócio
        const isImportador = searchParams.get('isImportador') === 'true';
        const isExportador = searchParams.get('isExportador') === 'true';
        const isDistribuidor = searchParams.get('isDistribuidor') === 'true';
        const isFabricante = searchParams.get('isFabricante') === 'true';
        const isVarejo = searchParams.get('isVarejo') === 'true';
        const isAtacado = searchParams.get('isAtacado') === 'true';

        // Paginação
        const pagina = parseInt(searchParams.get('pagina') || '1');
        const limite = parseInt(searchParams.get('limite') || '20');
        const skip = (pagina - 1) * limite;

        // Apenas contar (para preview)
        const apenasContar = searchParams.get('apenasContar') === 'true';

        // Construir filtro WHERE
        const where: any = {
            ativo: true,
        };

        // Busca por texto
        if (busca) {
            where.OR = [
                { nome: { contains: busca } },
                { nomeFantasia: { contains: busca } },
                { email: { contains: busca } },
                { cidade: { contains: busca } },
            ];
        }

        // Filtros de localização
        if (continentes && continentes.length > 0) {
            where.continente = { in: continentes };
        }

        if (paises && paises.length > 0) {
            where.pais = { in: paises };
        }

        if (estados && estados.length > 0) {
            where.estado = { in: estados };
        }

        // Filtros de classificação
        if (setores && setores.length > 0) {
            where.setor = { in: setores };
        }

        if (portes && portes.length > 0) {
            where.porte = { in: portes };
        }

        // Filtros de tipo de negócio
        if (isImportador) where.isImportador = true;
        if (isExportador) where.isExportador = true;
        if (isDistribuidor) where.isDistribuidor = true;
        if (isFabricante) where.isFabricante = true;
        if (isVarejo) where.isVarejo = true;
        if (isAtacado) where.isAtacado = true;

        // Contar total
        const total = await prisma.empresa.count({ where });

        // Se apenas contar, retornar aqui
        if (apenasContar) {
            // Calcular preço
            const precoPorContato = calcularPrecoPorContato(paises || []);
            const precoTotal = total * precoPorContato;

            return NextResponse.json({
                success: true,
                total,
                precoPorContato,
                precoTotal,
                creditosNecessarios: total,
            });
        }

        // Buscar empresas
        const empresas = await prisma.empresa.findMany({
            where,
            skip,
            take: limite,
            orderBy: [
                { qualidade: 'desc' },
                { updatedAt: 'desc' },
            ],
            select: {
                id: true,
                nome: true,
                nomeFantasia: true,
                email: true,
                telefone: true,
                whatsapp: true,
                site: true,
                continente: true,
                pais: true,
                estado: true,
                cidade: true,
                setor: true,
                subsetor: true,
                porte: true,
                isImportador: true,
                isExportador: true,
                isDistribuidor: true,
                isFabricante: true,
                isVarejo: true,
                isAtacado: true,
                responsavel: true,
                cargo: true,
                qualidade: true,
                updatedAt: true,
            },
        });

        const totalPaginas = Math.ceil(total / limite);
        const precoPorContato = calcularPrecoPorContato(paises || []);

        return NextResponse.json({
            success: true,
            data: empresas,
            total,
            pagina,
            totalPaginas,
            limite,
            precoPorContato,
            precoTotal: total * precoPorContato,
            creditosNecessarios: total,
        });
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Erro interno ao buscar empresas",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

// Função para calcular preço por contato baseado na região
function calcularPrecoPorContato(paises: string[]): number {
    if (paises.length === 0) return 0.10;

    const paisesLatam = ['Brasil', 'Argentina', 'Chile', 'Colômbia', 'Peru', 'Uruguai', 'Paraguai', 'México'];
    const paisesEuropa = ['Portugal', 'Espanha', 'França', 'Alemanha', 'Itália', 'Reino Unido'];
    const paisesAsia = ['China', 'Japão', 'Coreia do Sul', 'Índia'];

    let maiorPreco = 0.08;

    for (const pais of paises) {
        if (pais === 'Brasil') {
            maiorPreco = Math.max(maiorPreco, 0.08);
        } else if (paisesLatam.includes(pais)) {
            maiorPreco = Math.max(maiorPreco, 0.10);
        } else if (paisesEuropa.includes(pais)) {
            maiorPreco = Math.max(maiorPreco, 0.15);
        } else if (paisesAsia.includes(pais)) {
            maiorPreco = Math.max(maiorPreco, 0.18);
        } else if (pais === 'Estados Unidos' || pais === 'Canadá') {
            maiorPreco = Math.max(maiorPreco, 0.15);
        } else {
            maiorPreco = Math.max(maiorPreco, 0.12);
        }
    }

    return maiorPreco;
}