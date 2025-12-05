import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT /api/companies/[id] - Atualiza uma empresa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    const company = await prisma.company.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || "",
        industry: body.industry || "",
        size: body.size || "",
        description: body.description || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Empresa atualizada com sucesso",
      data: company,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Empresa não encontrada",
        },
        { status: 404 }
      );
    }

    // Erro de email duplicado
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "Este email já está cadastrado por outra empresa",
        },
        { status: 409 }
      );
    }

    console.error("Erro ao atualizar empresa:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao atualizar empresa",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/companies/[id] - Remove uma empresa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Empresa excluída com sucesso",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Empresa não encontrada",
        },
        { status: 404 }
      );
    }

    console.error("Erro ao excluir empresa:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao excluir empresa",
        error: error.message,
      },
      { status: 500 }
    );
  }
}