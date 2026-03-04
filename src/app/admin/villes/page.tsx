import { getCities, createCity, deleteCity } from "@/actions/taxonomies";
import { revalidatePath } from "next/cache";
import styles from "./cities.module.css";
import { Trash2, Plus } from "lucide-react";

export default async function CitiesPage() {
    const cities = await getCities();

    async function addCity(formData: FormData) {
        "use server";
        const nom = formData.get("nom") as string;
        if (nom) {
            await createCity({ nom });
            revalidatePath("/admin/villes");
        }
    }

    async function removeCity(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        if (id) {
            await deleteCity(id);
            revalidatePath("/admin/villes");
        }
    }

    return (
        <div>
            <div className={styles.header}>
                <h1 className="title-gradient" style={{ fontSize: "2rem" }}>Gestion des Villes</h1>
            </div>

            <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Ajouter une ville</h2>
                <form action={addCity} className={styles.addForm}>
                    <input
                        type="text"
                        name="nom"
                        placeholder="Nom de la ville (ex: Casablanca)"
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
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Liste des villes ({cities.length})</h2>

                {cities.length === 0 ? (
                    <p style={{ color: "var(--color-text-muted)" }}>Aucune ville enregistrée.</p>
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
                                {cities.map((city) => (
                                    <tr key={city.id}>
                                        <td>{city.nom}</td>
                                        <td style={{ textAlign: "right" }}>
                                            <form action={removeCity}>
                                                <input type="hidden" name="id" value={city.id} />
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
