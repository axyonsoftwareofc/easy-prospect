// lib/upload.ts

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Diretório de uploads
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Garantir que o diretório existe
async function ensureUploadDir(subdir: string = '') {
    const dir = path.join(UPLOAD_DIR, subdir);
    if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
    }
    return dir;
}

// Gerar nome único para arquivo
function generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext)
        .replace(/[^a-zA-Z0-9]/g, '-')
        .substring(0, 50);
    return `${baseName}-${timestamp}-${random}${ext}`;
}

// Salvar arquivo
export async function saveFile(
    file: File,
    subdir: string = 'listas'
): Promise<{ url: string; fileName: string }> {
    const dir = await ensureUploadDir(subdir);

    const fileName = generateFileName(file.name);
    const filePath = path.join(dir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    const url = `/uploads/${subdir}/${fileName}`;

    return { url, fileName };
}

// Tipos de arquivo permitidos
export const ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.csv'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): { valid: boolean; error?: string } {
    const ext = path.extname(file.name).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return {
            valid: false,
            error: `Tipo de arquivo não permitido. Use: ${ALLOWED_EXTENSIONS.join(', ')}`
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`
        };
    }

    return { valid: true };
}