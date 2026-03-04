import { getProjects } from "@/actions/projects";
import Navbar from "@/components/public/Navbar";
import Particles from "@/components/public/Particles";
import Link from "next/link";
import { MapPin, Box, ArrowRight, Home } from "lucide-react";
import styles from "./projets.module.css";

export const metadata = {
    title: "Projets Immobiliers | SDM Virtuel",
    description: "Explorez les meilleurs projets immobiliers du Maroc en visite virtuelle 360°.",
};

export default async function ProjetsPage() {
    const projects = await getProjects();

    const getStatusClass = (status: string) => {
        if (status?.toLowerCase() === "livré") return styles.livré;
        if (status?.toLowerCase() === "à venir") return styles.aveniri;
        return "";
    };

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <Particles count={40} />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <span className={styles.subtitle}>Galerie d'exception</span>
                        <h1 className={`title-gradient ${styles.title}`}>Les Projets Immobiliers</h1>
                        <p className={styles.text}>
                            Plongez au cœur des résidences les plus prisées du Maroc grâce à notre technologie de visite virtuelle et découvrez votre futur lieu de vie ou d'investissement.
                        </p>
                    </div>

                    <div className={styles.grid}>
                        {projects.map((project, index) => {
                            const delayClass = `delay-${((index % 5) + 1) * 100}`;
                            return (
                                <Link href={`/projet/${project.id}`} key={project.id} className={`${styles.card} animate-fade-in-up ${delayClass}`}>
                                    <div className={styles.imageContainer}>
                                        <div className={`${styles.statusBadge} ${getStatusClass(project.statut)}`}>
                                            {project.statut}
                                        </div>
                                        {project.image360 ? (
                                            <img
                                                src={project.image360}
                                                alt={project.nom}
                                                className={styles.image}
                                            />
                                        ) : (
                                            <div style={{ color: "rgba(255,255,255,0.5)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                                                <Home size={40} />
                                                <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Aperçu non disponible</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.info}>
                                        <h3 className={styles.projectName}>{project.nom}</h3>
                                        <div className={styles.promoterName}>Par {project.promoter?.nom || "Promoteur inconnu"}</div>

                                        <div className={styles.detailsGrid}>
                                            <div className={styles.detailItem}>
                                                <MapPin size={16} className={styles.detailIcon} />
                                                <span>{project.localisation}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <Box size={16} className={styles.detailIcon} />
                                                <span>{project.surface ? `${project.surface} m²` : "NC"}</span>
                                            </div>
                                        </div>

                                        <div className={styles.actionRow}>
                                            <span className={styles.exploreBtn}>
                                                Visiter en 360° <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}

                        {projects.length === 0 && (
                            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "var(--color-text-muted)" }}>
                                Aucun projet n'est actuellement disponible.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
