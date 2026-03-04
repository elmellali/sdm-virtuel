import Navbar from "@/components/public/Navbar";
import Particles from "@/components/public/Particles";
import styles from "./about.module.css";
import { Eye, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
    title: "À propos | SDM Virtuel",
    description: "Découvrez notre mission : révolutionner l'expérience immobilière au Maroc grâce à la réalité virtuelle et l'innovation numérique.",
};

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <Particles count={30} />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <span className={styles.subtitle}>Notre Histoire</span>
                        <h1 className={`title-gradient ${styles.title}`}>Redéfinir l'Immobilier</h1>
                        <p className={styles.text}>
                            SDM Virtuel est né d'une vision simple : éliminer les frontières physiques de l'investissement immobilier au Maroc. Nous créons la rencontre parfaite entre les promoteurs d'excellence et les acquéreurs exigeants.
                        </p>
                    </div>

                    <div className={styles.contentBlock}>
                        <div className={`glass-panel`} style={{ padding: "3rem", borderRadius: "24px" }}>
                            <h2 className={styles.blockTitle}>La Première Expo Immersive</h2>
                            <p className={styles.blockText}>
                                Fini le temps des simples brochures PDF et des maquettes en plastique. Chez SDM Virtuel, nous croyons qu'un investissement de toute une vie mérite d'être ressenti avant d'être signé. En fédérant les meilleurs promoteurs du pays, nous avons créé le premier hall d'exposition 100% digital, interactif et ouvert 24h/24.
                                <br /><br />
                                De Tanger à Dakhla, explorez les plans, marchez dans les salons en 360°, et prenez des décisions éclairées depuis le confort de votre canapé.
                            </p>
                        </div>
                    </div>

                    <div className={styles.valuesGrid}>
                        <div className={`glass-panel ${styles.valueCard}`}>
                            <div className={styles.iconWrapper}>
                                <Eye size={36} />
                            </div>
                            <h3>Immersion Totale</h3>
                            <p>Visites en réalité augmentée et 360° ultra-réalistes pour apprécier chaque détail architectural de votre futur bien.</p>
                        </div>
                        <div className={`glass-panel ${styles.valueCard}`}>
                            <div className={styles.iconWrapper}>
                                <ShieldCheck size={36} />
                            </div>
                            <h3>Confiance & Sécurité</h3>
                            <p>Nous sélectionnons rigoureusement nos promoteurs partenaires pour vous garantir transparence et fiabilité.</p>
                        </div>
                        <div className={`glass-panel ${styles.valueCard}`}>
                            <div className={styles.iconWrapper}>
                                <Zap size={36} />
                            </div>
                            <h3>Innovation Continue</h3>
                            <p>Notre plateforme technologique redéfinit en permanence les standards de l'expérience d'achat immobilier.</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
