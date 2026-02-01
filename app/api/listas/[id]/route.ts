// app/api/listas/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/listas/[id] - Busca uma lista específica
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const lista = await prisma.lista.findUnique({
            where: { id },
        });

        if (!lista) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lista não encontrada",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: lista,
        });
    } catch (error) {
        console.error("Erro ao buscar lista:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Erro interno ao buscar lista",
            },
            { status: 500 }
        );
    }
}

// PUT /api/listas/[id] - Atualiza uma lista
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        const lista = await prisma.lista.update({
            where: { id },
            data: {
                nome: body.nome,
                descricao: body.descricao,
                segmentos: body.segmentos ? JSON.stringify(body.segmentos) : undefined,
                regioes: body.regioes ? JSON.stringify(body.regioes) : undefined,
                paises: body.paises ? JSON.stringify(body.paises) : undefined,
                quantidade: body.quantidade,
                preco: body.preco,
                precoDesconto: body.precoDesconto,
                camposInclusos: body.camposInclusos ? JSON.stringify(body.camposInclusos) : undefined,
                taxaValidacao: body.taxaValidacao,
                arquivoUrl: body.arquivoUrl,
                amostraUrl: body.amostraUrl,
                imagemUrl: body.imagemUrl,
                destaque: body.destaque,
                ativo: body.ativo,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Lista atualizada com sucesso",
            data: lista,
        });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lista não encontrada",
                },
                { status: 404 }
            );
        }

        console.error("Erro ao atualizar lista:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Erro interno ao atualizar lista",
            },
            { status: 500 }
        );
    }
}

// DELETE /api/listas/[id] - Remove uma lista
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        await prisma.lista.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Lista excluída com sucesso",
        });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lista não encontrada",
                },
                { status: 404 }
            );
        }

        console.error("Erro ao excluir lista:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Erro interno ao excluir lista",
            },
            { status: 500 }
        );
    }
}