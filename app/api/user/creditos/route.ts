// app/api/user/creditos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: 'Não autorizado' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                plano: true,
                creditos: true,
                _count: {
                    select: { downloads: true }
                }
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                creditos: user.creditos,
                plano: user.plano,
                totalDownloads: user._count.downloads,
            },
        });

    } catch (error) {
        console.error('Erro ao buscar créditos:', error);
        return NextResponse.json(
            { success: false, message: 'Erro ao buscar créditos' },
            { status: 500 }
        );
    }
}