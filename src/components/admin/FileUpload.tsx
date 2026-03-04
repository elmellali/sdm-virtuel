"use client";

import { useState } from "react";
import styles from "./upload.module.css";
import { UploadCloud, Loader2 } from "lucide-react";

interface FileUploadProps {
    onUploadSuccess: (url: string) => void;
    accept?: string;
    label?: string;
    currentImageUrl?: string | null;
}

export default function FileUpload({
    onUploadSuccess,
    accept = "image/*",
    label = "Téléverser une image",
    currentImageUrl
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError("");

        // Preview
        if (file.type.startsWith("image/")) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erreur de téléversement");
            }

            onUploadSuccess(data.url);
        } catch (err: any) {
            setError(err.message);
            setPreview(currentImageUrl || null);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            {preview && (
                <div className={styles.previewContainer}>
                    <img src={preview} alt="Prévisualisation" className={styles.preview} />
                </div>
            )}

            <label className={styles.uploadArea}>
                <input
                    type="file"
                    className={styles.hiddenInput}
                    accept={accept}
                    onChange={handleFileChange}
                    disabled={isUploading}
                />

                <div className={styles.uploadContent}>
                    {isUploading ? (
                        <>
                            <Loader2 className={styles.spinner} size={24} />
                            <span>Téléversement en cours...</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud size={24} className={styles.icon} />
                            <span>{label}</span>
                            <span className={styles.subtext}>Cliquez ou glissez un fichier ici</span>
                        </>
                    )}
                </div>
            </label>

            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}
