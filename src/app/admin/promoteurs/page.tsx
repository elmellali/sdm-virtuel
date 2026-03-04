import { getPromoters, deletePromoter } from "@/actions/promoters";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import styles from "./promoters.module.css";

export default async function PromotersPage() {
    const promoters = await getPromoters();

    async function removePromoter(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        if (id) {
            await deletePromoter(id);
            revalidatePath("/admin/promoteurs");
        }
    }

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: "2rem" }}>Promoteurs</h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Gérez les entreprises présentes sur la plateforme</p>
                </div>

                <Link href="/admin/promoteurs/nouveau" className={styles.addButton}>
                    <Plus size={20} />
                    Ajouter un promoteur
                </Link>
            </div>

            <div className={`glass-panel ${styles.container}`}>
                {promoters.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Aucun promoteur n'a été ajouté pour le moment.</p>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Logo</th>
                                    <th>Nom</th>
                                    <th>Catégorie</th>
                                    <th>Ville</th>
                                    <th>Projets</th>
                                    <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promoters.map((promoter) => (
                                    <tr key={promoter.id}>
                                        <td>
                                            <div className={styles.logoCell}>
                                                {promoter.logo ? (
                                                    <img src={promoter.logo} alt={promoter.nom} className={styles.logo} />
                                                ) : (
                                                    <div className={styles.logoPlaceholder}>
                                                        {promoter.nom.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className={styles.mainCell}>
                                            <span className={styles.name}>{promoter.nom}</span>
                                            <span className={styles.contact}>{promoter.contact}</span>
                                        </td>
                                        <td>
                                            <span className={styles.badge}>{promoter.categorie.nom}</span>
                                        </td>
                                        <td>{promoter.ville.nom}</td>
                                        <td>
                                            <span className={styles.countBadge}>{promoter._count.projets}</span>
                                        </td>
                                        <td className={styles.actionsCell}>
                                            <div className={styles.actions}>
                                                <Link href={`/promoteur/${promoter.id}`} target="_blank" className={styles.actionButton} title="Voir la fiche publique">
                                                    <ExternalLink size={18} />
                                                </Link>
                                                <Link href={`/admin/promoteurs/${promoter.id}/modifier`} className={styles.actionButton} title="Modifier">
                                                    <Pencil size={18} />
                                                </Link>
                                                <form action={removePromoter}>
                                                    <input type="hidden" name="id" value={promoter.id} />
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
