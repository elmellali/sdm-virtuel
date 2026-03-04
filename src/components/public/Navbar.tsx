import Link from "next/link";
import styles from "./navbar.module.css";
import { Lock } from "lucide-react";

export default function Navbar() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <strong style={{ fontWeight: 800, color: "white" }}>SDM</strong> <span style={{ fontWeight: 300, color: "rgba(255, 255, 255, 0.9)" }}>virtuel</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>Accueil</Link>
                    <Link href="/projets" className={styles.navLink}>Projets</Link>
                    <Link href="/about" className={styles.navLink}>À propos</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                </nav>

                <div className={styles.actions}>
                    <Link href="/admin" className={styles.adminButton} title="Espace Administrateur">
                        <Lock size={14} />
                        <span className={styles.adminText}>Login</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
