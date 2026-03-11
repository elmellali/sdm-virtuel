"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import styles from "./form.module.css"; // Reuse promoter form styles
import FileUpload from "@/components/admin/FileUpload";
import { createProject, updateProject } from "@/actions/projects";

interface FormProps {
    initialData?: any;
    promoters: any[];
    banks: any[];
}

export default function ProjectForm({ initialData, promoters, banks }: FormProps) {
    const router = useRouter();
    const isEditing = !!initialData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const formatDateForInput = (dateStr: string | null) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
    };

    const [formData, setFormData] = useState({
        nom: initialData?.nom || "",
        promoterId: initialData?.promoterId || (promoters.length > 0 ? promoters[0].id : ""),
        localisation: initialData?.localisation || "",
        surface: initialData?.surface || "",
        statut: initialData?.statut || "En cours",
        dateLivraison: formatDateForInput(initialData?.dateLivraison),
        description: initialData?.description || "",
        image360: initialData?.image360 || null,
        brochure: initialData?.brochure || null,
        bankIds: initialData?.banks?.map((b: any) => b.id) || []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isEditing) {
                await updateProject(initialData.id, formData);
            } else {
                await createProject(formData);
            }
            router.push("/admin/projets");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.backButton}>
                    <Link href="/admin/projets" className={styles.link}>
                        <ArrowLeft size={20} />
                        Retour
                    </Link>
                </div>
                <h1 className="title-gradient" style={{ fontSize: "2rem" }}>
                    {isEditing ? `Modifier ${initialData.nom}` : "Ajouter un projet 360°"}
                </h1>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formLayout}>
                <form id="project-form" onSubmit={handleSubmit} className={`glass-panel ${styles.formContent}`}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="nom">Nom du projet *</label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                required
                                value={formData.nom}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Ex: Tour Hassan II - Rénovation"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="promoterId">Promoteur associé *</label>
                            <select
                                id="promoterId"
                                name="promoterId"
                                required
                                value={formData.promoterId}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                {promoters.map((supp) => (
                                    <option key={supp.id} value={supp.id}>
                                        {supp.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="localisation">Localisation *</label>
                        <input
                            type="text"
                            id="localisation"
                            name="localisation"
                            required
                            value={formData.localisation}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Ex: Centre-ville, Casablanca"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="surface">Surface (en m²)</label>
                            <input
                                type="number"
                                id="surface"
                                name="surface"
                                value={formData.surface}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Ex: 12500"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="statut">Statut du projet *</label>
                            <select
                                id="statut"
                                name="statut"
                                required
                                value={formData.statut}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="En cours">En cours</option>
                                <option value="Livré">Livré</option>
                                <option value="À venir">À venir</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="dateLivraison">Date de livraison prévue / effective</label>
                        <input
                            type="date"
                            id="dateLivraison"
                            name="dateLivraison"
                            value={formData.dateLivraison}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description complète *</label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className={styles.textarea}
                            rows={5}
                            placeholder="Détaillez les spécificités du projet..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Banques partenaires associées</label>
                        <div style={{ 
                            display: "grid", 
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
                            gap: "0.75rem",
                            background: "rgba(255, 255, 255, 0.03)",
                            padding: "1rem",
                            borderRadius: "8px",
                            border: "1px solid var(--glass-border)"
                        }}>
                            {banks.map((bank) => (
                                <label key={bank.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.bankIds.includes(bank.id)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setFormData(prev => ({
                                                ...prev,
                                                bankIds: checked 
                                                    ? [...prev.bankIds, bank.id]
                                                    : prev.bankIds.filter((id: string) => id !== bank.id)
                                            }));
                                        }}
                                        style={{ width: "16px", height: "16px", accentColor: "var(--color-primary)" }}
                                    />
                                    {bank.nom}
                                </label>
                            ))}
                        </div>
                        {banks.length === 0 && (
                            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                                Aucune banque configurée. <Link href="/admin/banques" style={{ color: "var(--color-primary)" }}>En ajouter une</Link>
                            </p>
                        )}
                    </div>

                    <div className={styles.submitSection}>
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            <Save size={20} />
                            {loading ? "Enregistrement..." : "Enregistrer le projet"}
                        </button>
                    </div>
                </form>

                <div className={`glass-panel ${styles.sidebarLogo}`}>
                    <h3 style={{ marginBottom: "1rem" }}>Image 360° du projet</h3>
                    <p className={styles.helperText}>
                        Format recommandé : JPG ou PNG. Image équirectangulaire (Ratio 2:1).
                    </p>
                    <FileUpload
                        label="Téléverser une image 360°"
                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image360: url }))}
                        currentImageUrl={formData.image360}
                    />

                    <h3 style={{ marginBottom: "1rem", marginTop: "2rem" }}>Brochure Commerciale</h3>
                    <p className={styles.helperText}>
                        Format attendu : PDF. Sera téléchargeable par les clients publiquement.
                    </p>
                    <FileUpload
                        label="Uploader le PDF"
                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, brochure: url }))}
                        currentImageUrl={formData.brochure}
                    />
                </div>
            </div>
        </div>
    );
}
