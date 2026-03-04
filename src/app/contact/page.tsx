import Navbar from "@/components/public/Navbar";
import Particles from "@/components/public/Particles";
import styles from "./contact.module.css";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const metadata = {
    title: "Devenir Promoteur Partenaire | SDM Virtuel",
    description: "Rejoignez SDM Virtuel et exposez vos projets immobiliers.",
};

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <Particles count={40} />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <span className={styles.subtitle}>Partenariat Immobilier</span>
                        <h1 className={`title-gradient ${styles.title}`}>Devenir Promoteur</h1>
                        <p className={styles.text}>
                            Vous développez des projets immobiliers d'exception au Maroc ?
                            Rejoignez la première plateforme d'exposition virtuelle et offrez à vos clients une immersion 360° inédite.
                        </p>
                    </div>

                    <div className={styles.contentWrapper}>
                        {/* Informations de contact */}
                        <div className={styles.contactInfo}>
                            <div className={`glass-panel ${styles.infoCard}`}>
                                <div className={styles.iconWrapper}>
                                    <Phone size={24} />
                                </div>
                                <div className={styles.infoContent}>
                                    <h3>Appelez-nous</h3>
                                    <p>Notre équipe commerciale est à votre écoute du Lundi au Vendredi.<br /><strong>+212 5 22 XX XX XX</strong></p>
                                </div>
                            </div>

                            <div className={`glass-panel ${styles.infoCard}`}>
                                <div className={styles.iconWrapper}>
                                    <Mail size={24} />
                                </div>
                                <div className={styles.infoContent}>
                                    <h3>Écrivez-nous</h3>
                                    <p>Envoyez-nous les détails de votre entreprise pour une étude rapide.<br /><strong>partenaires@sdm.ma</strong></p>
                                </div>
                            </div>

                            <div className={`glass-panel ${styles.infoCard}`}>
                                <div className={styles.iconWrapper}>
                                    <MapPin size={24} />
                                </div>
                                <div className={styles.infoContent}>
                                    <h3>Nos bureaux</h3>
                                    <p>SDM Virtuel Expo<br />Twin Center, Tour A, 14ème étage<br />Casablanca, Maroc</p>
                                </div>
                            </div>
                        </div>

                        {/* Formulaire de demande */}
                        <div className={`glass-panel ${styles.formCard}`}>
                            <h2 style={{ fontSize: "1.8rem", color: "white", marginBottom: "2rem" }}>Demande de Partenariat</h2>
                            <form>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="firstName">Prénom</label>
                                        <input type="text" id="firstName" className={styles.input} placeholder="John" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="lastName">Nom</label>
                                        <input type="text" id="lastName" className={styles.input} placeholder="Doe" />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="company">Nom de votre société de promotion</label>
                                    <input type="text" id="company" className={styles.input} placeholder="Ex: Groupe Palmeraie" />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email professionnel</label>
                                    <input type="email" id="email" className={styles.input} placeholder="contact@votre-societe.ma" />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message">Parlez-nous de vos projets en cours</label>
                                    <textarea id="message" className={styles.textarea} placeholder="Nous avons actuellement 3 projets de résidences fermées sur Rabat..."></textarea>
                                </div>

                                <button type="button" className={styles.submitBtn}>
                                    <Send size={18} />
                                    Envoyer la demande
                                </button>
                                <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "1rem", textAlign: "center" }}>
                                    En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
