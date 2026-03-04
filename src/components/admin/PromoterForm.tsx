"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import styles from "./form.module.css";
import FileUpload from "@/components/admin/FileUpload";
import { createPromoter, updatePromoter } from "@/actions/promoters";

interface FormProps {
    initialData?: any;
    categories: any[];
    cities: any[];
}

export default function PromoterForm({ initialData, categories, cities }: FormProps) {
    const router = useRouter();
    const isEditing = !!initialData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        nom: initialData?.nom || "",
        villeId: initialData?.villeId || (cities.length > 0 ? cities[0].id : ""),
        categorieId: initialData?.categorieId || (categories.length > 0 ? categories[0].id : ""),
        description: initialData?.description || "",
        contact: initialData?.contact || "",
        logo: initialData?.logo || null,
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
                await updatePromoter(initialData.id, formData);
            } else {
                await createPromoter(formData);
            }
            router.push("/admin/promoteurs");
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
                    <Link href="/admin/promoteurs" className={styles.link}>
                        <ArrowLeft size={20} />
                        Retour
                    </Link>
                </div>
                <h1 className="title-gradient" style={{ fontSize: "2rem" }}>
                    {isEditing ? `Modifier ${initialData.nom}` : "Ajouter un promoteur"}
                </h1>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formLayout}>
                <form id="promoter-form" onSubmit={handleSubmit} className={`glass-panel ${styles.formContent}`}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nom">Nom de l'entreprise *</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            required
                            value={formData.nom}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Ex: Bâtiment Pro Maroc"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="villeId">Ville *</label>
                            <select
                                id="villeId"
                                name="villeId"
                                required
                                value={formData.villeId}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="categorieId">Catégorie *</label>
                            <select
                                id="categorieId"
                                name="categorieId"
                                required
                                value={formData.categorieId}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="contact">Contact * (Email, Téléphone ou Site web)</label>
                        <input
                            type="text"
                            id="contact"
                            name="contact"
                            required
                            value={formData.contact}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Ex: contact@entreprise.ma | +212 6... "
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
                            placeholder="Détaillez les activités et l'expertise de l'entreprise..."
                        />
                    </div>

                    <div className={styles.submitSection}>
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            <Save size={20} />
                            {loading ? "Enregistrement..." : "Enregistrer le promoteur"}
                        </button>
                    </div>
                </form>

                <div className={`glass-panel ${styles.sidebarLogo}`}>
                    <h3 style={{ marginBottom: "1rem" }}>Logo de l'entreprise</h3>
                    <p className={styles.helperText}>
                        Format recommandé : PNG ou JPG avec fond transparent, carré (ratio 1:1).
                    </p>
                    <FileUpload
                        label="Téléverser un logo"
                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, logo: url }))}
                        currentImageUrl={formData.logo}
                    />
                </div>
            </div>
        </div>
    );
}
