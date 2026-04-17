'use client'

import Link from 'next/link'
import styles from './landing.module.css'

export default function LandingPage() {
  return (
    <main className={styles.container}>
      {/* Visual background split */}
      
      {/* 3D Exhibition Side */}
      <Link href="/exhibition" className={styles.side}>
        <div className={styles.bg3D}></div>
        <div className={styles.overlay}></div>
        <div className={styles.badge}>Innovation</div>
        <div className={styles.content}>
          <h1 className={styles.title}>Visite Virtuelle 3D</h1>
          <p className={styles.description}>
            Explorez notre salon virtuel en immersion totale. 
            Découvrez nos promoteurs et leurs projets comme si vous y étiez.
          </p>
          <div className={styles.button}>Lancer l'expérience</div>
        </div>
      </Link>

      {/* Official Website Side */}
      <Link href="/site" className={styles.side}>
        <div className={styles.bgSite}></div>
        <div className={styles.overlay}></div>
        <div className={styles.badge}>Confiance</div>
        <div className={styles.content}>
          <h1 className={styles.title}>Site Officiel</h1>
          <p className={styles.description}>
            Consultez le catalogue complet des projets immobiliers. 
            Accédez à toutes les informations techniques et commerciales.
          </p>
          <div className={styles.button}>Accéder au site</div>
        </div>
      </Link>
    </main>
  )
}
