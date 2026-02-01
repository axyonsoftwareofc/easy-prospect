// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { saveFile, validateFile } from '@/lib/upload';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const tipo = formData.get('tipo') as string || 'listas'; // listas ou amostras

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'Nenhum arquivo enviado' },
                { status: 400 }
            );
        }

        // Validar arquivo
        const validation = validateFile(file);
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, message: validation.error },
                { status: 400 }
            );
        }

        // Salvar arquivo
        const { url, fileName } = await saveFile(file, tipo);

        return NextResponse.json({
            success: true,
            message: 'Arquivo enviado com sucesso',
            data: {
                url,
                fileName,
                originalName: file.name,
                size: file.size,
            }
        });
    } catch (error) {
        console.error('Erro no upload:', error);
        return NextResponse.json(
            { success: false, message: 'Erro ao fazer upload do arquivo' },
            { status: 500 }
        );
    }
}