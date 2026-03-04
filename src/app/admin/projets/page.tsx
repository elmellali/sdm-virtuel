import { getProjects, deleteProject } from "@/actions/projects";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import styles from "../promoteurs/promoters.module.css"; // Reuse promoters table style

export default async function ProjectsPage() {
    const projects = await getProjects();

    async function removeProject(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        if (id) {
            await deleteProject(id);
            revalidatePath("/admin/projets");
        }
    }

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: "2rem" }}>Projets 360°</h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Gérez les expositions virtuelles des promoteurs</p>
                </div>

                <Link href="/admin/projets/nouveau" className={styles.addButton}>
                    <Plus size={20} />
                    Ajouter un projet
                </Link>
            </div>

            <div className={`glass-panel ${styles.container}`}>
                {projects.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Aucun projet 360° n'a été ajouté pour le moment.</p>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Illustration</th>
                                    <th>Nom / Promoteur</th>
                                    <th>Localisation</th>
                                    <th>Statut</th>
                                    <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.id}>
                                        <td>
                                            <div className={styles.logoCell}>
                                                {project.image360 ? (
                                                    <img src={project.image360} alt={project.nom} className={styles.logo} />
                                                ) : (
                                                    <div className={styles.logoPlaceholder} title="Aucune image 360">
                                                        360
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className={styles.mainCell}>
                                            <span className={styles.name}>{project.nom}</span>
                                            <span className={styles.contact}>{project.promoter?.nom || 'Inconnu'}</span>
                                        </td>
                                        <td>{project.localisation}</td>
                                        <td>
                                            <span className={styles.badge} style={
                                                project.statut === 'Livré' ? { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' } :
                                                    project.statut === 'À venir' ? { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' } : {}
                                            }>
                                                {project.statut}
                                            </span>
                                        </td>
                                        <td className={styles.actionsCell}>
                                            <div className={styles.actions}>
                                                <Link href={`/projet/${project.id}`} target="_blank" className={styles.actionButton} title="Voir le viewer 360 public">
                                                    <ExternalLink size={18} />
                                                </Link>
                                                <Link href={`/admin/projets/${project.id}/modifier`} className={styles.actionButton} title="Modifier">
                                                    <Pencil size={18} />
                                                </Link>
                                                <form action={removeProject}>
                                                    <input type="hidden" name="id" value={project.id} />
                                                    <button type="submit" className={`${styles.actionButton} ${styles.actionDelete}`} title="Supprimer">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
