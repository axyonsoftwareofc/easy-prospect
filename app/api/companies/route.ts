// app/api/companies/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/companies - Lista todas as empresas (usa o modelo Empresa)
export async function GET(request: NextRequest) {
    try {
        const empresas = await prisma.empresa.findMany({
            where: { ativo: true },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        // Mapear para formato esperado pelo dashboard antigo
        const companies = empresas.map(e => ({
            id: e.id,
            name: e.nome,
            email: e.email,
            phone: e.telefone,
            industry: e.setor,
            size: e.porte,
            description: e.subsetor,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
        }));

        return NextResponse.json({
            success: true,
            data: companies,
            count: companies.length,
        });
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        return NextResponse.json(
            { success: false, message: "Erro interno ao buscar empresas" },
            { status: 500 }
        );
    }
}

// POST /api/companies - Cria uma nova empresa
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name || !body.email) {
            return NextResponse.json(
                { success: false, message: "Nome e email são obrigatórios" },
                { status: 400 }
            );
        }

        const empresa = await prisma.empresa.create({
            data: {
                nome: body.name,
                email: body.email,
                telefone: body.phone || null,
                setor: body.industry || "Outro",
                porte: body.size || null,
                subsetor: body.description || null,
                pais: "Brasil",
            },
        });

        return NextResponse.json({
            success: true,
            message: "Empresa criada com sucesso",
            data: {
                id: empresa.id,
                name: empresa.nome,
                email: empresa.email,
                phone: empresa.telefone,
                industry: empresa.setor,
                size: empresa.porte,
                description: empresa.subsetor,
            },
        }, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { success: false, message: "Este email já está cadastrado" },
                { status: 409 }
            );
        }

        console.error("Erro ao criar empresa:", error);
        return NextResponse.json(
            { success: false, message: "Erro interno ao criar empresa" },
            { status: 500 }
        );
    }
}