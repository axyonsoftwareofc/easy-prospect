// app/api/listas/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/listas - Lista todas as listas com filtros
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parâmetros de filtro
        const segmento = searchParams.get('segmento');
        const regiao = searchParams.get('regiao');
        const pais = searchParams.get('pais');
        const busca = searchParams.get('busca');
        const precoMin = searchParams.get('precoMin');
        const precoMax = searchParams.get('precoMax');
        const destaque = searchParams.get('destaque');

        // Buscar todas as listas ativas
        let listas = await prisma.lista.findMany({
            where: {
                ativo: true,
            },
            orderBy: [
                { destaque: 'desc' },
                { createdAt: 'desc' }
            ],
        });

        // Aplicar filtros (SQLite não suporta JSON queries, então filtramos em memória)
        if (segmento) {
            listas = listas.filter(lista => {
                const segmentos = JSON.parse(lista.segmentos);
                return segmentos.includes(segmento);
            });
        }

        if (regiao) {
            listas = listas.filter(lista => {
                const regioes = JSON.parse(lista.regioes);
                return regioes.includes(regiao);
            });
        }

        if (pais) {
            listas = listas.filter(lista => {
                const paises = JSON.parse(lista.paises);
                return paises.includes(pais);
            });
        }

        if (busca) {
            const termoBusca = busca.toLowerCase();
            listas = listas.filter(lista =>
                lista.nome.toLowerCase().includes(termoBusca) ||
                lista.descricao?.toLowerCase().includes(termoBusca)
            );
        }

        if (precoMin) {
            listas = listas.filter(lista => lista.preco >= parseFloat(precoMin));
        }

        if (precoMax) {
            listas = listas.filter(lista => lista.preco <= parseFloat(precoMax));
        }

        if (destaque === 'true') {
            listas = listas.filter(lista => lista.destaque);
        }

        return NextResponse.json({
            success: true,
            data: listas,
            count: listas.length,
        });
    } catch (error) {
        console.error("Erro ao buscar listas:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Erro interno ao buscar listas",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

// POST /api/listas - Cria uma nova lista (admin)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validação básica
        if (!body.nome || !body.segmentos || !body.quantidade || !body.preco) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Nome, segmentos, quantidade e preço são obrigatórios",
                },
                { status: 400 }
            );
        }

        const lista = await prisma.lista.create({
            data: {
                nome: body.nome,
                descricao: body.descricao || null,
                segmentos: JSON.stringify(body.segmentos),
                regioes: JSON.stringify(body.regioes || []),
                paises: JSON.stringify(body.paises || []),
                quantidade: body.quantidade,
                preco: body.preco,
                precoDesconto: body.precoDesconto || null,
                camposInclusos: JSON.stringify(body.camposInclusos || ['email', 'telefone']),
                taxaValidacao: body.taxaValidacao || 95,
                arquivoUrl: body.arquivoUrl || null,
                amostraUrl: body.amostraUrl || null,
                imagemUrl: body.imagemUrl || null,
                destaque: body.destaque || false,
                ativo: body.ativo !== false,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Lista criada com sucesso",
                data: lista,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao criar lista:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Erro interno ao criar lista",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}