import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
        }

        // Gérer le nom de fichier
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.name);
        
        // Nettoyer le nom de fichier (enlever caractères spéciaux)
        const safeName = file.name
            .replace(extension, "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
            .replace(/[^a-z0-9]/gi, "_")     // Remplacer tout ce qui n'est pas alphanumérique par _
            .toLowerCase();

        const filename = `${safeName}-${uniqueSuffix}${extension}`;

        // Téléverser vers Vercel Blob
        // Note: BLOB_READ_WRITE_TOKEN doit être configuré sur Vercel/Local
        const blob = await put(`uploads/${filename}`, file, {
            access: 'public',
            addRandomSuffix: false, // On gère déjà l'unicité
        });

        return NextResponse.json({
            success: true,
            url: blob.url
        });

    } catch (error: any) {
        console.error("Critical Upload Error:", error);
        
        // Message spécifique si le token est manquant
        if (error?.message?.includes('BLOB_READ_WRITE_TOKEN')) {
            return NextResponse.json(
                { 
                    error: "Configuration Storage manquante", 
                    details: "Veuillez activer Vercel Blob dans votre tableau de bord." 
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                error: "Erreur lors du téléversement vers le Cloud", 
                details: error?.message || "Erreur inconnue" 
            },
            { status: 500 }
        );
    }
}
