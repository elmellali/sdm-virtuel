"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Send, Landmark } from "lucide-react";
import styles from "./BankContactModal.module.css";
import { sendBankRequest } from "@/actions/contact";

interface BankContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    bankName: string;
    promoterName: string;
}

export default function BankContactModal({ isOpen, onClose, bankName, promoterName }: BankContactModalProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: ""
    });

    const [mounted, setMounted] = useState(false);

    // Initialiser le montage au chargement du client
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const result = await sendBankRequest({
                ...formData,
                bankName,
                promoterName
            });

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error || "Une erreur est survenue lors de l'envoi.");
            }
        } catch (err) {
            setError("Une erreur inattendue est survenue.");
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className={styles.overlay}>
            <div className={`glass-panel ${styles.modal} animate-fade-in`}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <Landmark className={styles.icon} size={24} />
                    </div>
                    <h2 className="title-gradient" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                        Financement {bankName}
                    </h2>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                        Laissez vos coordonnées pour être recontacté concernant votre projet chez <strong>{promoterName}</strong>.
                    </p>
                </div>

                {success ? (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>✓</div>
                        <h3>Demande envoyée avec succès !</h3>
                        <p>Un conseiller prendra contact avec vous dans les plus brefs délais.</p>
                        <button className={styles.primaryButton} onClick={onClose}>
                            Fermer
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">Prénom *</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="John"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">Nom *</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone">Téléphone *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="+212 6 XX XX XX XX"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Informations supplémentaires (Optionnel)</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className={styles.textarea}
                                placeholder="Détails de votre projet, montant souhaité..."
                                rows={3}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={loading}
                        >
                            <Send size={18} />
                            {loading ? "Envoi en cours..." : "Demander plus d'infos"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );

    // Ne rendre le portail que côté client pour éviter les erreurs d'hydratation
    return mounted ? createPortal(modalContent, document.body) : null;
}
