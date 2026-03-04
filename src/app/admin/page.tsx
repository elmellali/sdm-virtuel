import { prisma } from "@/lib/prisma";
import { Building2, FolderOpen, MapPin, Tags } from "lucide-react";
import styles from "./dashboard.module.css";

export default async function AdminDashboardPage() {
    const [promotersCount, projectsCount, citiesCount, categoriesCount] = await Promise.all([
        prisma.promoter.count(),
        prisma.project.count(),
        prisma.city.count(),
        prisma.category.count(),
    ]);

    const stats = [
        { name: "Promoteurs", value: promotersCount, icon: Building2, color: "#3b82f6" },
        { name: "Projets 360°", value: projectsCount, icon: FolderOpen, color: "#10b981" },
        { name: "Villes", value: citiesCount, icon: MapPin, color: "#f59e0b" },
        { name: "Catégories", value: categoriesCount, icon: Tags, color: "#8b5cf6" },
    ];

    return (
        <div>
            <h1 className="title-gradient" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Tableau de bord</h1>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                Bienvenue sur l'interface d'administration de SDM virtuel.
            </p>

            <div className={styles.grid}>
                {stats.map((stat) => (
                    <div key={stat.name} className={`glass-panel ${styles.card}`}>
                        <div className={styles.iconWrapper} style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className={styles.statName}>{stat.name}</p>
                            <p className={styles.statValue}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.recentSection}>
                <div className={`glass-panel ${styles.activityCard}`}>
                    <h2 className="title-gradient" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Activité récente</h2>
                    <p style={{ color: "var(--color-text-muted)" }}>
                        Aucune activité récente à afficher pour le moment.
                    </p>
                </div>
            </div>
        </div>
    );
}
