import { getBanks, createBank, deleteBank } from "@/actions/banks";
import { revalidatePath } from "next/cache";
import styles from "./banques.module.css";
import { Trash2, Plus } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";

export default async function BanksPage() {
    const banks = await getBanks();

    async function addBank(formData: FormData) {
        "use server";
        const nom = formData.get("nom") as string;
        const logo = formData.get("logo") as string;
        const contact = formData.get("contact") as string;
        if (nom) {
            await createBank({ nom, logo: logo || undefined, contact: contact || undefined });
            revalidatePath("/admin/banques");
        }
    }

    async function removeBank(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        if (id) {
            await deleteBank(id);
            revalidatePath("/admin/banques");
        }
    }

    return (
        <div>
            <div className={styles.header}>
                <h1 className="title-gradient" style={{ fontSize: "2rem" }}>Gestion des Banques Partenaires</h1>
            </div>

            <div className={`glass-panel ${styles.addSection}`}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Ajouter une banque</h2>
                
                {/* Note: since FileUpload is a client component, we use a hidden input trick 
                    or split this into a client component. For simplicity in Server Actions, 
                    we'll just use a standard text input for logo URL for now, but to use FileUpload
                    we would normally create a client component wrapper. To keep it matching Cities, 
                    we'll stick to a simple text form. */}
                <form action={addBank} className={styles.addForm}>
                    <input
                        type="text"
                        name="nom"
                        placeholder="Nom de la banque (ex: Bank of Africa)"
                        required
                        className={styles.input}
                    />
                    <input
                        type="text"
                        name="logo"
                        placeholder="URL du logo (Optionnel)"
                        className={styles.input}
                    />
                    <input
                        type="text"
                        name="contact"
                        placeholder="Lien de contact (URL, email)"
                        className={styles.input}
                    />
                    <button type="submit" className={styles.addButton}>
                        <Plus size={20} />
                        Ajouter
                    </button>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Liste des banques ({banks.length})</h2>

                {banks.length === 0 ? (
                    <p style={{ color: "var(--color-text-muted)" }}>Aucune banque enregistrée.</p>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Logo</th>
                                    <th>Contact</th>
                                    <th style={{ width: "100px", textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {banks.map((bank) => (
                                    <tr key={bank.id}>
                                        <td style={{ fontWeight: 500 }}>{bank.nom}</td>
                                        <td>
                                            {bank.logo ? (
                                                <img src={bank.logo} alt={bank.nom} style={{ height: "30px", borderRadius: "4px" }} />
                                            ) : (
                                                <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>Aucun logo</span>
                                            )}
                                        </td>
                                        <td>
                                            {bank.contact ? (
                                                <a href={bank.contact.startsWith('http') || bank.contact.startsWith('mailto:') || bank.contact.startsWith('tel:') ? bank.contact : `https://${bank.contact}`} 
                                                   target="_blank" 
                                                   rel="noopener noreferrer"
                                                   style={{ color: "var(--color-primary)", fontSize: "0.9rem", textDecoration: "underline" }}>
                                                    Lien
                                                </a>
                                            ) : (
                                                <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>-</span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <form action={removeBank}>
                                                <input type="hidden" name="id" value={bank.id} />
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
