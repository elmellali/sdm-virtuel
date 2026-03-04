"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Building2, ChevronRight, X, Box } from "lucide-react";
import styles from "@/app/home.module.css";

interface PromoterGridProps {
    initialPromoters: any[];
    cities: any[];
    categories: any[];
}

export default function PromoterGrid({ initialPromoters, cities, categories }: PromoterGridProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const filteredPromoters = useMemo(() => {
        return initialPromoters.filter((promoter) => {
            const matchesSearch = promoter.nom.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = selectedCity ? promoter.villeId === selectedCity : true;
            const matchesCategory = selectedCategory ? promoter.categorieId === selectedCategory : true;

            return matchesSearch && matchesCity && matchesCategory;
        });
    }, [initialPromoters, searchQuery, selectedCity, selectedCategory]);

    const handleReset = () => {
        setSearchQuery("");
        setSelectedCity("");
        setSelectedCategory("");
    };

    return (
        <>
            <div className={styles.sectionHeader}>
                <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "white" }}>
                    Nos Promoteurs
                </h2>
                <div className={styles.filtersWrapper}>
                    <div className={`glass-panel ${styles.filtersBar}`}>
                        <div className={styles.filterGroup}>
                            <MapPin size={18} className={styles.filterIcon} />
                            <select
                                className={styles.filterSelect}
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="">Toutes les villes</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.nom}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterDivider}></div>

                        <div className={styles.filterGroup}>
                            <Building2 size={18} className={styles.filterIcon} />
                            <select
                                className={styles.filterSelect}
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Tous les types</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterDivider}></div>

                        <div className={styles.filterGroup}>
                            <Building2 size={18} className={styles.filterIcon} />
                            <select
                                className={styles.filterSelect}
                                value={""}
                                onChange={() => { }}
                            >
                                <option value="">Toutes les gammes</option>
                                <option value="standard">Standard</option>
                                <option value="moyen">Moyen standing</option>
                                <option value="haut">Haut standing</option>
                                <option value="luxe">Luxe</option>
                            </select>
                        </div>

                        <div className={styles.filterDivider}></div>

                        <div className={styles.filterGroup}>
                            <Search size={18} className={styles.filterIcon} />
                            <input
                                type="text"
                                placeholder="Rechercher un promoteur..."
                                className={styles.filterInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className={styles.clearSearchBtn}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <button onClick={handleReset} className={styles.resetButton}>Réinitialiser</button>
                    </div>
                </div>
            </div>

            {
                filteredPromoters.length === 0 ? (
                    <div className={`glass-panel ${styles.emptyState}`}>
                        <Search size={48} style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }} />
                        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Aucun résultat trouvé</h3>
                        <p style={{ color: "var(--color-text-muted)" }}>Essayez de modifier vos filtres pour trouver ce que vous cherchez.</p>
                        <button onClick={handleReset} className={styles.resetButtonAction}>Effacer les filtres</button>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filteredPromoters.map((promoter, index) => {
                            const delayClass = `delay-${((index % 5) + 1) * 100}`;
                            return (
                                <div key={promoter.id} className={`${styles.promoterCard} animate-fade-in-up ${delayClass}`}>
                                    <div className={styles.cardImageSide}>
                                        {promoter.logo ? (
                                            <img src={promoter.logo} alt={promoter.nom} className={styles.cardHeroImage} />
                                        ) : (
                                            <div className={styles.logoPlaceholder}>{promoter.nom.charAt(0)}</div>
                                        )}
                                    </div>

                                    <div className={styles.cardContentSide}>
                                        <h3 className={styles.promoterName}>{promoter.nom}</h3>
                                        <div className={styles.promoterLocation}>
                                            <MapPin size={12} />
                                            {promoter.ville.nom}
                                        </div>
                                        <p className={styles.promoterDesc}>
                                            {promoter.description.length > 70
                                                ? `${promoter.description.substring(0, 70)}...`
                                                : promoter.description}
                                        </p>

                                        <div className={styles.projectsCount}>
                                            {promoter._count.projets} projet{promoter._count.projets > 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <Link href={`/promoteur/${promoter.id}`} className={styles.exploreCubeBtn}>
                                        <img src="/cube.svg" alt="Voir en Immersion" />
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                )
            }
        </>
    );
}
