import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/companies - Lista todas as empresas
export async function GET(request: NextRequest) {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: companies,
        count: companies.length,
      },
      { status: 200 }
    );
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

// POST /api/companies - Cria uma nova empresa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.name || !body.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Nome e email são obrigatórios",
        },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || "",
        industry: body.industry || "",
        size: body.size || "",
        description: body.description || "",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Empresa criada com sucesso",
        data: company,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Erro de email duplicado
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "Este email já está cadastrado",
        },
        { status: 409 }
      );
    }

    console.error("Erro ao criar empresa:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao criar empresa",
        error: error.message,
      },
      { status: 500 }
    );
  }
}