// app/api/empresas/stats/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        // Contar por setor
        const porSetor = await prisma.empresa.groupBy({
            by: ['setor'],
            where: { ativo: true },
            _count: true,
            orderBy: { _count: { setor: 'desc' } },
        });

        // Contar por país
        const porPais = await prisma.empresa.groupBy({
            by: ['pais'],
            where: { ativo: true },
            _count: true,
            orderBy: { _count: { pais: 'desc' } },
        });

        // Contar por continente
        const porContinente = await prisma.empresa.groupBy({
            by: ['continente'],
            where: { ativo: true, continente: { not: null } },
            _count: true,
        });

        // Contar por estado (Brasil)
        const porEstado = await prisma.empresa.groupBy({
            by: ['estado'],
            where: { ativo: true, pais: 'Brasil', estado: { not: null } },
            _count: true,
            orderBy: { _count: { estado: 'desc' } },
        });

        // Contar por porte
        const porPorte = await prisma.empresa.groupBy({
            by: ['porte'],
            where: { ativo: true, porte: { not: null } },
            _count: true,
        });

        // Contar tipos de negócio
        const importadores = await prisma.empresa.count({ where: { ativo: true, isImportador: true } });
        const exportadores = await prisma.empresa.count({ where: { ativo: true, isExportador: true } });
        const distribuidores = await prisma.empresa.count({ where: { ativo: true, isDistribuidor: true } });
        const fabricantes = await prisma.empresa.count({ where: { ativo: true, isFabricante: true } });
        const varejo = await prisma.empresa.count({ where: { ativo: true, isVarejo: true } });
        const atacado = await prisma.empresa.count({ where: { ativo: true, isAtacado: true } });

        // Total geral
        const total = await prisma.empresa.count({ where: { ativo: true } });

        return NextResponse.json({
            success: true,
            data: {
                total,
                porSetor: porSetor.map(s => ({ nome: s.setor, count: s._count })),
                porPais: porPais.map(p => ({ nome: p.pais, count: p._count })),
                porContinente: porContinente.map(c => ({ nome: c.continente, count: c._count })),
                porEstado: porEstado.map(e => ({ nome: e.estado, count: e._count })),
                porPorte: porPorte.map(p => ({ nome: p.porte, count: p._count })),
                tiposNegocio: {
                    importadores,
                    exportadores,
                    distribuidores,
                    fabricantes,
                    varejo,
                    atacado,
                },
            },
        });
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        return NextResponse.json(
            { success: false, message: "Erro ao buscar estatísticas" },
            { status: 500 }
        );
    }
}