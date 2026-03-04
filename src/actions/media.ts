"use server";

import fs from "fs";
import path from "path";

type MediaFile = {
    name: string;
    url: string;
    size: string;
    date: string;
    type: "image" | "360";
};

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function getMediaFiles(): Promise<MediaFile[]> {
    const publicDir = path.join(process.cwd(), "public");
    const uploadsDir = path.join(publicDir, "uploads");
    const dir360 = path.join(publicDir, "360");

    const files: MediaFile[] = [];

    // Safe read directory helper
    const readDirSafe = (dirPath: string, type: "image" | "360") => {
        if (!fs.existsSync(dirPath)) return;

        try {
            const items = fs.readdirSync(dirPath);
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                const stat = fs.statSync(itemPath);

                if (stat.isFile() && item !== ".gitkeep") {
                    files.push({
                        name: item,
                        url: `/${type === "image" ? "uploads" : "360"}/${item}`,
                        size: formatBytes(stat.size),
                        date: stat.mtime.toLocaleDateString("fr-FR"),
                        type
                    });
                }
            }
        } catch (error) {
            console.error(`Error reading ${dirPath}:`, error);
        }
    };

    readDirSafe(uploadsDir, "image");
    readDirSafe(dir360, "360");

    // Sort by newest first
    return files.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}
