import { getPromoters } from "@/actions/promoters";
import { getCities, getCategories } from "@/actions/taxonomies";
import Navbar from "@/components/public/Navbar";
import styles from "./home.module.css";
import Link from "next/link";
import PromoterGrid from "@/components/public/PromoterGrid";
import Particles from "@/components/public/Particles";

export default async function Home() {
  const [promoters, cities, categories] = await Promise.all([
    getPromoters(),
    getCities(),
    getCategories()
  ]);

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero}>
          <Particles count={30} />
          <div className={styles.heroGlow}></div>
          <div className={`glass-panel ${styles.heroCard} animate-fade-in-up`}>
            <h1 className={`${styles.heroTitle} animate-fade-in-up delay-100`}>SDM virtuel</h1>
            <p className={`${styles.heroSubtitle} animate-fade-in-up delay-200`}>
              Le salon virtuel des promoteurs<br />immobiliers au Maroc
            </p>
            <p className={`${styles.heroText} animate-fade-in-up delay-300`}>
              Explorez les projets résidentiels, villas et appartements<br />des meilleurs promoteurs en immersion totale.
            </p>
            <div className={`animate-fade-in-up delay-400`}>
              <Link href="/contact" className={`${styles.heroButton} animate-pulse`}>Exposer vos projets</Link>
            </div>
          </div>
        </section>

        {/* Filters and Grid Section */}
        <section className={styles.content}>
          <div className={styles.sectionHeader}>
            {/* The title and text moved inside the Client Component for tighter coupling, or we keep it here.
                I moved them inside PromoterGrid so we just drop the component. */}
          </div>
          <PromoterGrid
            initialPromoters={promoters}
            categories={categories}
            cities={cities}
          />
        </section>

        {/* --- Section Bottom Slogan --- */}
        <div style={{
          textAlign: "center",
          padding: "4rem 0 2rem",
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "4px",
          fontSize: "0.85rem",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem"
        }}>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5))" }}></div>
          MODERNE • CONFIANCE • INNOVATION
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(270deg, transparent, rgba(255,255,255,0.5))" }}></div>
        </div>
      </main>
    </>
  );
}
