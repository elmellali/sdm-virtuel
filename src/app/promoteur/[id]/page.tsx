import { getPromoterById } from "@/actions/promoters";
import Navbar from "@/components/public/Navbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Mail, Phone, Globe, ChevronRight, Play, Box, Building2, CheckCircle2, ShieldCheck, Trophy, BadgeCheck } from "lucide-react";
import styles from "./promoter.module.css";

export default async function PromoterPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const promoter = await getPromoterById(resolvedParams.id);

    if (!promoter) {
        notFound();
    }

    // Parse contact text crudely to detect type - just for UI demonstration
    const contactText = promoter.contact;
    const isEmail = contactText.includes("@");
    const isUrl = contactText.startsWith("http") || contactText.includes("www.");

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                {/* Profile Header */}
                <section className={`glass-panel ${styles.profileHeader} animate-fade-in-up`}>
                    <div className={styles.profileContent}>
                        <div className={styles.logoSection}>
                            <div className={styles.logoWrapper}>
                                {promoter.logo ? (
                                    <img src={promoter.logo} alt={promoter.nom} className={styles.logo} />
                                ) : (
                                    <div className={styles.logoPlaceholder}>{promoter.nom.charAt(0)}</div>
                                )}
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <div className={styles.badges}>
                                <span className={styles.badgePrimary}>{promoter.categorie.nom}</span>
                                <span className={styles.badgeSecondary}>ID: {promoter.id.substring(0, 8)}</span>
                            </div>

                            <h1 className="title-gradient" style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0.5rem 0" }}>
                                {promoter.nom}
                            </h1>

                            <div className={styles.metaInfo}>
                                <div className={styles.metaItem}>
                                    <MapPin size={18} />
                                    <span>{promoter.ville.nom}</span>
                                </div>

                                <div className={styles.metaItem}>
                                    <Building2 size={18} />
                                    <span>Depuis 2005</span>
                                </div>

                                <div className={styles.metaItem}>
                                    {isEmail ? <Mail size={18} /> : isUrl ? <Globe size={18} /> : <Phone size={18} />}
                                    <span>{promoter.contact}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className={styles.gridLayout}>
                    {/* Main Content */}
                    <div className={styles.leftColumn}>
                        <div className={`glass-panel ${styles.contentBlock} animate-slide-left delay-100`}>
                            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>À propos</h2>
                            <div className={styles.textContent}>
                                {promoter.description.split("\n").map((paragraph: string, i: number) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>

                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <span className={styles.statValue}>+15</span>
                                    <span className={styles.statLabel}>Années d'expertise</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statValue}>{promoter.projets.length}</span>
                                    <span className={styles.statLabel}>Projets Exclusifs</span>
                                </div>
                            </div>
                        </div>

                        <div className={`glass-panel ${styles.contentBlock} animate-slide-left delay-200`}>
                            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <ShieldCheck className="text-emerald-400" size={20} />
                                Engagements & Services
                            </h2>
                            <ul className={styles.servicesList}>
                                <li className={styles.serviceItem}>
                                    <CheckCircle2 size={18} />
                                    <span>Accompagnement personnalisé de A à Z</span>
                                </li>
                                <li className={styles.serviceItem}>
                                    <CheckCircle2 size={18} />
                                    <span>Garantie d'achèvement et SAV réactif</span>
                                </li>
                                <li className={styles.serviceItem}>
                                    <CheckCircle2 size={18} />
                                    <span>Partenariats bancaires (Taux préférentiels)</span>
                                </li>
                                <li className={styles.serviceItem}>
                                    <Trophy size={18} />
                                    <span>Finitions Premium et matériaux nobles</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column / Projects */}
                    <div className={styles.rightColumn}>
                        <div className={styles.projectsHeader}>
                            <h2 style={{ fontSize: "1.5rem" }}>Projets ({promoter.projets.length})</h2>
                        </div>

                        {promoter.projets.length === 0 ? (
                            <div className={`glass-panel ${styles.emptyProjects} animate-fade-in-up delay-100`}>
                                <p>Aucun projet n'est actuellement exposé.</p>
                            </div>
                        ) : (
                            <div className={styles.projectsList}>
                                {promoter.projets.map((project: any, index: number) => {
                                    const delayClass = `delay-${((index % 5) + 1) * 100}`;
                                    return (
                                        <div key={project.id} className={`glass-panel ${styles.projectCard} animate-fade-in-up ${delayClass}`}>
                                            <div className={styles.projectImageWrapper}>
                                                {project.image360 ? (
                                                    <div className={styles.imageContainer}>
                                                        <img src={project.image360} alt={project.nom} className={styles.projectImage} />
                                                        <div className={styles.playOverlay}>
                                                            <div className={styles.playButton}><Play size={24} color="white" fill="white" /></div>
                                                            <span>Vue 360°</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={styles.noImage}>
                                                        <span>Aperçu non disponible</span>
                                                    </div>
                                                )}
                                                <div className={styles.statusBadge} style={
                                                    project.statut === 'Livré' ? { backgroundColor: 'rgba(16, 185, 129, 0.9)' } :
                                                        project.statut === 'À venir' ? { backgroundColor: 'rgba(245, 158, 11, 0.9)' } : {}
                                                }>
                                                    {project.statut}
                                                </div>
                                            </div>

                                            <div className={styles.projectInfo}>
                                                <h3 className={styles.projectName}>{project.nom}</h3>
                                                <div className={styles.projectLocation} style={{ display: "flex", gap: "1rem" }}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><MapPin size={14} /> {project.localisation}</span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Building2 size={14} /> Résidence</span>
                                                </div>
                                                <p className={styles.projectDesc}>
                                                    {project.description.substring(0, 80)}...
                                                </p>
                                                <div className={styles.projectActionRow}>
                                                    <div className={styles.viewProjectText}>Voir en immersion</div>
                                                    <Link href={`/projet/${project.id}`} className={styles.exploreCubeBtn}>
                                                        <img src="/cube.svg" alt="Voir en immersion" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
