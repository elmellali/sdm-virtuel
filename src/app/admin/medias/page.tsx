import { getMediaFiles } from "@/actions/media";
import styles from "./media.module.css";
import { Image as ImageIcon, Box } from "lucide-react";

export default async function MediaPage() {
    const files = await getMediaFiles();

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: "2rem" }}>Médiathèque</h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Explorez les images et scènes 360° ({files.length} fichiers)</p>
                </div>
            </div>

            <div className={`glass-panel`} style={{ padding: "1.5rem" }}>
                {files.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>
                        <p>Aucun fichier multimédia trouvé dans les dossiers <code>public/uploads</code> et <code>public/360</code>.</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {files.map((file, index) => (
                            <div key={index} className={styles.card}>
                                <div className={styles.imageContainer}>
                                    <span className={`${styles.badge} ${file.type === '360' ? styles.badge360 : ''}`}>
                                        {file.type.toUpperCase()}
                                    </span>
                                    {file.type === "image" ? (
                                        <img src={file.url} alt={file.name} loading="lazy" className={styles.image} />
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: "var(--color-primary)" }}>
                                            <Box size={40} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>SCÈNE 360</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.info}>
                                    <div className={styles.name} title={file.name}>{file.name}</div>
                                    <div className={styles.meta}>
                                        <span>{file.size}</span>
                                        <span>{file.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
