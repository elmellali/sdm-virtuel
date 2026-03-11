import { getProjectById } from "@/actions/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Calendar, Compass, Box, Home, Phone, Download, CheckCircle2, Landmark } from "lucide-react";
import ProjectViewer360 from "@/components/public/ProjectViewer360";
import Particles from "@/components/public/Particles";
import Navbar from "@/components/public/Navbar";
import styles from "./project.module.css";
import PromoterBanksClient from "@/components/public/PromoterBanksClient";

// Force absolute layout for this specific page to maximize viewer space
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const project = await getProjectById(resolvedParams.id) as any;

    if (!project) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <main className={styles.mainWrapper}>
                <Particles count={40} />

                <div className={styles.splitContainer}>
                    {/* Left Panel: Information */}
                    <div className={`glass-panel ${styles.leftPanel} animate-slide-left`}>
                        <div>
                            <Link href={`/promoteur/${project.promoterId}`} className={styles.backLink}>
                                <ArrowLeft size={16} /> Retour au promoteur
                            </Link>
                        </div>

                        <div className={styles.statusBadge}>
                            <CheckCircle2 size={16} style={{ marginRight: "0.5rem" }} />
                            {project.statut}
                        </div>

                        <h1 className={`title-gradient ${styles.title}`}>
                            {project.nom}
                        </h1>

                        <p className={styles.description}>
                            {project.description}
                        </p>

                        <div className={styles.featuresGrid}>
                            <div className={styles.featureCard}>
                                <Building2 size={24} className={styles.featureIcon} />
                                <span className={styles.featureLabel}>Promoteur</span>
                                <span className={styles.featureValue}>{project.promoter.nom}</span>
                            </div>
                            <div className={styles.featureCard}>
                                <MapPin size={24} className={styles.featureIcon} />
                                <span className={styles.featureLabel}>Localisation</span>
                                <span className={styles.featureValue}>{project.localisation}</span>
                            </div>
                            <div className={styles.featureCard}>
                                <Home size={24} className={styles.featureIcon} />
                                <span className={styles.featureLabel}>Type de bien</span>
                                <span className={styles.featureValue}>Résidence Premium</span>
                            </div>
                            <div className={styles.featureCard}>
                                <Compass size={24} className={styles.featureIcon} />
                                <span className={styles.featureLabel}>Superficie</span>
                                <span className={styles.featureValue}>{project.surface ? `${project.surface} m²` : "Sur demande"}</span>
                            </div>
                            <div className={styles.featureCard}>
                                <Box size={24} className={styles.featureIcon} />
                                <span className={styles.featureLabel}>Unités</span>
                                <span className={styles.featureValue}>45 unités</span>
                            </div>
                            <div className={styles.featureCard}>
                                <Calendar size={24} className={styles.featureIcon} />
                                <span className={styles.featureLabel}>Livraison</span>
                                <span className={styles.featureValue}>{project.dateLivraison ? new Date(project.dateLivraison).getFullYear() : "Immédiate"}</span>
                            </div>
                        </div>

                        {project.banks && project.banks.length > 0 && (
                            <div style={{ marginBottom: "2.5rem" }}>
                                <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "white" }}>
                                    <Landmark className="text-emerald-400" size={20} />
                                    Partenaires Financiers
                                </h2>
                                <PromoterBanksClient banks={project.banks} promoterName={project.nom} />
                            </div>
                        )}

                        <div className={styles.actionContainer}>
                            <a href={`mailto:${project.promoter.contact}`} className={`${styles.primaryBtn} animate-pulse`}>
                                <Phone size={18} /> Contacter le promoteur
                            </a>
                            {project.brochure && (
                                <a href={project.brochure} target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn}>
                                    <Download size={18} /> Télécharger la brochure
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Immersive Viewer */}
                    <div className={`${styles.rightPanel} animate-fade-in delay-300`}>
                        {project.image360 ? (
                            <ProjectViewer360 imageUrl={project.image360} projectName={project.nom} />
                        ) : (
                            <div style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                gap: "1rem",
                                color: "var(--color-text-muted)",
                                background: "rgba(0,0,0,0.5)"
                            }}>
                                <p style={{ fontSize: "1.25rem" }}>Aperçu 360° non disponible.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
