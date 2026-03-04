import { getCategories, createCategory, deleteCategory } from "@/actions/taxonomies";
import { revalidatePath } from "next/cache";
import styles from "../villes/cities.module.css"; // Reuse cities styles for taxonomy
import { Trash2, Plus } from "lucide-react";

export default async function CategoriesPage() {
    const categories = await getCategories();

    async function addCategory(formData: FormData) {
        "use server";
        const nom = formData.get("nom") as string;
        if (nom) {
            await createCategory({ nom });
            revalidatePath("/admin/categories");
        }
    }

    async function removeCategory(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        if (id) {
            await deleteCategory(id);
            revalidatePath("/admin/categories");
        }
    }

    return (
        <div>
            <div className={styles.header}>
                <h1 className="title-gradient" style={{ fontSize: "2rem" }}>Gestion des Catégories</h1>
            </div>

            <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Ajouter une catégorie</h2>
                <form action={addCategory} className={styles.addForm}>
                    <input
                        type="text"
                        name="nom"
                        placeholder="Nom de la catégorie (ex: Ingénierie)"
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.addButton}>
                        <Plus size={20} />
                        Ajouter
                    </button>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Liste des catégories ({categories.length})</h2>

                {categories.length === 0 ? (
                    <p style={{ color: "var(--color-text-muted)" }}>Aucune catégorie enregistrée.</p>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th style={{ width: "100px", textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.nom}</td>
                                        <td style={{ textAlign: "right" }}>
                                            <form action={removeCategory}>
                                                <input type="hidden" name="id" value={category.id} />
                                                <button type="submit" className={styles.deleteButton} title="Supprimer">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
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
