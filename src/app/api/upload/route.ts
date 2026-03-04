import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Gérer le nom de fichier
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.name);
        const filename = file.name.replace(extension, "") + "-" + uniqueSuffix + extension;

        // S'assurer que le dossier public/uploads existe
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Erreur lors du téléversement du fichier" },
            { status: 500 }
        );
    }
}
